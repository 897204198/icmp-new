'use strict';

var http = require('http');
var querystring = require('querystring');

var handler = module.exports = {};
var common = require('../common.js');

handler.onGet = function (reqParams, resParams, data) {
  var query = common.parseUrl(reqParams).query;
  var post_data = {};
  post_data = query;
  post_data.loginName = global.userName;
  post_data.password = global.passWord;

  console.log('=================================');
  console.log('enter get webController');
  console.log(`path: ${common.path + common.realPath + '&' + querystring.stringify(post_data)}`);
  console.log('--------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + common.realPath + '&' + querystring.stringify(post_data),
    method: 'POST',
    headers: {  
      'Content-Type': 'application/x-www-form-urlendcoded;charset=UTF-8'  
    } 
  }

  var req = http.request(options, function (res) {
    var str = '';
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) {
      str += chunk;
    });
    
    res.on('end', function () {
      var chunkResult = common.dispatchData(str, resParams);
      resParams.end(JSON.stringify(chunkResult));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};

handler.onPost = function (reqParams, resParams, data) {
  var post_data = {};
  post_data = data;
  post_data.loginName = global.userName;
  post_data.password = global.passWord;

  console.log('=================================');
  console.log('enter post webController');
  console.log(`path: ${common.path + common.realPath + '&' + querystring.stringify(post_data)}`);
  console.log('--------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + common.realPath + '&' + querystring.stringify(post_data),
    method: 'POST',
    headers: {  
      'Content-Type': 'application/x-www-form-urlendcoded;charset=UTF-8'  
    } 
  }

  var req = http.request(options, function (res) {
    var str = '';
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) {
      str += chunk;
    });
    
    res.on('end', function () {
      var chunkResult = common.dispatchData(str, resParams);
      resParams.end(JSON.stringify(chunkResult));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};

