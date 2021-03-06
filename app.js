'use strict';


let path = require('path');
global.appRoot = path.resolve(__dirname)+ '/';
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaJsonLogger = require('koa-json-logger');

const Notify = require('@anzuev/notify');
const mailBoxes = require(appRoot + '/config/mailBoxes');
const SSO = require('@anzuev/studcloud.sso');
const RDS = require("@anzuev/studcloud.rds");
const BZ = require('@anzuev/knowbase');
const UAMS = require("@anzuev/studcloud.uams");

const log = require(appRoot + '/libs/log');
const config = require(appRoot + '/config');


let app = Koa();


Notify.configure(config);
SSO.configure(config);
RDS.configure(config);
BZ.configure(config);
UAMS.configure(config);
Notify.setMailAccounts(mailBoxes);

if(process.env.NODE_ENV == "production"){
	app.use(koaJsonLogger({
		name: 'Studcloud.WA',
		path: '/git/StudCloud.WA/libs/logs',
		jsonapi: true
	}));
	app.use(koaJsonLogger())
}else{
	app.use(function*(next){
		try{
			this.set("Access-Control-Allow-Origin", '*');
			this.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
			yield next;
			console.log("%s %s - %s", this.method, this.url, this.status);
		}catch(err){
			console.log(err);
			if(err.code){
				log.error(err.code);
				this.response.status = err.code;
				this.body = err.get();
			}else {
				this.response.status = 400;
				this.body = "Some error";
			}
		}
	});

	app.use(function*(next){
		if(this.method == "OPTIONS"){
			this.body = "";
		}else{
			yield next;
		}

	})

}


app.use(bodyParser());
app.keys = config.get('sso:keys');
app.use(SSO.getSessionsMiddleware());
app.use(SSO.getContextMiddleware());


// TODO Delete
/*
>>>>>>> origin/master
app.use(function* (next) {
	if(this.session.user){
		yield next;
	} else{
		log.trace("It is no user, so use default");
		this.session.user = "577aa958445338a73b232aff";//"57a5d9b1c931c158559464e7";
		yield next;
	}
});
*/

require("./routes")(app);

module.exports = app;
