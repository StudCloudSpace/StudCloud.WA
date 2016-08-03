'use strict';
let log = require(appRoot + '/libs/log');
const UAMS = require('@anzuev/studcloud.uams');
const ValidationError = require("@anzuev/studcloud.errors").ValidationError;

module.exports = function*(next){
    // проверка что параметры переданы от юзера
    // ...
    try{
        let data = {
            mail: this.request.body.mail,
            key: this.request.body.key
            };
        if(data.mail==undefined || !data.key){
            // что-то не передано
            // кидаем ошибку
            let error = new ValidationError(400, "Not enough data to process");
            log.error(error);
            this.body = {result: "failed"};
            throw error;
        }
        this.user = yield UAMS._Users.getUserByMail(data.mail);
        this.user.confirmMail(data.key);
        yield this.user.saveUser();
        this.body = {result: "ok"};
        // делаем еще что-то
    }catch(e){
        this.body = {result: "failed"};
        log.error(e);
        throw e;
    }
};