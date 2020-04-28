const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const User = require('../models/user');

module.exports = () => {
    passport.use(new FacebookTokenStrategy({
        clientID: '476656986502257',
        clientSecret: '0b823e07f34fa0902419bcc57e8d9f04'
    },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({
                'facebookProvider.id': profile.id
            }, (err, user) => {
                // no user was found, lets create a new one
                if (!user) {
                    var newUser = new User({
                        fullName: profile.displayName,
                        email: profile.emails[0].value,
                        facebookProvider: {
                            id: profile.id,
                            token: accessToken
                        }
                    });

                    newUser.save((error, savedUser) => {
                        if (error) {
                            console.log(error);
                        }
                        return done(error, savedUser);
                    });
                } else {
                    return done(err, user);
                }
            });
        }));
}