const express = require("express");
const router = express.Router();
const { listingSchema, reviewSchema } = require("../schema.js");
const methodOverride = require("method-override");
const wrapAsync = require("../util/asyncWrap.js");
const ExpressError = require("../util/ExpressErors.js");
const listing = require("../models/listing");
const { loggedIn, Owner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({storage })
// Index route
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(loggedIn, upload.single("listing[image]"),validateListing , wrapAsync(listingController.createNewlisting));

// Render new listing form
router.get("/new", loggedIn, wrapAsync(listingController.rendernewform));

// Show detail of villa, update, and delete routes
router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(loggedIn, Owner,upload.single("listing[image]") ,validateListing, wrapAsync(listingController.updateListing))
  .delete(loggedIn, Owner, wrapAsync(listingController.deleteListing));

// Edit/update route
router.get("/:id/edit", loggedIn, Owner, wrapAsync(listingController.renderEditform));

module.exports = router;
