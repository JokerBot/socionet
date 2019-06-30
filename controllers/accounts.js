var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var db = require("../models");
var router = express.Router();





router.get('/signup', function (req, res,next) {
        // res.render("accounts");
        // //console.log('inside')
        if(req.isAuthenticated()){
         res.redirect('/')
        }
        else{
            // //console.log(req.user)
            res.render('signup');
        }
});

    // logout of user account
    router.get('/logout', function(req, res) {
        req.session.destroy(function(err){
          req.logout();
          res.redirect('/');
        })
    });





// process the signup form ==============================================
//=======================================================================

  router.post('/signup', function(req, res,next) {




    passport.authenticate('local-signup', function(err, user, info) {
    //   //console.log("info", info);
      if (err) {
        // //console.log("passport err", err);
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status
      if (! user) {
        //console.log("user error", user);
        return res.send({ success : false, message : 'authentication failed' });
      }


    req.logIn(user, loginErr => {
    
            if (loginErr) {
            //console.log("loginerr", loginerr)
            return next(loginErr);
            }
            //var userId = user.dataValues.id;
            //console.log('redirecting....');
            
            res.cookie('ssid', user.uuid );
            return res.redirect("/");
        });   

    })(req, res, next);
      
  });

  router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {

      if (err) {
        //console.log("passport err", err);
        return next(err); // will generate a 500 error
      }
      // Generate a JSON response reflecting authentication status

      if (!user) {

        return res.send({ success : false, message : 'authentication failed'});
      }
      

      req.logIn(user, loginErr => {
        if (loginErr) {
          //console.log("loginerr", loginErr)
          return next(loginErr);
        }
        //console.log(req.user);
        if(req.isAuthenticated()){
            //console.log('is logged in')
        }
        else{
            //console.log('not logged in')
        }
        return res.redirect('/')
        
      });      
    })(req, res, next);

  });



module.exports = router;