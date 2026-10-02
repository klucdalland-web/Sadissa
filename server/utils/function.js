const config = require('../config/index');

const print = (...params) => {
  if (config.env === 'development') {
    console.log(...params);
  }
};

const SUCCESS_STATUSES = [200, 201, 202, 204];

function res(resp, status, message, data) {
  return resp.status(status).json({
    status: SUCCESS_STATUSES.includes(status),
    message,
    data,
  });
}

module.exports = {
  print,
  res,
};
