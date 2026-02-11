const User = require("../models/user");
module.exports.renderSignup = (req,res)=>{
     res.render("users/signup.ejs");
};

module.exports.signup = async(req,res)=>{
     try{
           const {username,email,password} = req.body;
  const newUser = new User({username,email});
  const registeredUser = await User.register(newUser,password);
  console.log(registeredUser);
  req.login(registeredUser,(err)=>{
     if(err){
          return next(err);
     }
     req.flash("success","Welcome to Wanderlust!");
     res.redirect("/listings");
     });
  
     }catch(e){
          req.flash("error",e.message);
          res.redirect("/signup");
     } 
  
};

module.exports.renderLogin = (req,res)=>{
     res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
     req.flash("success", "welcome back to wanderlust! you are login successfully ");
     res.redirect(res.locals.redirectURL || "/listings");
};

module.exports.logout = (req,res,next)=>{
     req.logout((err)=>{
          if(err){
               return next(err);
          }
          req.flash("success","You have logged out successfully!");
          res.redirect("/listings");
     });
     
}