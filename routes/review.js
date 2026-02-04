const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");


const validateReview = (req,res,next)=>{
     const {error} = reviewSchema.validate(req.body);
     if(error){
          let errorMsg = error.details.map(el=>el.message).join(",");
          throw new ExpressError(400,errorMsg);
     }else{
          next();
     }
};
//Post review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Reviews(req.body.review);

     listing.reviews.push(newReview);
     await newReview.save();
     await listing.save();
     
     res.redirect(`/listings/${listing._id}`);

}));

//Delete Route for reviews
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
     let {id, reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
     await Reviews.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
}));

module.exports = router;
