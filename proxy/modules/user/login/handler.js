'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  let jsonData = JSON.parse(data);
  if (jsonData.loginName == 'chenbj' ||
    jsonData.loginName == 'haoyf' ||
    jsonData.loginName == 'hex' ||
    jsonData.loginName == 'jinmn' ||
    jsonData.loginName == 'licx' ||
    jsonData.loginName == 'liym' ||
    jsonData.loginName == 'shiny' ||
    jsonData.loginName == 'suns' ||
    jsonData.loginName == 'wangh' ||
    jsonData.loginName == 'wangw' ||
    jsonData.loginName == 'wangy' ||
    jsonData.loginName == 'wanghp' ||
    jsonData.loginName == 'wangls' ||
    jsonData.loginName == 'cuiwc' ||
    jsonData.loginName == 'liucy') {
    if (jsonData.password != 'E10ADC3949BA59ABBE56E057F20F883E') {
      common.jsonRes(req, res, '/passwordError');
    } else {
      var returnData = {
        "token": jsonData.loginName
      };
      res.writeHeader(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(returnData));
    }
  } else {
    common.jsonRes(req, res, '/noUser');
    return;
  }
};
