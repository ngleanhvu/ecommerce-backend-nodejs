"use strict";

const { unSelectedData } = require("../utils/index");

const findAllDiscountCodeUnSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(unSelectedData(unSelect))
    .lean();

  return products;
};

const findAllDiscountCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await model
    .find(filter)
    .sort(sortBy)
    .limit(limit)
    .skip(skip)
    .select(getSelectedData(select))
    .lean();

  return products;
};

const checkDiscountExist = (model, filter) => {
  return model.findOne(filter).lean();
};

module.exports = {
  findAllDiscountCodeSelect,
  findAllDiscountCodeUnSelect,
  checkDiscountExist,
};
