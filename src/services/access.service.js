"use strict";

const { format } = require("path");
const shopModel = require("../models/shop.model");
const { createTokenPair } = require("../utils/authUtils");
const keyTokenService = require("./keytoken.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInfoData } = require("../utils/index");
const { findByEmail } = require("../services/shop.service");
const {
  BadRequestError,
  ConflictRequestError,
} = require("../core/errror.response");
const { random } = require("lodash");
const keytokenModel = require("../models/keytoken.model");
const KeyTokenService = require("./keytoken.service");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  // 1-check email
  // 2-match password
  // 3-create access token and refresh token
  // 4-generate token
  // 5-get data return login
  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Error: Shop not registered!");
    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new BadRequestError("Error: Password not match");
    // create private key and public key
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");
    // create tokens
    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );
    await keyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey,
    });
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens: tokens,
      code: "201",
    };
  };
  static signUp = async ({ name, email, password }) => {
    // step 1: check exits email
    const hodelShop = await shopModel.findOne({ email: email });
    if (hodelShop) {
      throw new BadRequestError("Error: Shop already registered");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });
    if (newShop) {
      // create private key and public key
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });
      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      console.log(privateKey, publicKey);
      const keyStore = await keyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keyStore) {
        throw new BadRequestError("Error: Api Key Error");
      }

      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      return {
        code: "201",
        metadata: {
          shop: getInfoData({
            object: newShop,
            fields: ["_id", "name", "email"],
          }),
          tokens,
        },
      };
    }
  };
}

module.exports = AccessService;
