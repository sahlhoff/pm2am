var express = require('express')
  , http = require('http')
  , path = require('path')
  , passport = require('passport')
  , mongoose = require('mongoose')
  , User = require('./models/user')
  , FacebookStrategy = require('passport-facebook').Strategy
  , expressLayouts = require('express-ejs-layouts');



var FACEBOOK_APP_ID = "151509805039955"
var FACEBOOK_APP_SECRET = "2ce7ce96059c8da13d6d4705b6c86eb3";


passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://pm2am.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'photos']
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      User.findOne({userId : profile.id }, function(err, existingUser) {
            if (err || existingUser) {
                return done(err, profile.id);
            }

            var user = new User({ 
                  accessToken : accessToken
                , userId : profile.id
                , photo: profile.photos[0].value
                //might need to change this /\/\/\
                , displayName: profile.displayName
            });

            user.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
          }); 
      console.log(profile)
      return done(null, profile);
    });
  }
));







var app = express();


app.configure(function(){
  app.set('port', process.env.PORT || 5000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.set('view engine', 'ejs');
  app.set('layout', 'layout');    
  app.use(express.favicon());
  app.use(expressLayouts);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});



mongoose.connect('mongodb://sahlhoff:Bremen123@ds029828.mongolab.com:29828/pm2am')


require('./routes/routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
