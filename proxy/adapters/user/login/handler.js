'use strict';

var http = require('http');
var querystring = require('querystring');

var handler = module.exports = {};
var common = require('../../common.js');

handler.onPost = function (reqParams, resParams, data) {
  var post_data = {};
  post_data = data;
  post_data.loginName = post_data.account;

  console.log('=================================');
  console.log('enter login');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('--------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/checkUserByLoginNameAndPassword?' + querystring.stringify(post_data),
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
        console.log(chunkResult);
        global.userName = data.loginName;
        global.passWord = data.password;
        global.user = chunkResult.user;
        global.token = data.loginName;
        chunkResult.token = data.loginName;
        chunkResult.id = chunkResult.userId;
        chunkResult.outter = chunkResult.user.outter;
        chunkResult.account = chunkResult.jobNumber;
        chunkResult.name = chunkResult.user.name;
      }
      resContent = chunkResult;
      resParams.end(JSON.stringify(resContent));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });
  
  req.end();
};
