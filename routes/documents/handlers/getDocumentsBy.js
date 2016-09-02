'use strict';
const log = require(appRoot + '/libs/log');
const BZ = require('@anzuev/knowbase');
const UAMS = require('@anzuev/studcloud.uams');
const BI = BZ.getModel();
const ValidationError = require("@anzuev/studcloud.errors").ValidationError;

module.exports = function*(){
    try {
        let title = this.request.query.title;
        let page = this.request.query.page;
        let context = this.request.query;
        log.info(this.request.query);
        let res = yield BI.getDocumentsBy(title,context,page);
        log.info(res);
        if (res.length == 0) throw new ValidationError(204);
        this.body = res;
        this.status = 200;
    }catch (err) {
        log.info(err);
        throw err;
    }
};