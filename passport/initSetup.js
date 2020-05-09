var signIn = require('./signin');
var signUp = require('./signup');
var User = require('../model/user');

const initSetup = (passport) => {
    //Thiết lập mặc định cho passport
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user)=>{
            done(err, user);
        });
    });
    signIn(passport);
    signUp(passport);
};

module.exports = initSetup;