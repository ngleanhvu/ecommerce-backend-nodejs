"use strict";

const _ = require("lodash");

const getInfoData = ({ object = {}, fields = [] }) => {
  return _.pick(object, fields);
};

const getSelectedData = (select = []) => {
  return Object.fromEntries(select.map(el => [el,1]))
}

const unGetSelectData = (unSelect = []) => {
  return Object.fromEntries(unSelect.map(el => [el,0]))
}

module.exports = {
  getInfoData,
  getSelectedData,
  unGetSelectData
};
