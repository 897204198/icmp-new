'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onGet = function (req, res, data) {
  var searchText = common.parseUrl(req).query.searchText;
  if (searchText == '陈冰洁') {
    common.jsonRes(req, res, '/chenbj');
  } else if (searchText == '郝逸飞') {
    common.jsonRes(req, res, '/haoyf');
  } else if (searchText == '何鑫') {
    common.jsonRes(req, res, '/hex');
  } else if (searchText == '金孟楠') {
    common.jsonRes(req, res, '/jinmn');
  } else if (searchText == '李晨熙') {
    common.jsonRes(req, res, '/licx');
  } else if (searchText == '李一鸣') {
    common.jsonRes(req, res, '/liym');
  } else if (searchText == '时浩宇') {
    common.jsonRes(req, res, '/shiny');
  } else if (searchText == '孙帅') {
    common.jsonRes(req, res, '/suns');
  } else if (searchText == '王贺') {
    common.jsonRes(req, res, '/wangh');
  } else if (searchText == '王浩鹏') {
    common.jsonRes(req, res, '/wanghp');
  } else if (searchText == '王维') {
    common.jsonRes(req, res, '/wangw');
  } else if (searchText == '王怡') {
    common.jsonRes(req, res, '/wangy');
  } else if (searchText == '王丽莎') {
    common.jsonRes(req, res, '/wangls');
  } else if (searchText == '王') {
    common.jsonRes(req, res, '/wang');
  } else if (searchText == '刘成尧') {
    common.jsonRes(req, res, '/liucy');
  } else if (searchText == '崔文成') {
    common.jsonRes(req, res, '/cuiwc');
  }  else {
    common.jsonRes(req, res, '/empty');
  }
};
