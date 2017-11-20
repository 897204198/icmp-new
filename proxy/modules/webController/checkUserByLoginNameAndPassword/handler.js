'use strict';

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (req, res, data) {
  var name;
  var userId;
  var headImage;
  if (data.loginName == 'chenbj') {
    name = '陈冰洁';
    userId = 'chenbj';
    headImage = "http://chuantu.biz/t6/140/1510710362x3066599700.png";
  } else if (data.loginName == 'haoyf') {
    name = '郝逸飞';
    userId = 'haoyf';
    headImage = "http://chuantu.biz/t6/140/1510710394x3066599700.png";
  } else if (data.loginName == 'hex') {
    name = '何鑫';
    userId = 'hex';
    headImage = "http://chuantu.biz/t6/140/1510710227x3066599700.png";
  } else if (data.loginName == 'jinmn') {
    name = '金孟楠';
    userId = 'jinmn';
    headImage = "http://chuantu.biz/t6/140/1510710290x3066599700.png";
  } else if (data.loginName == 'licx') {
    name = '李晨熙';
    userId = 'licx';
    headImage = "http://chuantu.biz/t6/140/1510710335x3066599700.png";
  } else if (data.loginName == 'liym') {
    name = '李一鸣';
    userId = 'liym';
    headImage = "http://chuantu.biz/t6/140/1510710422x3066599700.png";
  } else if (data.loginName == 'shiny') {
    name = '时浩宇';
    userId = 'shiny';
    headImage = "http://chuantu.biz/t6/140/1510710248x3066599700.png";
  } else if (data.loginName == 'suns') {
    name = '孙帅';
    userId = 'suns';
    headImage = "http://chuantu.biz/t6/140/1510710379x3066599700.png";
  } else if (data.loginName == 'wangh') {
    name = '王贺';
    userId = 'wangh';
    headImage = "http://chuantu.biz/t6/140/1510710347x3066599700.png";
  } else if (data.loginName == 'wangw') {
    name = '王维';
    userId = 'wangw';
    headImage = 'http://chuantu.biz/t6/140/1510710309x3066599700.png';
  } else if (data.loginName == 'wangy') {
    name = '王怡';
    userId = 'wangy';
    headImage = "http://chuantu.biz/t6/140/1510710433x3066599700.png";
  } else if (data.loginName == 'wanghp') {
    name = '王浩鹏';
    userId = 'wanghp';
    headImage = "http://chuantu.biz/t6/140/1510710410x3066599700.png";
  } else if (data.loginName == 'wangls') {
    name = '王丽莎';
    userId = 'wangls';
    headImage = "http://chuantu.biz/t6/151/1511167060x-1404781226.png";
  } else if (data.loginName == 'liucy') {
    name = '刘成尧';
    userId = 'liucy';
    headImage = "http://chuantu.biz/t6/151/1511167060x-1404781226.png";
  } else {
    common.jsonRes(req, res, '/noUser');
    return;
  }

  if (data.password != 'E10ADC3949BA59ABBE56E057F20F883E') {
    common.jsonRes(req, res, '/passwordError');
  } else {
    var returnData = {
      "result": "0",
      "user": {
        "outter": false,
        "name": name
      },
      "userId": userId,
      "jobNumber": userId,
      "headImage": headImage
    }
    res.writeHeader(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(returnData));
  }

};
