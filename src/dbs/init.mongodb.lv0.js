"use strict";

const mongoose = require("mongoose");

const connectString = `mongodb://localhost:27017/shopdev`;
mongoose
  .connect(connectString)
  .then((_) => console.log("Connected Mongodb Success"))
  .catch((err) => console.log("Error Connect Mongodb!"));

// dev
if (1 === 0) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
