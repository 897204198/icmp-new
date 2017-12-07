'use strict';

var handler = module.exports = {};
var common = require('../common.js');

handler.onGet = function (req, res, data) {
  var token = req.headers['x-pep-token'];

  if (token == 'Bearer chenbj') {
    common.jsonRes(req, res, '/chenbj');
  } else if (token == 'Bearer haoyf') {
    common.jsonRes(req, res, '/haoyf');
  } else if (token == 'Bearer hex') {
    common.jsonRes(req, res, '/hex');
  } else if (token == 'Bearer jinmn') {
    common.jsonRes(req, res, '/jinmn');
  } else if (token == 'Bearer licx') {
    common.jsonRes(req, res, '/licx');
  } else if (token == 'Bearer liym') {
    common.jsonRes(req, res, '/liym');
  } else if (token == 'Bearer shiny') {
    common.jsonRes(req, res, '/shiny');
  } else if (token == 'Bearer suns') {
    common.jsonRes(req, res, '/suns');
  } else if (token == 'Bearer wangh') {
    common.jsonRes(req, res, '/wangh');
  } else if (token == 'Bearer wangw') {
    common.jsonRes(req, res, '/wangw');
  } else if (token == 'Bearer wangy') {
    common.jsonRes(req, res, '/wangy');
  } else if (token == 'Bearer liucy') {
    common.jsonRes(req, res, '/liucy');
  } else if (token == 'Bearer wangls') {
    common.jsonRes(req, res, '/wangls');
  } else {
    res.writeHeader(400, { 'Content-Type': 'text/plain;charset=UTF-8' });
    res.end('无权限');
  }
};
