var express = require('express');
var router = express.Router();
var db = require("../models");

function isLoggedIn(req, res, next) {

  if (req.isAuthenticated())
      return next();

  res.redirect('/');
}



function getCurrentUserId(req){
  if (req.isAuthenticated()){
    // console.log(req.user)
    return req.user.uuid
  }
}





async function addDoesCurrentUserLikeIt(result,CurrentUserId){

  for (var i = 0, len = result.length; i < len; i++) { 

    //checking if current user iked it
    await db.Favourites.count({
      where:{
        status_id:result[i].status_id,
        uuid:CurrentUserId
      }
    }).then(function(count){
      result[i]=result[i].toJSON();

      if(count == 1){
        result[i].current_user_liked=true;
      }
      else{
        result[i].current_user_liked=false;
      }

    });

  }

  return result;
}


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.isAuthenticated()){


    var CurrentUserId=getCurrentUserId(req)

    db.Status.findAll({

      include:[
        { model: db.Accounts},
        { model: db.Comments, include: [db.Accounts], separate: true, order:[['comment_id','ASC']] },
        { model:db.Favourites}
      ],
      order: [
        ['status_id', 'DESC']
      ],
    })
    .then(function(result) {
      console.log(result[0].Favourites)

      addDoesCurrentUserLikeIt(result,CurrentUserId)
      .then(function(result){
        
        
        console.log('wait what')
        res.render('home',{authenticated:true,statuses:result,user:req.user});

      })
      
    }).catch(function (err) {
      // console.log(err);
      res.send(err);
    }); 
    

  }
  else{
    // console.log(' not authenticated')

    res.render('home',{message:"test message",authenticated:false});
  }
});




module.exports = router;
