'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  let jsonData = JSON.parse(data);
  if (jsonData.account == 'chenbj' ||
     jsonData.account == 'haoyf' ||
     jsonData.account == 'hex' ||
     jsonData.account == 'jinmn' ||
     jsonData.account == 'licx' ||
     jsonData.account == 'liym' ||
     jsonData.account == 'shiny' ||
     jsonData.account == 'suns' ||
     jsonData.account == 'wangh' ||
     jsonData.account == 'wangw' ||
     jsonData.account == 'wangy' ||
     jsonData.account == 'wanghp' ||
     jsonData.account == 'wangls' ||
     jsonData.account == 'cuiwc' ||
     jsonData.account == 'liucy') {

    if (jsonData.password == 'E10ADC3949BA59ABBE56E057F20F883E') {
      if (jsonData.account == 'chenbj') {
        common.jsonRes(req, res, '/chenbj');
      } else if (jsonData.account == 'haoyf') {
        common.jsonRes(req, res, '/haoyf');
      } else if (jsonData.account == 'hex') {
        common.jsonRes(req, res, '/hex');
      } else if (jsonData.account == 'jinmn') {
        common.jsonRes(req, res, '/jinmn');
      } else if (jsonData.account == 'licx') {
        common.jsonRes(req, res, '/licx');
      } else if (jsonData.account == 'liym') {
        common.jsonRes(req, res, '/liym');
      } else if (jsonData.account == 'shiny') {
        common.jsonRes(req, res, '/shiny');
      } else if (jsonData.account == 'suns') {
        common.jsonRes(req, res, '/suns');
      } else if (jsonData.account == 'wangh') {
        common.jsonRes(req, res, '/wangh');
      } else if (jsonData.account == 'wanghp') {
        common.jsonRes(req, res, '/wanghp');
      } else if (jsonData.account == 'wangw') {
        common.jsonRes(req, res, '/wangw');
      } else if (jsonData.account == 'wangy') {
        common.jsonRes(req, res, '/wangy');
      } else if (jsonData.account == 'liucy') {
        common.jsonRes(req, res, '/liucy');
      } else if (jsonData.account == 'wangls') {
        common.jsonRes(req, res, '/wangls');
      } else if (jsonData.account == 'cuiwc') {
        common.jsonRes(req, res, '/cuiwc');
      }
    } else {
      res.writeHeader(400, { 'Content-Type': 'application/json' });
      res.end('密码错误');
    }
  }
};
