"use strict";

const { format } = require("path");
const shopModel = require("../models/shop.model");
const { createTokenPair, verifyToken} = require("../utils/authUtils");
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
  static login = async ({ email, password, refreshToken = null }) => {
    // 1-check email
    // 2-match password
    // 3-create access token and refresh token
    // 4-generate token
    // 5-get data return login
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
      userId: foundShop._id,
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

  static logout = async (keyStore) => {
    console.log(keyStore)
    const delKey = await keyTokenService.removeKeyById(keyStore._id)
    console.log(delKey)
    return delKey;
  }
  
  static handleRefreshToken = async (refreshToken) => {
    // check token is used  
    console.log(11)
    console.log(refreshToken)
    const foundToken = await keyTokenService.findByRefreshTokenUsed(refreshToken)
    if(foundToken) {
      const {userId, email} = await verifyToken(refreshToken, foundToken.privateKey)
      console.log(userId, email)
      await keyTokenService.deleteKeyById(userId)
      throw new BadRequestError("Something was wrong! Please login again")
    }
    const holderToken = await keyTokenService.findByRefreshToken(refreshToken)
    if(!holderToken) throw new BadRequestError("Shop not registered")
    // verify token
    const {userId, email} = await verifyToken(refreshToken, holderToken.privateKey)
    // check userId
    const foundShop = await findByEmail({email})
    if(!foundShop) throw new BadRequestError("Shop not registered")
    // create new token
    const tokens = await createTokenPair(
      {userId, email},
      holderToken.publicKey,
      holderToken.privateKey
    )
    // update token
    await holderToken.updateOne({
      $set: {
        refreshToken: tokens.refreshToken
      },
      $addToSet: {
        refreshTokensUsed: refreshToken // add to refresh token blacklist
      }
    })

    return {
      user: {userId, email},
      tokens
    }
  }
}

module.exports = AccessService;
