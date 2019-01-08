'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');

handler.onDelete = function(req, res) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};

handler.onPost = function(req, res, data) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};

handler.onGet = function (req, res, data) {
  common.jsonRes(req, res, '/all');
};