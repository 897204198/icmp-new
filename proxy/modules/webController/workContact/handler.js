'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.serviceName == 'coperson') {
    common.jsonRes(req, res, '/all_2');
  } else {
    common.jsonRes(req, res, '/all_1');
  }
};
