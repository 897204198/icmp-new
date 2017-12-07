'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  common.jsonRes(req, res, '/all');
};
