'use strict';

var handler = module.exports = {};
var common = require('../../../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var query = common.parseUrl(reqParams).pathname.split('/');

  var post_data = {
    loginName: global.userName,
    password: global.passWord,
    taskId: query[query.length-2]
  };

  console.log('=================================');
  console.log('enter claim');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('---------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/claim?' + querystring.stringify(post_data),
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
