'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.serviceName != null && data.serviceName != 'undefined') {
    common.jsonRes(req, res, '/all_1');
  } else {
    common.jsonRes(req, res, '/all_3');
  }
};
