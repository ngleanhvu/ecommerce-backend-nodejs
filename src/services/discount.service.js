const { BadRequestError } = require("../core/errror.response");
const { discount } = require("../models/discount.model");
const { convertToObjectIdMongodb } = require("../utils");
const { findAllProducts } = require("../repository/product.repository");
const {
  findAllDiscountCodeUnSelect,
  checkDiscountExist,
} = require("../repository/discount.repository");
const { filter } = require("lodash");

class DiscountService {
  static async createDiscountCode(payload) {
    const {
      code,
      start_date,
      end_date,
      is_active,
      shopId,
      min_order_value,
      product_ids,
      applies_to,
      name,
      description,
      type,
      value,
      max_value,
      max_uses,
      uses_count,
      max_uses_per_user,
      users_used,
    } = payload;
    if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
      throw new BadRequestError("Discount code has expired");
    }
    if (new Date(start_date) >= new Data(end_date)) {
      throw new BadRequestError(
        "Discount start date is after discount end date"
      );
    }
    // create index for discount code
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (foundDiscount && foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount is already existed");
    }

    const newDiscount = await discount.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_code: code,
      discount_value: value,
      discount_min_order_value: min_order_value,
      discount_max_value: max_value,
      discount_start_date: new Date(start_date),
      discount_end_date: new Date(end_date),
      discount_max_uses: max_uses,
      discount_uses_count: uses_count,
      discount_users_used: users_used,
      discount_shopId: shopId,
      discount_max_uses_per_user: max_uses_per_user,
      discount_is_active: is_active,
      discount_applies_to: applies_to,
      discount_product_ids: applies_to === "all" ? [] : product_ids,
    });
    return newDiscount;
  }

  static async updateDiscountCode() {}

  static async getAllDiscountCodeWithThisProduct({
    code,
    shopId,
    userId,
    limit,
    page,
  }) {
    const foundDiscount = await discount
      .findOne({
        discount_code: code,
        discount_shopId: convertToObjectIdMongodb(shopId),
      })
      .lean();

    if (!foundDiscount || !foundDiscount.discount_is_active) {
      throw new BadRequestError("Discount not exits");
    }
    let products;
    const { discount_applies_to, discount_product_ids } = foundDiscount;

    if (discount_applies_to == "all") {
      products = await findAllProducts({
        filter: {
          product_shop: convertToObjectIdMongodb(shopId),
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
      });
    }

    if (discount_applies_to == "specific") {
      products = await findAllProducts({
        filter: {
          _id: { $in: discount_product_ids },
          isPublished: true,
        },
        limit: +limit,
        page: +page,
        sort: "ctime",
      });
    }
  }

  static async getAllDiscountCodeByShop({ limit, page, shopId }) {
    return await findAllDiscountCodeUnSelect({
      limit: +limit,
      page: +page,
      filter: {
        discount_shopId: convertToObjectIdMongodb(shopId),
        discount_is_active: true,
      },
      unSelect: ["__v", "discount_shopId"],
      model: discount,
    });
  }

  static async getDiscountAmount({ codeId, userId, shopId, products }) {
    const foundShop = await checkDiscountExist({
      model: discount,

      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundShop) throw new BadRequestError("Discount not exist");

    const {
      discount_is_active,
      discount_max_uses,
      discount_min_order_value,
      discount_start_date,
      discount_end_date,
      discount_users_used,
      discount_type,
      discount_value,
    } = foundShop;

    if (!discount_is_active) throw new BadRequestError("Discount expired");

    if (!discount_max_uses) throw new BadRequestError("Discount are out");

    if (
      new Date() < new Date(discount_start_date) ||
      new Date() > new Date(discount_end_date)
    )
      throw new BadRequestError("Discount has expired");

    let totalOrder = 0;
    if (discount_min_order_value > 0) {
      totalOrder = products.reduce((acc, product) => {
        return acc + product.quantity * product.price;
      });

      if (totalOrder < discount_min_order_value)
        throw new BadRequestError(
          `Discount requires a minium order value of ${discount_min_order_value}`
        );
    }

    if (discount_max_uses_per_user > 0) {
      const userDiscount = discount_users_used.find(
        (user) => user.userId === userId
      );

      if (userDiscount) {
      }
    }

    const amount =
      discount_type === "fixed_amount"
        ? discount_value
        : totalOrder * (discount_value / 100);

    return {
      totalOrder,
      discount: amount,
      totalPrice: totalOrder - amount,
    };
  }

  static async deleteDiscountCode({ shopId, codeId }) {
    const deleted = await discount.findOneAndDelete({
      discount_code: codeId,
      discount_shopId: convertToObjectIdMongodb(shopId),
    });
    return deleted;
  }

  static async cancelDiscountCode({ codeId, shopId, userId }) {
    const foundShop = await checkDiscountExist({
      model: discount,
      filter: {
        discount_code: codeId,
        discount_shopId: convertToObjectIdMongodb(shopId),
      },
    });

    if (!foundShop) throw new BadRequestError("Discount not exit");

    const result = await discount.findByIdAndUpdate(foundDiscount._id, {
      $pull: {
        discount_users_used: userId,
      },
      $inc: {
        discount_max_uses: 1,
        discount_uses_count: -1,
      },
    });

    return result;
  }
}

module.exports = DiscountService;
