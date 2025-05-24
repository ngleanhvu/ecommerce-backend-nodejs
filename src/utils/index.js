"use strict";

const res = require("express/lib/response");
const _ = require("lodash");
const mongoose = require("mongoose");

const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

const getSelectedData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map((el) => [el, 0]));
};

const removeUndefineObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] == null) {
      delete obj[k];
    }
  });
  return obj;
};

const updateNestedObjectParser = (obj) => {
  let final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = res[a];
      });
    } else {
      final = obj[k];
    }
  });
  return final;
};

const convertToObjectIdMongodb = (id) => mongoose.Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectedData,
  unGetSelectData,
  removeUndefineObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
