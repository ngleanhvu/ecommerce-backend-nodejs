"use strict";

const { Types } = require("mongoose");
const keyTokenModel = require("../models/keytoken.model");
const { identity } = require("lodash");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    // level 0
    // const tokens = await keyTokenModel.create({
    //   user: userId,
    //   publicKey: publicKey,
    //   privateKey: privateKey,
    // });
    // return tokens ? tokens.publicKey : null;
    // level xxx
    const filter = { user: userId },
      update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
      options = { upsert: true, new: true };
    const tokens = await keyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  }
  
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({_id: id})
  }

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshTokensUsed: refreshToken})
  }

  static deleteKeyById = async(userId) => {
    return await keyTokenModel.deleteOne( {user: new Types.ObjectId(userId)})
  }

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({refreshToken: refreshToken})
  }
}

module.exports = KeyTokenService;
