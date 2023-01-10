const express = require('express');
const router = express.Router();


const { login } = require('../controllers/newAuth.controller')



router.post('/login', login);



module.exports = router