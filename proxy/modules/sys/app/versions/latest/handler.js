'use strict';

var handler = module.exports = {};

handler.onGet = function (req, res, data) {
  var returnData = {
    "versionNo": "10000",
    "note": "版本说明"
  };
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(returnData));
};
