'use strict';

var handler = module.exports = {};

handler.onPost = function (req, res, data) {
  var returnData = "http://chuantu.biz/t5/166/1502331697x3066599431.png";
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(returnData);
};

handler.onDelete = function(req, res) {
  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};