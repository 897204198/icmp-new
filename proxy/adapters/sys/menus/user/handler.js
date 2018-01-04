'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var post_data = {
    loginName: global.userName,
    password: global.passWord
  };

  console.log('=================================');
  console.log('enter menus user for get');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('---------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getCurrentAppListTree?' + querystring.stringify(post_data),
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
            'id': '',
            'total': 0,
            'name': '',
            'page': '',
            'icon': '',
            'style': '',
            'processName': '',
            'serviceName': '',
            'data': {},
            'appType': '',
            'apps': {}
          });
        }
        
        for (var i = 0; i < chunkResult.rows.length; i++) {
          resContent[i].id = chunkResult.rows[i].appid;
          resContent[i].total = chunkResult.rows[i].total;
          resContent[i].name = chunkResult.rows[i].title;
          resContent[i].page = chunkResult.rows[i].systemId;
          resContent[i].icon = chunkResult.rows[i].icon;
          resContent[i].serviceName = chunkResult.rows[i].serviceName;
          resContent[i].style = chunkResult.rows[i].style;
          resContent[i].processName = chunkResult.rows[i].processName;
          resContent[i].appType = chunkResult.rows[i].appType;
          resContent[i].data = chunkResult.rows[i].data;
          if (chunkResult.rows[i].rows !=null && chunkResult.rows[i].rows.length > 0) {
            resContent[i].apps = chunkResult.rows[i].rows;
            for (var x = 0; x < chunkResult.rows[i].rows.length; x++) {
              resContent[i].apps[x].name = chunkResult.rows[i].rows[x].title;
              resContent[i].apps[x].page = chunkResult.rows[i].rows[x].systemId;
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

handler.onPut = function (reqParams, resParams, data) {
  var post_data = {
    loginName: global.userName,
    password: global.passWord,
    ids: data.ids
  };

  console.log('=================================');
  console.log('enter menus user for save');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('---------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/saveCurrentAppList?' + querystring.stringify(post_data),
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
      resParams.end(JSON.stringify(resContent));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });

  req.end();
};



