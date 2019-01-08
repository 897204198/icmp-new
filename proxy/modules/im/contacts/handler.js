'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
    common.jsonRes(req, res, '/all');
};
handler.onPost = function (req, res, data) {
  var returnData = {
    "result": "0"
  };
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(returnData));
};
