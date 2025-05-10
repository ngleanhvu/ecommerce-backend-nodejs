"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/access.controller");
const {asyncHandler} = require('../../helpers/asynchandler')
const { authentication } = require("../../utils/authUtils");

// sign-up
router.post("/shop/sign-up", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(asyncHandler(authentication))
router.post("/shop/logout", asyncHandler(accessController.logout))
router.post("/shop/handleRefreshToken", asyncHandler(accessController.handlerRefreshToken))

module.exports = router;
