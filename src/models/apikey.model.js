"use strict";

const { Schema, model, default: mongoose } = require("mongoose");
const { collection } = require("./shop.model");
const COLLECTION_NAME = "Api Keys";
const DOCUMENT_NAME = "Api Key";
const apiKeySchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
    permissions: {
      type: [String],
      required: true,
      enum: ["0000", "1111", "2222"],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, apiKeySchema);
