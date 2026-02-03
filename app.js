const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing")
const path = require("path");
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsyc.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema , reviewSchema} = require("./schema.js");
const Reviews = require("./models/review.js");


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
app.use(express.static(path.join(__dirname,"/public"))),


// app.get("/",(req,res)=>{
//      res.send("Hi, I am root");
// });

//root route -> EJS page
app.get("/",async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index",{allListings});
});

const validateListing = (req,res,next)=>{
     const {error} = listingSchema.validate(req.body);
     if(error){
          let errorMsg = error.details.map(el=>el.message).join(",");
          throw new ExpressError(400,errorMsg);
     }else{
          next();
     }
};

const validateReview = (req,res,next)=>{
     const {error} = reviewSchema.validate(req.body);
     if(error){
          let errorMsg = error.details.map(el=>el.message).join(",");
          throw new ExpressError(400,errorMsg);
     }else{
          next();
     }
};
     


//Index Route
app.get("/listings",wrapAsync(async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
})
);

//New Route
app.get("/listings/new",(req,res)=>{
     res.render("listings/new.ejs");
});


//Show Route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs", { listing });
})
);

//Create Route
app.post("/listings",validateListing,
     wrapAsync(async(req,res,next)=>{
         let result = listingSchema.validate(req.body);
         console.log(result);
         if(result.error){
          throw new ExpressError(400,result.error);
         }

  const listingData = { ...req.body.listing };
  if (typeof listingData.image === "string") {
       if (listingData.image.trim() === "") {
            delete listingData.image;
       } else {
            listingData.image = { url: listingData.image };
       }
  } else if (listingData.image && typeof listingData.image.url === "string") {
       if (listingData.image.url.trim() === "") {
            delete listingData.image;
       }
  }
  const newListing = new Listing(listingData);
  await newListing.save();
  res.redirect("/listings");

    
}));


//Edit Route
 
app.get("/listings/:id/edit",wrapAsync(async(req,res)=>{
let {id} = req.params;
 const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
})
); 

//UpdateRoute
app.put("/listings/:id",
     validateListing,wrapAsync(async(req,res)=>{
     let {id} = req.params; 
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);

//Delete Route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params; 
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

//Reviews
//Post review route
app.post("/listings/:id/reviews",validateReview,wrapAsync(async(req,res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Reviews(req.body.review);

     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     
     res.redirect(`/listings/${listing._id}`);

}));

//Delete Route for reviews
app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
     let {id, reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
     await Reviews.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
}));




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


