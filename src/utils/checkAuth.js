"use strict";

const { BadRequestError } = require("../core/errror.response");
const { findById } = require("../services/apikey.service");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY];
  if (!key) {
    throw new BadRequestError("Error: Api key not found in header");
  }
  // Check objKey
  const objKey = await findById(key.toString());
  if (!objKey) {
    throw new BadRequestError("Error: Key not found");
  }
  req.objKey = objKey;
  return next();
};

const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      throw new BadRequestError("Error: Permission not found in api key");
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      throw new BadRequestError("Error: Invalid permission");
    }
    return next();
  };
};

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
module.exports = {
  apiKey,
  checkPermission,
  asyncHandler,
};
