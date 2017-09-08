'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.serviceName == 'hospitalArea') {
    common.jsonRes(req, res, '/hospitalArea');
  } else if (data.serviceName == 'department') {
    if (data.hospitalArea == '1') {
      common.jsonRes(req, res, '/nhDepartment');
    } else if (data.hospitalAreaCode == '2') {
      common.jsonRes(req, res, '/hxDepartment');
    } else {
      common.jsonRes(req, res, '/nhDepartment');
    }
  } else {

  }
};
