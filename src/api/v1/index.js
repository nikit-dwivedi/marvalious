const express = require("express");
const router = express.Router();

require("../v1/config/mongodb");

const authRoute = require('./routes/auth.route.js')
const customerRoute = require('./routes/customer.route');



router.use("/auth", authRoute);
router.use('/customer', customerRoute);


module.exports = router;
