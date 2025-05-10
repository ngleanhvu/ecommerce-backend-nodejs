"use strict";

const express = require("express");
const router = express.Router();
const productService = require('../../services/product.service')
const {asyncHandler} = require('../../helpers/asynchandler')
const { authentication } = require("../../utils/authUtils");
// authentication
router.use(asyncHandler(authentication))
router.post("", asyncHandler(productService.createProduct))

module.exports = router;
