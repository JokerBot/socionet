// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model
var db  = require('../models');

// expose this function to our app using module.exports
module.exports = function(passport) {
   
    passport.serializeUser(function(user, done) {
        // console.log('in serialize')
        // console.log(user.uuid)
        done(null, user.uuid);
    });

    // used to deserialize the user
    passport.deserializeUser(function(uuid, done) {
        // console.log('in deserialize')
    //    console.log(uuid)
        db.Accounts.findOne({
            where: {
                uuid: uuid 
            }
        }).then(function(user, err) {
            if (user) {
                    
                done(null, user.get());
                // console.log("success")

        
            } else {
                // console.log("user.errors", user.errors)
                done(user.errors, null);
        
            }
        });

    });


    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and account_key, we will override with email
            usernameField: 'email',
            passwordField : 'account_key',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, account_key, done) {
           
            process.nextTick(function() {
            
            db.Accounts.findOne({
                where: {
                    email: email
                }
            }).then(function(user, err){
                if(err) {
                    // console.log("err",err)
                    return done(err);
                } 

                // check to see if theres already a user with that email
                if (user) {

                    // console.log('signupMessage', 'That email is already taken.');
                    return done(null, false);
                } else {
                    // console.log("creating");
                    // if there is no user with that email
                    // create the user
                    db.Accounts.create({
                                display_name:req.body.display_name,
                                email: req.body.email,
                                account_key: db.Accounts.generateHash(account_key)

                                }).then(function(dbUser) {
                                    //console.log("created result: ", dbUser);
                                // send post back to render
                                return done(null, dbUser);

                                }).catch(function (err) {
                                // handle error;
                                // console.log(err);
                                }); 
                }
            });   
        });

    }));



    passport.use('local-login', new LocalStrategy({
            // by default, local strategy uses username and account_key, we will override with email
            usernameField: 'email',
            passwordField : 'account_key',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, account_key, done) { // callback with email and account_key from our form
        
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists
            db.Accounts.findOne({
                where: {
                    email: req.body.email 
                }
            }).then(function(user, err) {
        

                if (!user){
                    // console.log("no user found");
                    return done(null, false); // req.flash is the way to set flashdata using connect-flash
                }
                    

                // if the user is found but the account_key is wrong
                if (user && !user.validPassword(req.body.account_key)){

                    return done(null, false); // create the loginMessage and save it to session as flashdata
                }


                return done(null, user);
            

            });

    }));

};