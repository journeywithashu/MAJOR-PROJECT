const express = require('express');
const app = express();
const session = require('express-session'); 
const flash = require('connect-flash');
const path = require('path');



const sessionOptions = { 
secret:"mysecret",
resave: false,
saveUninitialized: true
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
     res.locals.success = req.flash("success");
     res.locals.error = req.flash("error");
     next();
});

app.get('/register', (req, res) => {
     let {name ="annonymus"} = req.query;
     req.session.name = name;
     if(name === "annonymus"){
          req.flash("error", "you have to provide a name");
     }else{
          req.flash("success", "you have registered successfully");
     }
     res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
     
     res.render("page.ejs",{name:req.session.name});
});




// app.get("/reqcount",(req,res)=>{
//      if(req.session.count){
//           req.session.count++;
//      }else{
//      req.session.count = 1;
//      }
//      res.send(`you sent a request ${req.session.count} times`);
// })
     // app.get('/', (req, res) => {
     //      res.send("test successful");
     // });



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});