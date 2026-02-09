const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");



const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoutes = require("./routes/user.js");



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
     console.log("connect to Db");
       })
    .catch((err)=>{
     console.log(err);
     });

async function main(){
     await mongoose.connect(MONGO_URL);
}


app.engine('ejs', ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
secret:"mysecret",
resave: false, 
saveUninitialized: true,
cookie: {
     expires:+ 7 * 1000 * 60 * 60 * 24, // 7 day
     maxAge:+ 7 * 1000 * 60 * 60 * 24, // 7 day
     httpOnly: true
 },
};
 
app.get("/",(req,res)=>{
     res.redirect("/listings");
});


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
     console.log(res.locals.success);
     
     res.locals.error = req.flash("error");
     next();
});

app.get("/registerUser",async(req,res)=>{
     const user = new User({
          email:"student@gamail.com",
          username:"student"
     });
     const newUser = await User.register(user,"helloworld");
     res.send(newUser);
});

app.use("/listings",listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/",userRoutes);




app.use((req,res,next)=>{
     next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
     let {statusCode = 500, message="something went wrong"} = err;
     //res.status(statusCode).send(message);
     res.status(statusCode).render("error.ejs",{message,err});
});

app.listen(8080,()=>{
     console.log("server is listening to port 8080");
     
});


