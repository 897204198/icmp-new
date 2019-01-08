'use strict';

var http = require('http');
var common = require('./adapters/common.js');

console.log('');
console.log('PEP transform Proxy Server');
console.log('');

var onReq = function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-PEP-TOKEN');
  res.setHeader('Access-Control-Max-Age', '1000');

  var query = common.parseUrl(req).query;

  console.log('Received %s request %s', req.method, req.url);
  //console.log('with header %j', req.rawHeaders);
  if (req.method === 'GET' || req.method === 'DELETE') {
    console.log('With query %j', query);
  } else {
    common.parsePostData(req, res, function(req, res, data) {
      console.log('with data %j', data);
    });
  }

  var handler = {}, curPath = '';
  try {
    curPath = common.url2path(req, '.');
　　var reg = /\/\d+/;
　　var replaceUrl = curPath.replace(reg, '/uriparam'); 
    if (curPath.indexOf('./adapters/business/querys/') !== -1) {
      replaceUrl = './adapters/business/querys/uriparam';
    }
    if (curPath.indexOf('/webController') !== -1) {
      replaceUrl = './adapters/webController';
    }
    handler = require(replaceUrl + '/handler.js');
  } catch (err) {
    console.log('Could not find handler in \'%s\'.', curPath);
    try {
      curPath = common.url2path(req, '.', 1);
      handler = require(curPath + '/handler.js');
      console.log('Find handler in its parent folder \'%s\'.', curPath);
    } catch (error) {
      console.log('Get handler error %j, fallback to default handler.', error);
    }
  }
  handler.onPost = handler.onPost ? handler.onPost : common.commonPost;
  handler.onPut = handler.onPut ? handler.onPut : common.commonPost;
  handler.onGet = handler.onGet ? handler.onGet : common.commonGet;
  handler.onDelete = handler.onDelete ? handler.onDelete : common.commonGet;

  if (req.method === 'POST') {
    common.parsePostData(req, res, handler.onPost);
  } else if (req.method === 'PUT') {
    common.parsePostData(req, res, handler.onPut);
  } else if (req.method === 'GET') {
    handler.onGet(req, res);
  } else if (req.method === 'DELETE') {
    handler.onDelete(req, res);
  } else if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
  } else {
    res.statusCode = 401;
    res.end();
  }
};

http.createServer(onReq).listen(8080);
