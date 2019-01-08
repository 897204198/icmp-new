'use strict';

var common = require('../../common.js');

var handler = module.exports = {};

var opinionDates = [];

handler.onGet = function(req, res) {
  var prefix = '/all';
  var path = common.url2path(req, 'proxy') + prefix + '.json';
  var fs = require('fs');
  fs.access(path, function(err) {
    if (!err) {
      var resBody = fs.readFileSync(path);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      var resBodyJson = JSON.parse(resBody);
      for (var i = 0 ; i < opinionDates.length ; i++) {
        resBodyJson.push(opinionDates[i]);
      }
      var resBodyStr = JSON.stringify(resBodyJson);
      res.write(resBodyStr);
      res.end();
    } else {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end();
    }
  });
};

handler.onPost = function(req, res, data) {
  var now = new Date();
  var opinionTime = now.getFullYear()+'年';
  opinionTime += ((now.getMonth()+1)>9?(now.getMonth()+1):('0'+(now.getMonth()+1)))+'月';
  opinionTime += (now.getDate()>9?now.getDate():'0'+now.getDate())+'日';
  opinionTime += ' '+(now.getHours()>9?now.getHours():'0'+now.getHours())+':';
  opinionTime += (now.getMinutes()>9?now.getMinutes():'0'+now.getMinutes());
  var opinionDate = {
    id: '9',
    opinionTime: opinionTime,
    opinion: data.opinion,
    feedbackTime: '',
    feedback: '',
    statusCode: '0',
    status: '未反馈'
  };
  opinionDates.push(opinionDate);

  res.writeHeader(200, {'Content-Type': 'text/plain'});
  res.end('');
};
