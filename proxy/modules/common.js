'use strict';

var url = require('url');
var fs = require('fs');

var common = module.exports = {};

common.parsePostData = function(req, res, callback) {
  var postData = '';
  req.addListener('data', function(chunk) {
    postData += chunk;
  });
  req.addListener('end', function() {
    //console.log('callback: ', callback);
    //console.log('postData: %s', postData);
    // var data = JSON.parse(postData);
    callback(req, res, postData);
  });
};

common.parseUrl = function(req) {
  return url.parse(req.url, true);
};

common.url2path = function(req, prefix, backwards) {
  var path = common.parseUrl(req).pathname.replace(/\/pep/, prefix + '/modules');
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
}