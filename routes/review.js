const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");



//Post review route
router.post(
     "/",
     isLoggedIn,
     validateReview,
     wrapAsync(async(req,res)=>{
     let listing = await Listing.findById(req.params.id);
     let newReview = new Reviews(req.body.review);
     newReview.author = req.user._id;
     console.log(newReview);
     
     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
     req.flash("success","Successfully added a new review!");
     res.redirect(`/listings/${listing._id}`);

}));

//Delete Route for reviews
router.delete(
     "/:reviewId",
     isLoggedIn,
     isReviewAuthor,
     wrapAsync(async(req,res)=>{
     let {id, reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
     await Reviews.findByIdAndDelete(reviewId);
     req.flash("success","Successfully deleted the review!");
     res.redirect(`/listings/${id}`);
}));

module.exports = router;
