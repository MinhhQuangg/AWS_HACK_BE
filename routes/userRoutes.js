const express = require('express');
const userController = require('../controllers/userController');
const { googleLogin } = require('../controllers/googleController');

const router = express.Router();

router.post('/signup', userController.signUp);
router.post('/signin', userController.signIn);
router.post('/google', googleLogin);
router.get('/me', userController.protect, userController.getMe);

module.exports = router;
