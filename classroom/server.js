const express = require('express');
const app = express();
const session = require('express-session');

const sessionOptions = { 
secret:"mysecret",
resave: false,
saveUninitialized: true
};

app.use(session(sessionOptions));

app.get('/register', (req, res) => {
     let {name ="annonymus"} = req.query;
     req.session.name = name;
     console.log(req.session.name);
     
     res.send(name);
});

app.get("/hello",(req,res)=>{
     res.send(`hello,${req.session.name}`);
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