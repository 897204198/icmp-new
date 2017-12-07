'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  var deptId = common.parseUrl(req).query.deptId;

  if (deptId == '1') {
    common.jsonRes(req, res, '/hxDepartment');
  } else if (deptId == '2') {
    common.jsonRes(req, res, '/nhDepartment');
  } else {
    common.jsonRes(req, res, '/hospitalArea');
  }
};
