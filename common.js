
module.exports = {

isLoggedIn: function(req, res, next) {
    
    if (req.isAuthenticated())
        return next();
  
    res.redirect('/');
  },
  
   getCurrentUserId: function(req){
    if (req.isAuthenticated()){
    //   console.log(req.user)
      return req.user.uuid
    }
  }

}
return module.exports;