"use strict";

const { format } = require("path");
const shopModel = require("../models/shop.model");
const { createTokenPair } = require("../utils/authUtils");
const keyTokenService = require("./keytoken.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { getInfoData } = require("../utils/index");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1: check exits email
      const hodelShop = await shopModel.findOne({ email: email });
      if (hodelShop) {
        return {
          code: "xxxx",
          message: "Shop already registered",
        };
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
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });
        console.log(privateKey, publicKey);
        const publicKeyString = await keyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxxx",
            message: "PublicKey string error",
          };
        }
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject,
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
