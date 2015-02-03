var config={};

config.web = {};
config.AWS_S3 = {};
config.mailer_options = {};
config.twilio={};
config.smsIndia={};
config.mongo={};
config.error={};
config.geocoder={};

config.mongo.location='mongodb://localhost/poirate';

config.web.httpport = 1337;
config.web.httpsport = 443;

config.mongoDebug=false;
config.debug=true;
config.logLevel=0;


config.jwtsecret="poirate@132";

config.error.webtoken={};
config.error.sms={};
config.error.user={};
config.error.nodetails={result:"error",description:"insufficient data"};
config.error.unauthorized={result:"error",description:"unauthorized"};
config.error.webtoken.expired={result:"error",description:"expired web token"};
config.error.webtoken.unknown={result:"error",description:"unknown web token"};
config.error.webtoken.notprovided={result:"error",description:"no web token provided"};
config.error.user.doesnotexist={result:"error",description:"no such user present"};
config.error.user.exists={result:"error",description:"user already present"};
config.error.user.errorcreating={result:"error",description:"error creating user"};
config.error.sms.smslimit={result:"error",description:"unusual traffic from your ip has lead to blocking of your service"};
config.error.sms.notsent={result:"error",description:"unable to send sms"};
config.error.dberror={result:"error",description:"there was an error in database"};
config.error.uploaderr={result:"error",description:"file not attached"};
config.error.internalservererror={result:"error",description:"internal server error"}
config.error.badrequest={result:"error",description:"bad request"}
config.error.notfound={result:"error",description:"not found"}
config.ok={result:"ok"};


//config.https.credentials = {key: privateKey, cert: certificate};

module.exports=config;