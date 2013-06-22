var passport = require('passport')
	, geocoder = require('geocoder')
	, User = require('../models/user')
	, Spot = require('../models/spot')
	, googleSql = require('node-google-sql');


module.exports = function (app) {

	function ensureAuthenticated(req, res, next) {
	  if (req.isAuthenticated()) { return next(); }
	  res.redirect('/')
	}



	app.get('/', function (req, res){
		res.render('index', {title: 'pm2am'})
	})


	app.get('/signup', ensureAuthenticated, function (req, res){
		res.render('signup', {title: 'Signup!', user: req.user})
	})


	app.post('/signup', ensureAuthenticated, function (req, res){
		var object = req.body;
		console.log(object)

		geocoder.geocode(object.city+", "+object.state, function ( err, data ) {
			if(err){console.log(err)}
		    console.log(data)
			var lat = data.results[0].geometry.location.lat;
			var lng = data.results[0].geometry.location.lng;
		

			var user = {
				vehicle: object.vehicle
				, type: object.type
				, city: object.city
				, state: object.state
				, zip: object.zip
				, lat: lat 
				, lng: lng 
			}


			var query = { userId: req.user.id };
			User.findOneAndUpdate(query, user, {upsert:true}, function(err, docs){
				if(err){
					console.log(err)
				}

				if(object.host === 'on'){
					console.log('host = true')
					geocoder.geocode(object.hostAddress+" "+object.hostCity+", "+object.hostState, function ( err, data ) {
						if(err){console.log(err)}

						var spot = {
							owner: req.user.id
							, open: object.open
							, address: object.hostAddress
							, city: object.hostCity
							, state: object.hostState
							, zip: object.hostZip
							, lat: data.results[0].geometry.location.lat
							, lng: data.results[0].geometry.location.lng
							, wifi: object.hostWifi
							, bathroom: object.hostBathroom
							, shower: object.hostShower 
							, tent: object.hostTent 
							, water: object.hostWater 
							, waste: object.hostWaste
							, max: object.hostDays
						}


						mySpot = new Spot(spot)

						mySpot.save(function(err) {
			                if (err) {
			                    console.log(err);
			                }
			                res.redirect('/map')
			            });

					});
				}

				else{
					res.redirect('/map')
				}

			})

			
		});
	})


	app.get('/map', function (req, res){
		res.render('map', {title: 'Map', user: req.user})
	})


	app.get('/auth/facebook', passport.authenticate('facebook'));


	app.get('/auth/facebook/callback',
	  passport.authenticate('facebook', { failureRedirect: '/' }),
	  function(req, res) {
	    	res.redirect('/signup')
	  });


	app.get('/logout', function(req, res){
	  req.logout();
	  res.redirect('/');
	});


	app.get('/account', ensureAuthenticated, function (req, res){
		User.findOne({userId: req.user.id}).exec(function(err, docs){
			if(err){console.log(err)}
			console.log(docs)

			res.render('account', {title: 'Account', user: req.user, account: docs})
		})
	})


	app.get('/spot/:spot/:lng/:lat/:details', function (req, res){
		var object = req.params;
		
		var spot = object.spot; 
		var details = object.details
		var lng = object.lng; 
		var lat = object.lat;

		res.render('spot', {title: 'Spot', user: req.user, spot: spot, details: details, lng: lng, lat: lat})
	})

	app.get('/messages', ensureAuthenticated, function (req, res){
		res.render('messages', {title: 'Messages', user: req.user})
	})


	app.get('/create', ensureAuthenticated, function (req, res){
		res.render('create', {title: 'Create', user: req.user})
	})


	app.post('/create', ensureAuthenticated, function (req, res){
		var object = req.body;
		geocoder.geocode(object.hostAddress, function ( err, data ) {
			if(err){console.log(err)}

			var lat = data.results[0].geometry.location.lat;
			var lng = data.results[0].geometry.location.lng;

			console.log(req.user.id)
			var spot = {
				owner: req.user.id
				, open: object.open
				, address: object.hostAddress
				, city: object.hostCity
				, state: object.hostState
				, zip: object.hostZip
				, lat: lat
				, lng: lng
				, wifi: object.hostWifi
				, bathroom: object.hostBathroom
				, shower: object.hostShower 
				, tent: object.hostTent 
				, water: object.hostWater 
				, waste: object.hostWaste
				, max: object.hostDays
			}


			mySpot = new Spot(spot)

			mySpot.save(function(err) {
		        if (err) {
		            console.log(err);
		        }
		        res.redirect('/map')
		        
		    });

		});


	})

}