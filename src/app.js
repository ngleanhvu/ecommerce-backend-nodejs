require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const app = express();

// init middleware
app.use(morgan("dev")); // 5 types: dev, combined, short, common, tiny
app.use(helmet());
app.use(compression());
// init db
require("./dbs/init.mongodb");
// init routes
app.get("/", (req, res, next) => {
  const helloStr = "Hello!";
  return res.status(200).json({
    message: "Welcome!",
    metadata: helloStr.repeat(200000),
  });
});
// handle errors

module.exports = app;
