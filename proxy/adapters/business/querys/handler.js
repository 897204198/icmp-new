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
  post_data.password = global.password;

  console.log('===============================');
  console.log('enter querys');
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getSystemMsgList?' + querystring.stringify(post_data),
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
      if (chunkResult.result_total != null && chunkResult.default_tab != null && chunkResult.result_list != null&& chunkResult.tab_list != null&& chunkResult.query_conditon != null) {
        tempResult = {
          total: chunkResult.result_total,
          defaultTab: chunkResult.default_tab,
          rows: chunkResult.result_list,
          tabList: chunkResult.tab_list,
          conditons: chunkResult.query_conditon
        }
        for (var i = 0; i < tempResult.tabList.length; i++) {
          tempResult.tabList[i].tabName = tempResult.tabList[i].tab_name;
          tempResult.tabList[i].tabValue = tempResult.tabList[i].tab_value;
        }

        for (var i = 0; i < tempResult.conditons.length; i++) {
          tempResult.conditons[i].type = tempResult.conditons[i].query_type;
          tempResult.conditons[i].model = tempResult.conditons[i].query_value;
          tempResult.conditons[i].format = tempResult.conditons[i].query_formatter;
          tempResult.conditons[i].label = tempResult.conditons[i].query_name;
          tempResult.conditons[i].defaultName = tempResult.conditons[i].query_default;
          tempResult.conditons[i].disabled = tempResult.conditons[i].query_disabled;
          tempResult.conditons[i].searchUrl = tempResult.conditons[i].search_url;
          if (tempResult.conditons[i].query_more != null && tempResult.conditons[i].query_more === false) {
            tempResult.conditons[i].category = 'single';
          }
          if (tempResult.conditons[i].query_type != null && tempResult.conditons[i].query_type.indexOf('select') !== -1) {
            tempResult.conditons[i].type = 'select';
          }
          if (tempResult.conditons[i].query_type != null && tempResult.conditons[i].query_type.indexOf('searchbox') !== -1) {
            tempResult.conditons[i].type = 'searchbox';
          }
          if (tempResult.conditons[i].query_type != null && tempResult.conditons[i].query_type === 'single_select') { 
            tempResult.conditons[i].category = 'single';
          }
          if (tempResult.conditons[i].query_type != null && tempResult.conditons[i].query_type === 'more_select') {
            tempResult.conditons[i].category = 'multi';
          }
          if (tempResult.conditons[i].query_data != null) {
            tempResult.conditons[i].data = tempResult.conditons[i].query_data;
          }
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

