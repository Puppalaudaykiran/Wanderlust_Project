//requiring express
const express = require("express");

//creating router object
const router = express.Router();

//requiring wrapAsync.js
const wrapAsync = require("../utils/wrapAsync.js");

//requiring modules of listing.js file
const Listing = require("../models/listing.js");

//requiring controller listinng.js
const listingController = require("../contollers/listing.js");

const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const { populate } = require("../models/review.js");

//requiring modules of cloudConfig.js file
const {storage} = require("../cloudConfig.js");

//requiring multer package
const multer = require("multer");
const upload = multer({ storage });

//index route
router.get("/", wrapAsync(listingController.index));

//new route
router.get("/new", isLoggedIn,listingController.renderNewForm);

//show route
router.get("/:id", wrapAsync(listingController.showListing));

//create route
router.post("/",isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));


//Edit route
router.get("/:id/edit", isLoggedIn , isOwner ,wrapAsync(listingController.renderEditForm));

//update route
router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;