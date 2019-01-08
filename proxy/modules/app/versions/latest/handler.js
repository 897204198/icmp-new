'use strict';

var handler = module.exports = {};

handler.onGet = function (req, res, data) {
  var returnData = {
    "versionNo": "10000",
    "note": "版本说明",
    "iosUrl": "https://www.pgyer.com/Ak6z",
    "androidUrl": "https://www.pgyer.com/1jup"
  };
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(returnData));
};
