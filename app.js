const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");


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

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));


app.get("/",(req,res)=>{
     res.send("Hi, I am root");
});


//Index Route
app.get("/listings",async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
});


//Show Route
app.get("/listings/:id",async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id);
     res.render("listings/show.ejs", { listing });
});

// app.get("/testlisting",async(req,res)=>{
//      let sampleListing = new Listing({
//           title:"My New Villa",
//           description:"by the beach",
//           price:1200,
//           location:"calanguate,Goa",
//           country: "India",
//      });

//      await sampleListing.save();
//      console.log("sample was saved");
//      res.send("successfull testing");
     
// });

app.listen(8080,()=>{
     console.log("server is listening to port 8080");
     
});


