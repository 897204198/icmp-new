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
  post_data.password = global.passWord;

  console.log('===================================');
  console.log('enter todo list details')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/getSubSystemStandardIndex?' + querystring.stringify(post_data),
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
      var temp = {};
      var chunkResult = common.dispatchData(str, resParams);
      if (chunkResult.result === '0') {
        temp = {
          id: chunkResult.taskId,
          processName: chunkResult.processName,
          hideComment: chunkResult.shenpi_hide_comment,
          commentDefault: chunkResult.shenpi_comment_default,
          btnText: chunkResult.shenpi_btn_text,
          approvals: [],
          opinions: [],
          hideApproval: chunkResult.shenpi_hide_approval,
          approvalType: chunkResult.shenpi_type,
          formTitle: chunkResult.form_title,
          forms: [],
          fileList: chunkResult.fileList
        };

        if (chunkResult.forms != null) {
          for (var i = 0; i < chunkResult.forms.length; i++) {
            chunkResult.forms[i].default = chunkResult.forms[i].value;
            if (chunkResult.forms[i].type === 'tablelist') {
              chunkResult.forms[i].type = 'table';
            }
          }
        }
        temp.forms = chunkResult.forms;

        var opinionsArray = [];
        if (chunkResult.opinion != null) {
          for (var i = 0; i < chunkResult.opinion.length; i++) {
            chunkResult.opinion[i].approvalTime = chunkResult.opinion[i].opn4;
            chunkResult.opinion[i].name = chunkResult.opinion[i].opn3;
            chunkResult.opinion[i].opinion = chunkResult.opinion[i].opn2;
            chunkResult.opinion[i].stepName = chunkResult.opinion[i].opn1;
            opinionsArray.push(chunkResult.opinion[i]);
          }
        }
        temp.opinions = opinionsArray;

        var approvalsArray = [];
        if (chunkResult.approval != null) {
          for (var i = 0; i < chunkResult.approval.length; i++) {
            for (var j = 0; j < chunkResult.approval[i].length; j++) {
              if (chunkResult.approval[i][j].control_name != null) {
                chunkResult.approval[i][j].controlModel = chunkResult.approval[i][j].control_name;
              }
              if (chunkResult.approval[i][j].control_type != null) {
                if (chunkResult.approval[i][j].control_type === 'select') {
                  chunkResult.approval[i][j].type = 'select';
                  chunkResult.approval[i][j].category = 'select';
                } else if (chunkResult.approval[i][j].control_type === 'select_more') {
                  chunkResult.approval[i][j].type = 'select';
                  chunkResult.approval[i][j].category = 'multi';
                } else if (chunkResult.approval[i][j].control_type === 'select_searchbox') {
                  chunkResult.approval[i][j].type = 'searchbox';
                } else {
                  chunkResult.approval[i][j].type = chunkResult.approval[i][j].control_type;
                }
                chunkResult.approval[i][j].model = chunkResult.approval[i][j].control_name;
                chunkResult.approval[i][j].default = chunkResult.approval[i][j].control_default;
                chunkResult.approval[i][j].label = chunkResult.approval[i][j].control_label;
                chunkResult.approval[i][j].defaultName = chunkResult.approval[i][j].control_default_name;
                chunkResult.approval[i][j].data = chunkResult.approval[i][j].control_list;
                chunkResult.approval[i][j].disabled = chunkResult.approval[i][j].control_disabled;
                chunkResult.approval[i][j].searchUrl = chunkResult.approval[i][j].search_url;
                if (chunkResult.approval[i][j].validate != null) {
                  chunkResult.approval[i][j].validate.type = 'required';
                } 
              }
            }
            approvalsArray.push(chunkResult.approval[i]);
          }
        }
        temp.approvals = approvalsArray;
      }
      resParams.end(JSON.stringify(temp));
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

  console.log('===================================');
  console.log('enter post todo detail approve')
  console.log(`params: ${querystring.stringify(post_data)}`);
  console.log('-----------------------------------');

  var options = {
    hostname: common.hostname,
    port: common.port,
    path: common.path + '/webController/dealProcess?' + querystring.stringify(post_data),
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
