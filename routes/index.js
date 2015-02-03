var express = require('express');
var events = require('../events');
var config = require('config');
var db=require('../database/schema')
var log = require('tracer').colorConsole(config.get('log'));
var router = express.Router();

var userdef;
var citydef;

events.emitter.on("db_data",function(){
  log.info("data models recieved");
  citydef=db.getcitydef;
  userdef=db.getuserdef;
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
