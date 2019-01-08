'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  var userId = common.parseUrl(req).query.userId;

  if (userId == 'chenbj') {
    common.jsonRes(req, res, '/chenbj');
  } else if (userId == 'haoyf') {
    common.jsonRes(req, res, '/haoyf');
  } else if (userId == 'hex') {
    common.jsonRes(req, res, '/hex');
  } else if (userId == 'jinmn') {
    common.jsonRes(req, res, '/jinmn');
  } else if (userId == 'licx') {
    common.jsonRes(req, res, '/licx');
  } else if (userId == 'liym') {
    common.jsonRes(req, res, '/liym');
  } else if (userId == 'shiny') {
    common.jsonRes(req, res, '/shiny');
  } else if (userId == 'suns') {
    common.jsonRes(req, res, '/suns');
  } else if (userId == 'wangh') {
    common.jsonRes(req, res, '/wangh');
  } else if (userId == 'wangw') {
    common.jsonRes(req, res, '/wangw');
  } else if (userId == 'wangy') {
    common.jsonRes(req, res, '/wangy');
  } else if (userId == 'liucy') {
    common.jsonRes(req, res, '/liucy');
  } else if (userId == 'wangls') {
    common.jsonRes(req, res, '/wangls');
  } else if (userId == 'cuiwc') {
    common.jsonRes(req, res, '/cuiwc');
  } else {
    common.jsonRes(req, res, '/empty');
  }
};
