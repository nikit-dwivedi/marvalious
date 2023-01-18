const express = require('express');
const router = express.Router();
const { login, verifyUserOtp, register } = require('../controllers/auth.controller');

router.post('/auth/login', login);
router.post('/verify', verifyUserOtp);


module.exports = router
