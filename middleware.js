module.exports.isLoggedIn = (req,res,next)=>{
     console.log(req.user);
     
     if(!req.isAuthenticated()){
          req.session.redirectURL = req.originalUrl;
          req.flash("error","You must be signed in first!");
          return res.redirect("/login");
     }
     next();
}

module.exports.savedRedirectURL = (req,res,next)=>{
     if(req.session.redirectURL){
          res.locals.redirectURL = req.session.redirectURL;
     }
     next();
};