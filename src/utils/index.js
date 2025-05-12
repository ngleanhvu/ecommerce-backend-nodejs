"use strict";

const _ = require("lodash");

const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

const getSelectedData = (select = []) => {
  return Object.fromEntries(select.map(el => [el,1]))
}

module.exports = {
  getInfoData,
  getSelectedData
};
