"use strict";

const express = require("express");
const router = express.Router();
const productService = require("../../services/product.service");
const { asyncHandler } = require("../../helpers/asynchandler");
const { authenticationV2 } = require("../../utils/authUtils");
const productController = require("../../controllers/product.controller");

router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));
router.get("/search/:keyword", asyncHandler(productController.searchProduct));
// authentication
router.use(asyncHandler(authenticationV2));
router.post("", asyncHandler(productController.createProduct));
//QUERY
router.get("/draft/all", asyncHandler(productController.getAllDraftForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);
router.put(
  "/published/:id",
  asyncHandler(productController.publishProductForShop)
);
router.put(
  "/unPublished/:id",
  asyncHandler(productController.unPublishProductForShop)
);
router.patch("/:id", asyncHandler(productController.updateProduct));
module.exports = router;
