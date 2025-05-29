const {
  PutCommand,
  GetCommand,
  QueryCommand,
} = require('@aws-sdk/lib-dynamodb');
const { db, USERS_TABLE } = require('../config/dynamodb');
const { ulid } = require('ulid');
const bcrypt = require('bcrypt');
const validator = require('validator');

const createUser = async ({
  username,
  email,
  password,
  confirmPassword,
  photo,
}) => {
  if (!username || !email || !password || !confirmPassword) {
    throw new Error('All fields are required');
  }

  if (password !== confirmPassword) {
    throw new Error('Passwords do not match');
  }

  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error('Email already in use. Please try using Google login');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = ulid();
  const userPhoto = photo || '/user/default.jpg';
  const item = {
    PK: `USER#${userId}`,
    SK: `PROFILE#${userId}`,
    id: userId,
    username,
    email,
    photo: userPhoto,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  await db.send(
    new PutCommand({
      TableName: USERS_TABLE,
      Item: item,
    })
  );

  delete item.password;
  return item;
};

const getUserByEmail = async (email) => {
  const result = await db.send(
    new QueryCommand({
      TableName: USERS_TABLE,
      IndexName: 'GSI1',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email,
      },
    })
  );
  return result.Items[0];
};

// Get a user by ID
const getUserById = async (id) => {
  const result = await db.send(
    new GetCommand({
      TableName: USERS_TABLE,
      Key: {
        PK: `USER#${id}`,
        SK: `PROFILE#${id}`,
      },
    })
  );
  const user = result.Item;
  if (user) delete user.password;
  return user;
};

// Handle login
const loginUser = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) throw new Error('No user found with this email');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Incorrect password');

  delete user.password;
  return user;
};

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  loginUser,
};
