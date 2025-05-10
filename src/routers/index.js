"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, checkPermission } = require("../utils/checkAuth");
// check api key
// router.use(apiKey);
// check permissions
// router.use(checkPermission("0000"));

router.use("/v1/api/", require("./access"));
router.use("/v1/api/shop/products", require('./product'))

module.exports = router;
