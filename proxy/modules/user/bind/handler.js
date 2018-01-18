'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('hex');
};

