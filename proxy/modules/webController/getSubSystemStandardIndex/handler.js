'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.data == null || data.data.webPath == "/demo/leaveApplyForm") {
    if (data.processName === 'processName1') {
      common.jsonRes(req, res, '/all_1');
    } else if (data.processName === 'processName2') {
      common.jsonRes(req, res, '/all_2');
    } else if (data.processName === 'processName3') {
      common.jsonRes(req, res, '/all_3');
    } else if (data.processName === 'processName4') {
      common.jsonRes(req, res, '/all_4');
    } else if (data.processName === 'processName5') {
      common.jsonRes(req, res, '/all_5');
    } else if (data.processName === 'processName6') {
      common.jsonRes(req, res, '/all_6');
    } else if (data.processName === 'processName7') {
      common.jsonRes(req, res, '/all_7');
    } else if (data.processName === 'processName8') {
      common.jsonRes(req, res, '/all_8');
    } else {
      common.jsonRes(req, res, '/all_7');
    }
  }
};
