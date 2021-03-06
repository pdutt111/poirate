var express = require('express');
var events = require('../events');
var config = require('config');
var db=require('../database/schema');
var jwt = require('jwt-simple');
var ObjectId = require('mongoose').Types.ObjectId;
var moment=require('moment');
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

/* GET users listing. */
router.get('/cccc', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/createuser',params({body:['device_id']}),function(req,res){
      var user = new usertable;
      user.devices.push({device_id:req.body.device_id});
      user.save(function (err) {
        if (err) {
          log.warn(err);
          res.status(401).json(config.get('error.user.errorcreating'));
        } else {
          var expires = new Date(moment().add(25, 'days').valueOf()).toISOString();
          var token = jwt.encode({
            user: {_id: user._id},
            device:req.body.device_id,
            exp: expires
          }, config.get('jwtsecret'));

          res.json({
            token: token,
            id: user._id,
            expires: expires
          });
        }
      }.bind({user: user}));
      usertable.update({'devices.device_id': req.body.device_id}, {$set: {'devices.$.active':false,modified_time: (new Date())}}, {multi: true}, function (err, info) {
        if (err&&info==0) {
          log.warn(err);
        }
      });
});

module.exports = router;
