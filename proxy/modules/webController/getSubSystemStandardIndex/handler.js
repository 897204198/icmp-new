'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.data == null || data.data.webPath == "/demo/leaveApplyForm") {
    common.jsonRes(req, res, '/all');
  }
};
