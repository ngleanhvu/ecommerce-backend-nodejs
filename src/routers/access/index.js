"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const {asyncHandler} = require('../../helpers/asynchandler')
const { authenticationV2 } = require("../../utils/authUtils");

// sign-up
router.post("/shop/sign-up", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(asyncHandler(authenticationV2))
router.post("/shop/logout", asyncHandler(accessController.logout))
router.post("/shop/handleRefreshToken", asyncHandler(accessController.handlerRefreshToken))

module.exports = router;
