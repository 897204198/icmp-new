'use strict';

var handler = module.exports = {};

handler.onPost = function (req, res, data) {
  var returnData = "testfileId";
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(returnData);
};
