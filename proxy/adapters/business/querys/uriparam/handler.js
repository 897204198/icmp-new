'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');
var http = require('http');
var querystring = require('querystring');

handler.onGet = function (reqParams, resParams, data) {
  var query = common.parseUrl(reqParams).query;
  var post_data = {};
  post_data = query;
  post_data.loginName = global.userName;
  post_data.password = global.password;
  post_data.businessId = query.id;

  console.log('==========================');
  console.log('enter querys detail');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('--------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getSystemMsgDetail?' + querystring.stringify(post_data),
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
      if (chunkResult.result !== '10') {
        if (chunkResult.forms != null || chunkResult.opinion != null) {
          if (chunkResult.forms != null) {
            for (var i = 0; i < chunkResult.forms.length; i++) {
              chunkResult.forms[i].default = chunkResult.forms[i].value;
            }
          }
          tempResult = {
            opinions: [],
            forms: []
          };
          if (chunkResult.opinion != null) {
            for (var i = 0; i < chunkResult.opinion.length; i++) {
              chunkResult.opinion[i].approvalTime = chunkResult.opinion[i].opn4;
              chunkResult.opinion[i].name = chunkResult.opinion[i].opn3;
              chunkResult.opinion[i].opinion = chunkResult.opinion[i].opn2;
              chunkResult.opinion[i].stepName = chunkResult.opinion[i].opn1;
            }
          }
          tempResult.opinions = chunkResult.opinion;
          tempResult.forms = chunkResult.forms;
        } else {
          tempResult = chunkResult;
        }
      }
      resParams.end(JSON.stringify(tempResult));
    });
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);
  });
  
  req.end();
};

