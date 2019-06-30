var express = require('express');
var db = require("../models");
var router = express.Router();
var Handlebars = require('handlebars');


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
  


router.post('/', isLoggedIn,function (req, res,next) {
    
    var CurrentUserId=getCurrentUserId(req);
    db.Status.create({
                content: req.body.content,
                uuid: CurrentUserId,
            
            }).then(function(dbStatus) {
                //console.log("created result: ", dbUser);
            // send post back to render
            return res.redirect('/');

            }).catch(function (err) {
            // handle error;
            console.log(err);
            });
     
});
/*

router.get('/:id', isLoggedIn,function (req, res,next) {
    
        var statusId=req.params.id;
        var CurrentUserId=getCurrentUserId(req);
        db.Status.findOne({
            where:{
                status_id:statusId
            },
            include:[db.Accounts]
        }).then(function(status, err){
            if(err){
                res.send('error');
            }
            if(status) {
                addNoOfFavouritesToAllStatus(status,CurrentUserId)
                .then(function(result){
                  console.log(result)
                  return res.render('status',{authenticated:true,status:result});
                })

            }else{
                res.redirect('/')        
            }
        })
         
});

*/

/** post a comment in status */
router.post('/:status_id/comment', isLoggedIn,function (req, res,next) {
    var statusId=req.params.status_id;
    var CurrentUserId=getCurrentUserId(req);

    db.Comments.create({
        content: req.body.comment,
        uuid: CurrentUserId,
        status_id: statusId
    },{
      include:[db.Accounts,db.Status]

    }).then(function(comment) {

      //get all details related to this comment
      db.Comments.findOne({
        include:[
          { model: db.Accounts},
          { model: db.Status}
        ],
        where:{
          comment_id: comment.comment_id
        }
      }).then(function(comment2) {
          
        var source = "<div class='post-status' data-status-id='{{status.status_id}}'>"+
        "<div class='media'>"+
            "<div>"+
                "<img class='mr-3 status-profile-img' alt='Bootstrap Media Preview' src='https://www.layoutit.com/img/sports-q-c-64-64-8.jpg' />"+
            "</div>"+
            "<div class='text-wrap'>"+
                "<b>{{Account.display_name}}</b>"+
                "<p>{{content}}</p>"+
            "</div>"+
        "</div>"+
        "</div>";

        var template = Handlebars.compile(source);

        var result = template(comment2.toJSON());


        console.log(result)
        return res.send(result);

      });      


        
    }).catch(function (err) {
        console.log(err);
        return res.send('error');
    });    

     
});

    

module.exports = router;