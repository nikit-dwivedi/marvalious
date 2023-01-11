require('dotenv').config()
const mongoose = require("mongoose");
const userName = process.env.DATABASE_USERNAME
const passWord = process.env.DATABASE_PASSWORD
const url = process.env.DATABASE_URL
db = mongoose.connect(
  `mongodb+srv://${userName}:${passWord}@${url}/Marvellous`,
  (err) => {
    console.log("Database connected");
    if (err) {
      console.log(err);
    }
  }
);
module.exports = { db };


