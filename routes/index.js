var express = require('express');
var events = require('../events');
var config = require('config');
var db=require('../database/schema');
var ObjectId = require('mongoose').Types.ObjectId;
var log = require('tracer').colorConsole(config.get('log'));
var router = express.Router();

var usertable;
var citytable;

events.emitter.on("db_data",function(){
  log.info("data models recieved");
  citytable=db.getcitydef;
  usertable=db.getuserdef;
});

/* GET home page. */
router.get('/activities',function(req,res){
  citytable.find({_id:new ObjectId(req.query.id)},"activities",function(err,rows){
    res.json(rows);
  })
});
router.get('/city',function(req,res){
  if(req.query.search&&req.query.search.length>2) {
    var re = new RegExp(""+req.query.search+"", 'i');
    citytable.find({name: {$regex: re}}, "name state", function (err, rows) {
      rows.sort(function(a, b){return  a.name.toLowerCase().indexOf(req.query.search.toLowerCase())-b.name.toLowerCase().indexOf(req.query.search.toLowerCase())});
      res.json(rows);
    })
  }else{
    res.status(400).json(config.get('error.badrequest'))
  }
});
router.get('/itinery',function(req,res){
  citytable.find({_id:new ObjectId(req.query.id)},"activities",function(err,rows){
    res.json(rows);
  })
});
module.exports = router;
