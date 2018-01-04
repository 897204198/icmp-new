'use strict';

var handler = module.exports = {};

handler.onGet = function (req, res, data) {
  var returnData = {
    "result_list": [
      {
        "id": "25c2ab07-1ba9-4985-8d88-bbf60e89b2f1",
        "name": "姓名1",
        "content": "<h2>姓名1</h2><p>普外科</p>"
      },
      {
        "id": "25c2ab07-1ba9-4985-8d88-bbf60e89b2f2",
        "name": "姓名2",
        "content": "<h2>姓名2</h2><p>普外科</p>"
      },
      {
        "id": "25c2ab07-1ba9-4985-8d88-bbf60e89b2f3",
        "name": "姓名3",
        "content": "<h2>姓名3</h2><p>普外科</p>"
      },
      {
        "id": "25c2ab07-1ba9-4985-8d88-bbf60e89b2f4",
        "name": "姓名4",
        "content": "<h2>姓名4</h2><p>普外科</p>"
      },
      {
        "id": "25c2ab07-1ba9-4985-8d88-bbf60e89b2f5",
        "name": "姓名5",
        "content": "<h2>姓名5</h2><p>普外科</p>"
      }
    ]
  };
  res.writeHeader(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(returnData));
};