'use strict';

var handler = module.exports = {};

handler.onPost = function (req, res, data) {
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end('');
};

handler.onPut = function(req, res, data) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};
