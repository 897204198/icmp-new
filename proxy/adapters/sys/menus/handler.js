'use strict';

var handler = module.exports = {};
var common = require('../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var post_data = {
    loginName: global.userName,
    password: global.passWord
  };

  console.log('===================================');
  console.log('enter get all app list tree')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getAllAppListTree?' + querystring.stringify(post_data),
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
        for (var i = 0; i < chunkResult.rows.length; i++) {
          resContent.push({
            "typeCode": chunkResult.rows[i].appType,
            "typeName": chunkResult.rows[i].title,
            "apps": chunkResult.rows[i].rows
          });
        }
        for (var i = 0; i < resContent.length; i++) {
          for (var j = 0; j < resContent[i].apps.length; j++) {
            resContent[i].apps[j].id = resContent[i].apps[j].appid;
            resContent[i].apps[j].name = resContent[i].apps[j].title;
            resContent[i].apps[j].page = resContent[i].apps[j].systemId;
            if (resContent[i].apps[j].rows != null) {
              resContent[i].apps[j].apps = resContent[i].apps[j].rows;
              for (var x = 0; x < resContent[i].apps[j].apps.length; x++) {
                resContent[i].apps[j].apps[x].id = resContent[i].apps[j].apps[x].appid;
                resContent[i].apps[j].apps[x].name = resContent[i].apps[j].apps[x].title;
                resContent[i].apps[j].apps[x].page = resContent[i].apps[j].apps[x].systemId;
              }
            }
          }
        }
      }
      resParams.end(JSON.stringify(resContent));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};
