'use strict';

var handler = module.exports = {};
var common = require('../../../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var post_data = {
    loginName: global.userName,
    password: global.passWord
  };

  console.log('===================================');
  console.log('enter versions latest')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getTheLastVersion?' + querystring.stringify(post_data),
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
      if (chunkResult.result === '0') {
        chunkResult.versionNo = chunkResult.ver;
      }
      resParams.end(JSON.stringify(chunkResult));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};

