'use strict';
let log = require(appRoot + '/libs/log');
const UAMS = require('@anzuev/studcloud.uams');
const ValidationError = require("@anzuev/studcloud.errors").ValidationError;

module.exports = function*(){
    try{
        let data = {
            mail: this.request.body.mail,
            key: this.request.body.key
        };

        if(data.mail==undefined || !data.key){ //TODO: можно упростить до !(data.mail&&data.key)
            let error = new ValidationError(400, "Not enough data to process");
            log.error(error);
            this.body = {result: "failed"};
            throw error;
        }
        this.user = yield UAMS._Users.getUserByMail(data.mail); // вызов метода должен быть через UAMS.getUserByMail;
        let a = this.user.confirmMail(data.key);
        if ( a == true){ //TODO: можно упростить до if(a)
	        yield this.user.saveUser();
            this.body = {result: "ok"};
            this.status = 200;
        } else {
            this.body = {result: "failed"};
        }
    }catch(e){
        this.body = {result: "failed"};
        log.error(e);
        throw e;
    }
};