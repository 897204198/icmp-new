'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.serviceName != null && data.serviceName === 'emergency') {
    common.jsonRes(req, res, '/all_2');
    console.log('eee')
  } else {
    common.jsonRes(req, res, '/all');
  }
};
