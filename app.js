var express = require('express');
var path = require('path');
var jwt = require('jwt-simple');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('config');
var log = require('tracer').colorConsole(config.get('log'));
var events = require('./events');
var db=require('./database/schema')
var ObjectId = require('mongoose').Types.ObjectId;
var routes = require('./routes/index');
var users = require('./routes/users');


var usertable;
var citytable;
events.emitter.on("db_data",function(){
    log.info("data models recieved");
    citytable=db.getcitydef;
    usertable=db.getuserdef;
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 * middleware to authenticate the jwt and routes
 */

app.use(function(req,res,next){
    if(req.baseUrl.indexOf("/api/v1")>-1&&req._parsedUrl.pathname.indexOf('protected')>-1) {
        if(req.headers.authorization){
            var token=req.headers.authorization.split(" ")[1];
            if (token) {
                try {
                    var decoded = jwt.decode(token, config.get('jwtsecret'));
                    var now = (new Date()).toISOString();
                        req.user = decoded.user;
                        usertable.findOne({_id:new ObjectId(req.user._id)}
                            ,"name profile_pic hashes phonenumber bio email",function(err,user){
                                if(err)
                                    log.warn(err);
                                if(user) {
                                    req.user = user;
                                    next();
                                }else{
                                    res.status(401).json(config.get('error.webtoken.unknown'));
                                }
                            });
                } catch (err) {
                    log.error(err,req);
                    res.status(401).json(config.get('error.webtoken.unknown'));
                }
            }
        } else {
            res.status(401).json(config.get('error.webtoken.notprovided'));
        }
    }else{
        next();
    }
});
app.use('/api/v1/', routes);
app.use('/api/v1/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    log.info(req._parsedOriginalUrl.pathname);
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    if(err.status==404){
        res.status(404).json(config.get('error.notfound'))
    }else{
        res.status(err.status || 500).json(config.get('error.internalservererror'));

    }
});


module.exports = app;
