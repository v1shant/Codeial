const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "637268463823-cn2l11dbj8iomcos9ibg855hl60pdai7.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},

    function (accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile.emails[0].value}).exec((err, user) => {
            if (err) {
                console.log('error in google strategy-passport', err); return;
            }
            console.log(profile);
            if (user) {
                //if found, set this as req.user 
                return done(null, user);
            }
            else {
                //if not found, create the user and set it as req.user
                User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function (err, user) {
                    if (err) {
                        console.log('Error in creating user google strategy-passport', err); return;
                    }
                    return done(null, user);
                });
            }
        });
    }

));