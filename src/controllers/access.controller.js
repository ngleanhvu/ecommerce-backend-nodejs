"use strict";

const {
  CreatedResponse,
  SuccessResponse,
} = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout Success",
      metadata: await AccessService.logout(req.keyStore)
    }).send(res)
  }
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CreatedResponse({
      message: "Registered success!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
  handlerRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Refresh token success",
      metadata: await AccessService.handleRefreshToken(req.body.refreshToken)
    }).send(res)
  }
}

module.exports = new AccessController();
