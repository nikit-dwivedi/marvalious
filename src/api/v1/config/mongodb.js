const mongoose = require("mongoose");
db = mongoose.connect(
  "mongodb+srv://nikit:nikit@cluster0.053sm.mongodb.net/marvellous?retryWrites=true&w=majority",
  
  (err) => {
    console.log("Database connected");
    if (err) {
      console.log(err);
    }
  }
);
module.exports = { db };


// mongodb + srv://12345:12345@cluster0.b9h43w1.mongodb.net/?retryWrites=true&w=majority
//mongodb+srv://nikit:nikit@cluster0.053sm.mongodb.net/marvellous?retryWrites=true&w=majority