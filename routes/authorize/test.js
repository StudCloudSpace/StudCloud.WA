'use strict';
let mongoose = require('mongoose');
let sso = require('@anzuev/studcloud.sso');
let log = require(appRoot + '/libs/log');

function* answer(){
    let mail,key;
    try {
        mail = this.request.body.mail;
        // let key = mongoose.Types.ObjectId(this.request.key);
        key =  this.request.body.key;
        // log.info(sso.checkAuthMiddleware);
        return {1:mail,2:key};
        // yield sso.confirmMail(mail,key);
    } catch (err) {
        log.info(err + "ERROR");
        // if (err.code == 400) next(400); //validation err
        // else if(err.code == 403) next(403); //auth error
        // else return next(err);
    }
    // return {1:mail,2:key};
}
module.exports = answer;