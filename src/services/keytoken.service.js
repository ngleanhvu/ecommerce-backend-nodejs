"use strict";

const keyTokenModel = require("../models/keytoken.model");

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
}

module.exports = KeyTokenService;
