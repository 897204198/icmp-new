'use strict';

var url = require('url');
var fs = require('fs');

var common = module.exports = {};

// common.hostname = 'localhost';
// common.port = 8080;
// common.path = '/pep';
common.hostname = '192.168.1.241';
common.port = 7777;
common.path = '/mobile-platform';
common.realPath = '';
global.userName = '';
global.passWord = '';
global.user = {};
global.token = '';

common.parsePostData = function(req, res, callback) {
  var postData = '';
  req.addListener('data', function(chunk) {
    postData += chunk;
  });
  req.addListener('end', function() {
    //console.log('callback: ', callback);
    //console.log('postData: %s', postData);
    try {
      var data = JSON.parse(postData);
      callback(req, res, data);
    } catch (err) {
      console.log(err);
    }
  });
};

common.parseUrl = function(req) {
  return url.parse(req.url, true);
};

common.url2path = function(req, prefix, backwards) {
  common.realPath = common.parseUrl(req).path.replace(/\/pep/, '');
  var path = common.parseUrl(req).pathname.replace(/\/pep/, prefix + '/adapters');
  if (backwards) {
    var paths = path.split('/');
    for (var i = 0; i < backwards; i++) {
      paths.pop();
    }
    path = paths.join('/');
  }
  return path;
};

common.jsonRes = function(req, res, prefix) {
  var path = common.url2path(req, 'proxy') + prefix + '.json';
  fs.access(path, function(err) {
    if (!err) {
      var resBody = fs.readFileSync(path);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.write(resBody);
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end();
    }
  });
};

common.commonPost = function(req, res, data) {
  console.log('Received post data %j', data);
  common.jsonRes(req, res, '/post');
};

common.commonGet = function(req, res) {
  common.jsonRes(req, res, '/all');
};

function parseJson(param)
{
    var obj={};
    var keyvalue=[];
    var key="",value="";
    var paraString = param.split("&");
    for(var i in paraString)
    {
        keyvalue=paraString[i].split("=");
        key=keyvalue[0];
        value=keyvalue[1];
        obj[key]=value; 
    }
    return obj;
};

common.dispatchData = function (str, resParams) {
  try {
    var chunkResult = JSON.parse(str.toString());
    if (chunkResult.result === '10') {
      chunkResult = {errMsg: '授权失败需要重新登录'};
      resParams.writeHeader(401, {'Content-Type': 'text/plain;charset=UTF-8'});
    } else if (chunkResult.result === '2') {
      if (chunkResult.errmsg != null && chunkResult.errmsg !== '') {
        chunkResult = {errMsg: chunkResult.errmsg};        
      } else {
        chunkResult = {errMsg: '未知错误'};
      }
      resParams.writeHeader(400, {'Content-Type': 'text/plain;charset=UTF-8'});
    } else if (chunkResult.result === '0') {
      resParams.writeHeader(200, {'Content-Type': 'text/plain;charset=UTF-8'});
    }
  }
  catch (err) {
    console.log(err);
    resParams.writeHeader(404, {'Content-Type': 'text/plain;charset=UTF-8'});
  }
  return chunkResult;
};