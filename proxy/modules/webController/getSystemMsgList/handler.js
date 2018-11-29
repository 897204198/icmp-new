'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.serviceName == 'notifyPublishQueryService') {
    common.jsonRes(req, res, '/notifyList');
  } else if (data.serviceName == 'pushMsgQueryService') {
    common.jsonRes(req, res, '/msgList');
  } else if (data.serviceName == 'VehicleBackService') {
    common.jsonRes(req, res, '/vehicleCar');
  } else {
    common.jsonRes(req, res, '/otherList');
  }
};
