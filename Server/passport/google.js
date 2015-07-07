var mongoose = require('mongoose');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var config = require('config');
var User = mongoose.model('User');

module.exports = new GoogleStrategy({
    clientID: config.google.clientID,
    clientSecret: config.google.clientSecret,
    callbackURL: config.google.callbackURL
    }, function(accessToken, refreshToken, profile, done) {
        console.log(profile)

        var options = {
            'googleid': profile.id
        };

        User.findOne(options, function (err, user) {
            if (err) return done(err);
            if (!user) {
                user = new User({
                    photo: profile.photos[0].value,
                    username: profile.displayName,
                    googleid: profile.id
                });
                user.save(function (err) {
                    if (err) console.log(err);
                    return done(err, user);
                });
            } else {
                return done(err, user);
            }
        });
    }
);
