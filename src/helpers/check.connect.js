"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5;
// Count connect
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of Mongodb connection: ${numConnect}`);
};

// Check overload connect
const checkOverload = () => {
  setInterval(() => {
    const numConnections = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number connections based on number osf cores
    const maxConnections = numCores * 5;
    console.log(`Active connections:${numConnections}`);
    console.log(`Memory usage:: ${memoryUsage} / 1024 / 1024`);
    if (numConnections > maxConnections) {
      console.log("Connection overload detected");
    }
  }, _SECONDS);
};
module.exports = {
  countConnect,
  checkOverload,
};
