'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  var returnData = {};
  if (data.serviceName == 'notifyPublishQueryService') {
    common.jsonRes(req, res, '/notifyDetail');
  } else if (data.serviceName == 'pushMsgQueryService') {
    common.jsonRes(req, res, '/msgDetail');
  } else {
    common.jsonRes(req, res, '/otherDetail');
  }
};
