"use strict";

const { extend } = require("lodash");

const StatusCode = {
  CREATED: 201,
  OK: 200,
};

const ReasonStatusCode = {
  CREATED: "Created",
  OK: "Success",
};

class SuccessResponse {
  constructor({
    message = ReasonStatusCode.OK,
    status = StatusCode.OK,
    metadata = {},
  }) {
    (this.message = message),
      (this.status = status),
      (this.metadata = metadata);
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OkResponse extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CreatedResponse extends SuccessResponse {
  constructor({
    message = ReasonStatusCode.CREATED,
    status = StatusCode.CREATED,
    metadata,
  }) {
    super({ message, status, metadata });
  }
}

module.exports = {
  OkResponse,
  CreatedResponse,
};
