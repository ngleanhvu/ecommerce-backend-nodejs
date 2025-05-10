"use strict";

const express = require("express");
const router = express.Router();
const productService = require('../../services/product.service')
const {asyncHandler} = require('../../helpers/asynchandler')
const { authentication } = require("../../utils/authUtils");
const productController = require("../../controllers/product.controller");
// authentication
router.use(asyncHandler(authentication))
router.post("", asyncHandler(productController.createProduct))

module.exports = router;
