'use strict';

var handler = module.exports = {};
var common = require('../../../common.js');

handler.onGet = function (req, res, data) {
    var orgID = common.parseUrl(req).query.organizationId;
    let jsonFile = '/' + orgID;
    common.jsonRes(req, res, jsonFile);
};
