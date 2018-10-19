// Dependencies
var mongoose        = require('mongoose');
var Walet            = require('./model.js');


// Opens App Routes
module.exports = function(app) {

    // GET Routes
    // --------------------------------------------------------
    // Retrieve records for all locations in the db
    app.get('/locations', function(req, res){

        // Uses Mongoose schema to run the search (empty conditions)
        var query = Walet.find({});
        query.exec(function(err, locations){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all locations
                res.json(locations);
            }
        });
    });

    

    // POST Routes
    // --------------------------------------------------------
    // Provides method for saving new location in the db
    app.post('/locations', function(req, res){

        // Creates a new Location based on the Mongoose schema and the post bo.dy
        var newLocation = new Walet(req.body);

        // New Location is saved in the db.
        newLocation.save(function(err){
            if(err)
                res.send(err);
            else
                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body);
        });
    });

    // POstT Routes
    // --------------------------------------------------------
    // update available slot for 
    app.post('/update', function(req, res){

        // Creates a new Location based on the Mongoose schema and the post bo.
        var id = req.body.selectedLocation._id;
        var availableSlots = req.body.availableSlots;
        Walet.update({ _id: id }, { $set: { availableSlots: availableSlots }}, function() {
            console.log("Updated!!");
        })
        var newLocation = new Walet(req.body);

        // New Location is saved in the db.
        newLocation.save(function(err){
            if(err)
                res.send(err);
            else
                // If no errors are found, it responds with a JSON of the new user
                res.json(req.body);
        });
    });

    // Retrieves JSON records for all locations near the selected location
    app.post('/query/', function(req, res){

        // Grab all of the query parameters from the body.
        var lat             = req.body.latitude;
        var long            = req.body.longitude;
        var distance        = req.body.distance;

        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Walet.find({});

        // ...include filter by Max Distance (converting miles to meters)
        if(distance){

            // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

                // Converting meters to miles. Specifying spherical geometry (for globe)
                maxDistance: distance * 1000, spherical: true});

        }        
        // Execute Query and Return the Query Results
        query.exec(function(err, locations){
            if(err)
                res.send(err);
            else
                // If no errors, respond with a JSON of all users that meet the criteria
                console.log(locations);
                res.json(locations);
        });
    });

    // Retrieves JSON records for all locations near the selected location
    app.post('/queryById/', function(req, res){

        // Grab all of the query parameters from the body.
        var id             = req.body.id;
        
        // Opens a generic Mongoose Query. Depending on the post body we will...
        var query = Walet.findById(id, function(err,location){
            if(err)
                res.send(err);
            else        
                findNearLocations(location);
        }); 

        var findNearLocations = function(location){
            var lat  = location.location[1];
            var long = location.location[0];

             var query = Walet.find({});

             // Using MongoDB's geospatial querying features. (Note how coordinates are set [long, lat]
            query = query.where('location').near({ center: {type: 'Point', coordinates: [long, lat]},

            // Converting meters to miles. Specifying spherical geometry (for globe)
            maxDistance:  2000, spherical: true});
            
            query.exec(function(err, locations){
                if(err)
                    res.send(err);
                else
                    // If no errors, respond with a JSON of all users that meet the criteria
                    console.log(locations);
                    res.json(locations);
            });
        }         
    });

    // Retrieve records for all locations in the db
    app.post('/specificLocations', function(req, res){
        var type = req.body.type;
        // Uses Mongoose schema to run the search (empty conditions)
        var query = Walet.find({});
        console.log(req);
        query = query.where('type').equals(type);
        query.exec(function(err, locations){
            if(err) {
                res.send(err);
            } else {
                // If no errors are found, it responds with a JSON of all locations
                res.json(locations);
            }
        });
    });

};
