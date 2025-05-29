const jwt = require('jsonwebtoken');
const { v5: uuidv5 } = require('uuid');
const { OAuth2Client } = require('google-auth-library');
const { GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { db, USERS_TABLE } = require('../config/dynamodb');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.googleLogin = async (req, res) => {
  const { token: idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing Google ID token',
    });
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const {
      sub: googleId,
      email,
      picture: profilePicture,
      given_name: givenName,
    } = payload;

    const userId = uuidv5(googleId, uuidv5.DNS);

    const getCommand = new GetCommand({
      TableName: USERS_TABLE,
      Key: {
        PK: `USER#${userId}`,
        SK: `PROFILE#${userId}`,
      },
    });

    const userResult = await db.send(getCommand);

    if (userResult.Item) {
      const jwtToken = signToken(userId);
      return res.status(200).json({
        status: 'success',
        user: userResult.Item,
        token: jwtToken,
      });
    }

    const newUser = {
      PK: `USER#${userId}`,
      SK: `PROFILE#${userId}`,
      id: userId,
      username: givenName,
      email: email.toLowerCase(),
      photo: profilePicture,
      authProvider: 'google',
      createdAt: new Date().toISOString(),
    };

    await db.send(
      new PutCommand({
        TableName: USERS_TABLE,
        Item: newUser,
      })
    );

    const jwtToken = signToken(userId);

    return res.status(201).json({
      status: 'success',
      user: newUser,
      token: jwtToken,
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    return res.status(500).json({
      status: 'fail',
      message: 'Google authentication failed',
    });
  }
};
