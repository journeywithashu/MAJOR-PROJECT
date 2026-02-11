const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsyc.js");
const ExpressError = require("../utils/ExpressError.js");
const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");
const{validateReview,isLoggedIn,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");



//Post review route
router.post(
     "/",
     isLoggedIn,
     validateReview,
     wrapAsync(reviewController.createReview));

//Delete Route for reviews
router.delete(
     "/:reviewId",
     isLoggedIn,
     isReviewAuthor,
     wrapAsync(reviewController.destroyReview));

module.exports = router;
