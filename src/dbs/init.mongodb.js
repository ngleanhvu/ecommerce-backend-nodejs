"use strict";

const mongoose = require("mongoose");
const {
  db: { host, port, name },
} = require("../configs/config.mongodb");
const username = "admin";
const password = "1234";
const { countConnect } = require("../helpers/check.connect");
const connectString = `mongodb://${host}:${port}/${name}`;

class Database {
  constructor() {
    this.connect();
  }
  connect(type = "mongodb") {
    if (1 == 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => console.log(`Connect Mongodb Success!`), countConnect())
      .catch((err) => console.log("Error Connect Mongodb"));
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    } else {
      return Database.instance;
    }
  }
}

const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
