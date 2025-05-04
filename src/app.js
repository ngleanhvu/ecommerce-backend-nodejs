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
app.use(express.json());
// init db
require("./dbs/init.mongodb");
// init routes
app.use("/", require("./routers"));
// handle errors
app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    code: statusCode,
    message: error.message || "Internal Server Error",
    status: "error",
  });
});
module.exports = app;
