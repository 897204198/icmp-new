'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  if (data.type == 'agree') {
    common.jsonRes(req, res, '/agree');
  } else if (data.type == 'refuse') {
    common.jsonRes(req, res, '/refuse');
  } else if (data.type == 'delete') {
    common.jsonRes(req, res, '/delete');
  } else {

  }
};
