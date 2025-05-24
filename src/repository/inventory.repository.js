const { inventory } = require("../models/inventory.model");
const { Types } = require("mongoose");
const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventory.create({
    inventory_productId: productId,
    inventory_stock: stock,
    inventory_location: location,
    inventory_shopId: shopId,
  });
};

module.exports = {
  insertInventory,
};
