"use strict";

const JWT = require("jsonwebtoken");
const {asyncHandler} = require('../helpers/asynchandler');
const { BadRequestError } = require("../core/errror.response");
const keytokenModel = require("../models/keytoken.model");
const {findByUserId} = require('../services/keytoken.service')

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-rtoken-id"
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });
  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });
  JWT.verify(accessToken, publicKey, (err, decode) => {
    if (err) {
      console.error(`error::verify::`, err);
    } else {
      console.log(`decode::verify::`, decode);
    }
  });
  return { accessToken, refreshToken };
};

const authentication = async (req, res, next) => {
  // 1. Check userId missing
  // 2. get access token
  // 3. verify token
  // 4. check user in dbs
  // 5. check keystore with userId
  // 6. Ok all => next
  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new BadRequestError("Invalid Request")

  const keyStore = await findByUserId(userId)
  console.log(keyStore)
  if (!keyStore) throw new BadRequestError("User id not found")
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new BadRequestError('Invalid request')
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw BadRequestError('Invalid UserId') 
    req.keyStore = keyStore
    return next()
  } catch(err) {
    throw err
  }  

}

const authenticationV2 = async (req, res, next) => {
  // 1. Check userId missing
  // 2. get access token
  // 3. verify token
  // 4. check user in dbs
  // 5. check keystore with userId
  // 6. Ok all => next
  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new BadRequestError("Invalid Request")

  const keyStore = await findByUserId(userId) 
  if (!keyStore) throw new BadRequestError("User id not found")

  if(req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      if(userId !== decodeUser.userId) throw BadRequestError('Invalid UserId') 
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (err) {
      throw err
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION]
  if (!accessToken) throw new BadRequestError('Invalid request')
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw BadRequestError('Invalid UserId') 
    req.keyStore = keyStore
    return next()
  } catch(err) {
    throw err
  }  

}

const verifyToken = async (token, keySecret) => {
  return await JWT.verify(token, keySecret)
}

module.exports = {
  createTokenPair,
  authentication,
  verifyToken,
  authenticationV2
};
