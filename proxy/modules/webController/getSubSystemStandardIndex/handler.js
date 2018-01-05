'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.data == null || data.data.webPath == "/demo/leaveApplyForm") {
    if (data.processName === 'processName1') {
      common.jsonRes(req, res, '/all_1');
    }else if (data.processName === 'processName2') {
      common.jsonRes(req, res, '/all_2');
    }else {
      common.jsonRes(req, res, '/all_3');
    }  
  }
};
