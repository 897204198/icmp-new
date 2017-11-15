'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  var username = decodeURI(data.username);
  if (username == '陈冰洁') {
    common.jsonRes(req, res, '/chenbj');
  } else if (username == '郝逸飞') {
    common.jsonRes(req, res, '/haoyf');
  } else if (username == '何鑫') {
    common.jsonRes(req, res, '/hex');
  } else if (username == '金孟楠') {
    common.jsonRes(req, res, '/jinmn');
  } else if (username == '李晨熙') {
    common.jsonRes(req, res, '/licx');
  } else if (username == '李一鸣') {
    common.jsonRes(req, res, '/liym');
  } else if (username == '时浩宇') {
    common.jsonRes(req, res, '/shiny');
  } else if (username == '孙帅') {
    common.jsonRes(req, res, '/suns');
  } else if (username == '王贺') {
    common.jsonRes(req, res, '/wangh');
  } else if (username == '王维') {
    common.jsonRes(req, res, '/wangw');
  } else if (username == '王怡') {
    common.jsonRes(req, res, '/wangy');
  } else if (username == '王') {
    common.jsonRes(req, res, '/wang');
  }  else {
    common.jsonRes(req, res, '/liym');
  }
};
