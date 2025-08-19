const mongoose = require("mongoose");
const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URI);
    console.log("DB Connected");
  } catch (err) {
    console.log(err);
  }
};
module.exports = dbConnect;