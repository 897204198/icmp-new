'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');

handler.onPost = function (req, res, data) {
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end('');
};

handler.onGet = function (req, res, data) {
  setTimeout(function() {
    common.jsonRes(req, res, '/all');
  }, 2000);
};
