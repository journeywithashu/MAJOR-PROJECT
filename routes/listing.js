const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsyc.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");

const { listingSchema , reviewSchema} = require("../schema.js");

const listingController = require("../controllers/listings.js");


router.route("/")
.get(wrapAsync(listingController.index)
)
.post( 
     isLoggedIn,
     validateListing,
     wrapAsync(listingController.createListing)
);


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
.get(
     wrapAsync(listingController.showListing)
)
.put(
     isLoggedIn,
     isOwner,
     validateListing,
     wrapAsync(listingController.updatingListing)
)
.delete(
     isLoggedIn,
     isOwner,
     wrapAsync(listingController.deleteListing));

//Edit Route
 router.get("/:id/edit",
     isLoggedIn,
     isOwner,
     wrapAsync(listingController.renderEditForm)
); 



module.exports = router;
