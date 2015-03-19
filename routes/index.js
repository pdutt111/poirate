var express = require('express');
var events = require('../events');
var config = require('config');
var db=require('../database/schema');
var ObjectId = require('mongoose').Types.ObjectId;
var params = require('parameters-middleware');
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
router.get('/attractions',params({query:['city_id']}),function(req,res){
  citytable.find({_id:new ObjectId(req.query.city_id)},"activities",function(err,rows){
    res.json(rows);
  })
});
router.get('/city',params({query:['search']}),function(req,res){
  if(req.query.search&&req.query.search.length>2) {
    var re = new RegExp(""+req.query.search+"", 'i');
    citytable.find({name: {$regex: re}}, "name state", function (err, rows) {
      rows.sort(function(a, b){return  a.name.toLowerCase().indexOf(req.query.search.toLowerCase())-b.name.toLowerCase().indexOf(req.query.search.toLowerCase())});
      res.json({result:rows});
    })
  }else{
    res.status(400).json(config.get('error.badrequest'))
  }
});
router.use('/itinery',function(req,res,next){
  if(req.headers.authorization){
    var token=req.headers.authorization.split(" ")[1];
    if (token) {
      try {
        var decoded = jwt.decode(token, config.get('jwtsecret'));
        var now = (new Date()).toISOString();
        req.user = decoded.user;
        usertable.findOne({_id:new ObjectId(req.user._id)}
            ,"name profile_pic hashes phonenumber bio email",function(err,user){
              if(err) {
                log.warn(err);
              }

                req.user = user;
                next();
            });
      } catch (err) {
        next()
      }
    }else{
      next();
    }
  } else {
    next()
  }
})
router.get('/itinery',params({query:['city_id','start_date','end_date']}),function(req,res){
  if(req.query.pois) {
    citytable.findOne({_id: new ObjectId(req.query.city_id),activities:{$in:req.query.pois}}, "activities", function (err, rows) {
      var response = planTrip(rows.activities,req.query.start_date,req.query.end_date);
      res.json(response);
    });
  }else{
    citytable.findOne({_id: new ObjectId(req.query.city_id)}, "activities", function (err, rows) {
      var response = planTrip(rows.activities,req.query.start_date,req.query.end_date);
      res.json(response);
    });
  }
});

function planTrip(rows,start_date,end_date){
  var start_date=new Date(start_date);
  var end_date=new Date(end_date);

  var diffDays = Math.round(Math.abs((start_date.getTime() - end_date.getTime())/(24*60*60*1000)));

  var response={};
  for(var i=0;i<rows.length;i++){
    for(var j=0;j<diffDays;j++){
      if(!response[j]){
        response[j]=[];
      }
      if(response[j].length<(rows.length/diffDays).toFixed(0)) {
        response[j].push(rows[i]._id);
      }
    }
  }
  return response;
}
module.exports = router;
