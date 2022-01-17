const LocalStratergy = require('passport-local').Strategy;
const User = require('../models/user').User;
const bcrypt = require('bcrypt');


function init(passport) {
    passport.use(new LocalStratergy({
        usernameField: 'email'
    }, async (email, password, done) => {
        const user = await User.findOne({email: email});
        // console.log('***user***',user);
        if(!user){
            return done(null, false, { message: 'No user found'});
        }

        bcrypt.compare(password, user.password).then(match => {
            if(match) {
                console.log('match');
                return done(null, user, { message: 'Logged in successfully'});
            }

            return done(null, false, { message: 'Invalid credentials'});

        }).catch((err) => {
            console.log('error',err);
            return done(null, false, { message: 'Something went wrong while authentication'});
        })

    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({_id: id}, (err, user) => {
            done(err, user)
        })
    })

}

module.exports = init;