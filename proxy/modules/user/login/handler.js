'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {

  if (data.loginName == 'chenbj' ||
    data.loginName == 'haoyf' ||
    data.loginName == 'hex' ||
    data.loginName == 'jinmn' ||
    data.loginName == 'licx' ||
    data.loginName == 'liym' ||
    data.loginName == 'shiny' ||
    data.loginName == 'suns' ||
    data.loginName == 'wangh' ||
    data.loginName == 'wangw' ||
    data.loginName == 'wangy' ||
    data.loginName == 'wanghp' ||
    data.loginName == 'wangls' ||
    data.loginName == 'liucy') {
    if (data.password != 'E10ADC3949BA59ABBE56E057F20F883E') {
      common.jsonRes(req, res, '/passwordError');
    } else {
      var returnData = {
        "token": data.loginName
      };
      res.writeHeader(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(returnData));
    }
  } else {
    common.jsonRes(req, res, '/noUser');
    return;
  }
};
