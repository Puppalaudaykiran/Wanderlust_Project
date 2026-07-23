//requiring express
const express = require("express");

//creating router object
const router = express.Router({mergeParams: true});

//requiring wrapAsync.js
const wrapAsync = require("../utils/wrapAsync.js");

//requiring ExpressError
const ExpressError = require("../utils/ExpressError.js");

//requiring schema.js
const { reviewSchema } = require("../schema.js");

//requiring modules of rerview.js file
const Review = require("../models/review.js");

//requiring modules of listing.js file
const Listing = require("../models/listing.js");

const {validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../contollers/review.js");

//review route
//post review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//Delete Review Route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;