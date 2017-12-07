'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  var serviceName = common.parseUrl(req).query.serviceName;

  if (serviceName == 'notifyPublishQueryService') {
    common.jsonRes(req, res, '/notifyList');
  } else if (serviceName == 'pushMsgQueryService') {
    common.jsonRes(req, res, '/msgList');
  } else {
    common.jsonRes(req, res, '/otherList');
  }
};
