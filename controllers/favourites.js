var express = require('express');
var db = require("../models");
var router = express.Router();


function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();
  
    res.redirect('/');
  }
  
  
  
function getCurrentUserId(req){
    if (req.isAuthenticated()){
    //   console.log(req.user)
      return req.user.uuid
    }
}
  
router.post('/:status_id', isLoggedIn,function (req, res,next) {

    var CurrentUserId=getCurrentUserId(req);
    db.Favourites.findOne({
        where: {
            status_id: req.params.status_id,
            uuid:CurrentUserId
        }
    }).then(function(favourite, err){
        if(err) {
            return res.send('error');
        } 

        if (favourite) {
            db.Favourites.destroy({
                where: {
                    status_id: req.params.status_id,
                    uuid:CurrentUserId
                }
            });
            
        } else {
            db.Favourites.create({
                status_id: req.params.status_id,
                uuid:CurrentUserId
            });

        }
        res.send('success');
    });

});

module.exports = router;