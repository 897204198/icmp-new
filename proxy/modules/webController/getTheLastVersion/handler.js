'use strict';

var handler = module.exports = {};

handler.onPost = function (req, res, data) {
  var returnData = {
    "result": "0",
    "versionNo": "1"
  };
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(returnData));
};
