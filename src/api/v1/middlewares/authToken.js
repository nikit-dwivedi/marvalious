//--------------------------------------------------modules-------------------------------------------------//
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
//--------------------------------------------------helpers-------------------------------------------------//
const { forbidden, unauthorized } = require('../helpers/response_helper');



//-------------------------------------------------privateKey----------------------------------------------//
const adminPrivateKEY = fs.readFileSync("./key/admin/admin.private.pem", "utf8");
const userPrivateKEY = fs.readFileSync("./key/customer/user.private.pem", "utf8");

//--------------------------------------------------publicKey----------------------------------------------//
const adminPublicKEY = fs.readFileSync("./key/admin/admin.public.pem", "utf8");
const userPublicKEY = fs.readFileSync("./key/customer/user.public.pem", "utf8");

//--------------------------------------------------options-------------------------------------------------//
const signOption = { expiresIn: "30 days", algorithm: "PS256" };
const verifyOption = { expiresIn: "30 days", algorithm: ["PS256"] };



//--------------------------------------------------generate------------------------------------------------//
const generateUserToken = (user) => {
  const data = {
    userId: user.userId,
    customId: user.customerId,
    role: 0,
  };
  return jwt.sign(data, userPrivateKEY, signOption);
};
const generateAdminToken = (user) => {
  const data = {
    adminId: user.adminId,
    role: 2,
  };
  return jwt.sign(data, adminPrivateKEY, signOption);
};

// ------------------------------------------------authenticate------------------------------------------------//


function authenticateUser(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const decode = parseJwt(authHeader);
      const token = authHeader.split(" ")[1];
      if (decode.userRole == 1) {
        jwt.verify(token, adminPublicKEY, verifyOption);
        next();
      }
      else {
        jwt.verify(token, userPublicKEY, verifyOption);
        next();
      }
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");
  }
}

function authenticateAdmin(req, res, next) {
  let authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, adminPublicKEY, verifyOption);
      next();
    } catch (error) {
      unauthorized(res, "invalid token");
    }
  } else {
    forbidden(res, "token not found");;
  }
}

function parseJwt(data) {
  try {
    let token = data.slice(7);
    const decode = Buffer.from(token.split(".")[1], "base64");
    const toString = decode.toString();
    return JSON.parse(toString);
  } catch (e) {
    return null;
  }
}

async function encryption(data) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(data, salt);
  return hash;
}

async function checkEncryption(data, encryptData) {
  const check = await bcrypt.compare(data, encryptData);
  return check;
}

module.exports = {
  generateUserToken,
  authenticateUser,
  generateAdminToken,
  authenticateAdmin,
  parseJwt,
  encryption,
  checkEncryption,
};