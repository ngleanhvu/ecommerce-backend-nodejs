const { SuccessResponse } = require("../core/success.response");
const shopModel = require("../models/shop.model");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscountCode = async (req, res, next) => {
    new SuccessResponse({
      message: "Successful discount code generation",
      metadata: await DiscountService.createDiscountCode({
        ...req.body,
        shopId: req.user.shopId,
      }),
    }).send();
  };
}
