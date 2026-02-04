const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

const { listingSchema , reviewSchema} = require("../schema.js");

const validateListing = (req,res,next)=>{
     const {error} = listingSchema.validate(req.body);
     if(error){
          let errorMsg = error.details.map(el=>el.message).join(",");
          throw new ExpressError(400,errorMsg);
     }else{
          next();
     }
};


//Index Route
router.get("/listings",wrapAsync(async(req,res)=>{
     const allListings = await Listing.find({});
     res.render("listings/index.ejs",{allListings});
})
);

//New Route
router.get("/listings/new",(req,res)=>{
     res.render("listings/new.ejs");
});


//Show Route
router.get("/listings/:id",wrapAsync(async(req,res)=>{
     let {id} = req.params;
     const listing = await Listing.findById(id).populate("reviews");
     res.render("listings/show.ejs", { listing });
})
);

//Create Route
router.post("/",validateListing,
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
 
router.get("/:id/edit",wrapAsync(async(req,res)=>{
let {id} = req.params;
 const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing});
})
); 

//UpdateRoute
router.put("/:id",
     validateListing,wrapAsync(async(req,res)=>{
     let {id} = req.params; 
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
);

//Delete Route
router.delete("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params; 
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

module.exports = router;