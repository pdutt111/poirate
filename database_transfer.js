/**
 * Created by pariskshitdutt on 04/02/15.
 */
var db=require('./database/schema');
var events = require('./events');
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var userdef;
var citydef;
events.emitter.on("db_data",function(){
    citydef=db.getcitydef;
    userdef=db.getuserdef;
    MongoClient.connect('mongodb://localhost/poirate', function(err, db) {
        if(err) throw err;

        var collection = db.collection('tripigator');

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
                // Let's close the db
                for(var i=0;i<results.length;i++){
                    var city=new citydef;
                    city.name=results[i].name.split(",")[0];
                    city.state=results[i].state;
                    if(results[i].longitude&&results[i].latitude)
                    city.loc=[parseFloat(results[i].longitude),parseFloat(results[i].latitude)];
                    city.description=results[i].overview;
                    city.what_to_know=results[i].what_to_know;
                    city.when_to_go=results[i].when_to_go;
                    city.get_around=results[i].get_around;
                    city.photos=results[i].photos;
                    city.overall_rating=results[i].destination_score;
                    city.best_season_start=results[i].best_season_start;
                    city.best_season_end=results[i].best_season_end;
                    city.moderate_season_start=results[i].moderate_season_start;
                    city.moderate_season_end=results[i].moderate_season_end;
                    city.activities=[];
                    for(var j=0;j<results[i].activities.length;j++){
                        city.activities.push({activity_name:results[i].activities[j].activity_name,activity_time:results[i].activities[j].activity_time,description:results[i].activities[j].description,score:results[i].activities[j].score,activity_visit_time_start:results[i].activities[j].activity_visit_time_start,
                            activity_visit_time_end:results[i].activities[j].activity_visit_time_end,available_month_start:results[i].activities[j].available_month_start,available_month_end:results[i].activities[j].available_month_end
                            ,activity_type:results[i].activities[j].activity_type,photos:results[i].activities[j].photos
                            ,loc:[results[i].activities[j].longitude,results[i].activities[j].latitude],
                            foursquare_checkins:results[i].activities[j].api_params.foursquare.check_ins})
                    }
                    city.rating={};
                    if(results[i].destination_rating.culture){
                        city.rating.culture=results[i].destination_rating.culture[0];
                    }else{
                        city.rating.culture=0;
                    }
                    if(results[i].destination_rating.nature){
                        city.rating.nature=results[i].destination_rating.nature[0];
                    }else{
                        city.rating.nature=0;
                    }
                    if(results[i].destination_rating.friends){
                        city.rating.friends=results[i].destination_rating.friends[0];
                    }else{
                        city.rating.friends=0;
                    }
                    if(results[i].destination_rating.family){
                        city.rating.family=results[i].destination_rating.family[0];
                    }else{
                        city.rating.family=0;
                    }
                    if(results[i].destination_rating.wildlife){
                        city.rating.wildlife=results[i].destination_rating.wildlife[0];
                    }else{
                        city.rating.wildlife=0;
                    }
                    if(results[i].destination_rating.spiritual){
                        city.rating.spiritual=results[i].destination_rating.spiritual[0];
                    }else{
                        city.rating.spiritual=0;
                    }
                    if(results[i].destination_rating.lifestyle){
                        city.rating.lifestyle=results[i].destination_rating.lifestyle[0];
                    }else{
                        city.rating.lifestyle=0;
                    }
                    console.log(city);
                    city.save(function(err,info){
                        if(err){
                            console.log(err);
                        }else{
                            console.log(info);
                        }
                    })
                }

            db.close();
        });
    })
});

