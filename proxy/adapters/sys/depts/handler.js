'use strict';

var handler = module.exports = {};
var common = require('../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var query = common.parseUrl(reqParams).query;
  var post_data = {};
  post_data = query;
  post_data.loginName = global.userName;
  post_data.password = global.passWord;

  console.log('===================================');
  console.log('enter get instashot')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getInstaShotInfo?' + querystring.stringify(post_data),
    method: 'POST',
    headers: {  
      'Content-Type': 'application/x-www-form-urlendcoded;charset=UTF-8'  
    } 
  }

  var req = http.request(options, function (res) {
    var resContent;  
    var str = '';
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) {
      str += chunk;
    });
    
    res.on('end', function () {
      var chunkResult = common.dispatchData(str, resParams);
      if (chunkResult.result === '0') {
        resContent = [];
        for (var i = 0; i < chunkResult.data.length; i++) {
          chunkResult.data[i].id = chunkResult.data[i].code;
        }
        resContent = chunkResult.data;
      }
      resParams.end(JSON.stringify(resContent));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};

