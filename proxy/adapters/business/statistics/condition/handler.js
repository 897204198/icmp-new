'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var query = common.parseUrl(reqParams).query;
  console.log(query);
  var post_data = {};
  post_data = query;
  post_data.loginName = global.userName;
  post_data.password = global.passWord;

  console.log('===================================');
  console.log('enter getStatisticsData')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getStatisticsQuery?' + querystring.stringify(post_data),
    method: 'POST',
    headers: {  
      'Content-Type': 'application/x-www-form-urlendcoded;charset=UTF-8'  
    } 
  }

  var req = http.request(options, function (res) {  
    var str = '';
    var tempResult = {};
    res.setEncoding('utf8'); 
    res.on('data', function (chunk) {
      str += chunk;
    });
    
    res.on('end', function () {
      var chunkResult = common.dispatchData(str, resParams);
      if (chunkResult['template'] != null) {
        tempResult = chunkResult['template'];
      }
      resParams.end(JSON.stringify(tempResult));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};


