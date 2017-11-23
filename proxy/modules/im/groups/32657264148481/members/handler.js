'use strict';

var handler = module.exports = {};

handler.onDelete = function(req, res) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};

handler.onPost = function(req, res, data) {
  console.info(data);
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};