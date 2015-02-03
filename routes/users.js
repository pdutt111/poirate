var express = require('express');
var events = require('../events');
var config = require('config');
var db=require('../database/schema')
var log = require('tracer').colorConsole(config.get('log'));
var router = express.Router();

var userdef;
var citydef;
var notifs;

events.emitter.on("db_data",function(){
  log.info("data models recieved");
  citydef=db.getcitydef;
  userdef=db.getuserdef;
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
