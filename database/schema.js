/**
 * Created by pariskshitdutt on 06/09/14.
 */
var mongoose = require('mongoose');
var config = require('config');
var events = require('../events');
var log = require('tracer').colorConsole(config.get('log'));

mongoose.connect(config.mongo.location);
var db = mongoose.connection;
var userdef;
var citydef;
var notifs;
var Schema = mongoose.Schema;
mongoose.set('debug', config.get('mongo.debug'));
var citySchema=new Schema({
    name: String,
    save_date: {type: Date, default: Date.now},
    loc: {index: '2dsphere', type: [Number]},
    is_blocked: {type: Boolean, default: false},
    modified_time: {type: Date, default: Date.now},
    description:String,
    best_season_start:Number,
    Best_seaon_end:Number,
    moderate_season_start:Number,
    moderate_season_end:Number,
    rating:{friends:Number,nature:Number,family:Number,wildlife:Number, spiritual:Number, lifestyle:Number, culture:Number},
    destination_score:Number,
    when_to_go:String,
    what_to_know:String,
    name:String,
    state:String,
    photos:{type:[{_id:false,photo_id:String,api_name:String,display_pic:Boolean,image_url:String,user_id:String,user_profile_url:String,width:Number,Height:Number}]},
    activities:{type:[{activity_name:String,description:String,score:Number,activity_visit_time_start:String,
        activity_visit_time_end:String,available_month_start:Number,available_month_end:Number,activity_type:String,photos:
        {type:[{_id:false,photo_id:String,api_name:String,display_pic:Boolean,image_url:String,user_id:String,
            user_profile_url:String,width:Number,Height:Number}]},loc:{index: '2dsphere', type: [Number]},
    foursquare_checkins:Number}]}


});
var userSchema=new Schema({
    email:[String],
    fb_id:String,
    gplus_id:String,
    friends:{type:[{user:{type:Schema.Types.ObjectId,ref:'User'},on_device_id:{type:String},phonenumber:Number,name:String
        ,email:[String],_id:false,invite:{invited:{type:Boolean, default:false},date:Date,invite_type:{type:String,default:"invite"}}}]},
    phonenumber:[Number],
    is_testing:{type:Boolean,default:false},
    created_time:{type:Date,default:Date.now},
    modified_time:{type:Date,default:Date.now},
    devices:{type:[{device_id:String,service:String,registration_id:String,active:{type:Boolean,default:false},_id:false}]},
    fb_photo:String,
    fb_token:String,
    sync_date:[Date],
    bio:String,
    hashes:[{hash:{type: String},_id:false,photo:{type:Boolean,default:true},self:{type:Boolean,default:false}}],
    fb_token_validity:Date,
    gplus_photo:String,
    gplus_token:String,
    gplus_token_validity:String,
    name:String,
    profile_pic:String,
    location_logs:[{loc:{ index: '2dsphere',type: [Number]},date:Date,source:String,_id:false}]
});
var notificationSchema=new Schema({
    to:[{type: Schema.Types.ObjectId, ref: 'User'}],
    payload:Schema.Types.Mixed,
    type:String,
    created_time:{type:Date,default:Date.now}
});
db.on('error', function(err){
    log.info(err);
});
db.once('open', function () {
    log.info("connected");
    userdef=mongoose.model('User',userSchema);
    userdef.on('index', function(err) {
        if (err) {
            log.error('User index error: %s', err);
        } else {
            log.info('User indexing complete');
        }
    });
    citydef=mongoose.model('Cities',citySchema);
    citydef.on('index', function(err) {
        if (err) {
            log.error('photo index error: %s', err);
        } else {
            log.info('photo indexing complete');
        }
    });
    notifs=mongoose.model('Notifications',notificationSchema);
    notifs.on('index', function(err) {
        if (err) {
            log.error('appinfo index error: %s', err);
        } else {
            log.info('appinfo indexing complete');
        }
    });
    exports.getuserdef= userdef;
    exports.getcitydef=citydef;
    exports.getnotifs=notifs;
    events.emitter.emit("db_data");
});

