const express = require('express');
const router = express.Router();
const { login, verifyUserOtp, register } = require('../controllers/auth.controller');

router.post('/login', login);
router.post('/verify', verifyUserOtp);


module.exports = router