'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  var query = common.parseUrl(req).query;
  if (query.userId == 'chenbj') {
    common.jsonRes(req, res, '/chenbj');
  } else if (query.userId == 'haoyf') {
    common.jsonRes(req, res, '/haoyf');
  } else if (query.userId == 'hex') {
    common.jsonRes(req, res, '/hex');
  } else if (query.userId == 'jinmn') {
    common.jsonRes(req, res, '/jinmn');
  } else if (query.userId == 'licx') {
    common.jsonRes(req, res, '/licx');
  } else if (query.userId == 'liym') {
    common.jsonRes(req, res, '/liym');
  } else if (query.userId == 'shiny') {
    common.jsonRes(req, res, '/shiny');
  } else if (query.userId == 'Bearer suns') {
    common.jsonRes(req, res, '/suns');
  } else if (query.userId == 'wangh') {
    common.jsonRes(req, res, '/wangh');
  } else if (query.userId == 'wanghp') {
    common.jsonRes(req, res, '/wanghp');
  } else if (query.userId == 'wangw') {
    common.jsonRes(req, res, '/wangw');
  } else if (query.userId == 'Bearer wangy') {
    common.jsonRes(req, res, '/wangy');
  } else if (query.userId == 'liucy') {
    common.jsonRes(req, res, '/liucy');
  } else if (query.userId == 'wangls') {
    common.jsonRes(req, res, '/wangls');
  } else if (query.userId == 'cuiwc') {
    common.jsonRes(req, res, '/cuiwc');
  } else {
    res.writeHeader(400, { 'Content-Type': 'text/plain;charset=UTF-8' });
    res.end('无权限');
  }
};
