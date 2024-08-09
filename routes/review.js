const express=require("express");

const router=express.Router({mergeParams:true});
const {reviewSchema}=require("../schema.js")
const wrapAsync=require("../util/asyncWrap.js")
const ExpressError=require("../util/ExpressErors.js")
const listing = require('../models/listing');
const Review=require("../models/review.js")
const {validateReview,loggedIn, isReviewAuthor}=require("../middleware.js")
const reviewController=require("../controllers/review.js")

router.post("/",loggedIn,validateReview , wrapAsync(reviewController.postReview))

//delete review
router.delete("/:reviewid",loggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview))
module.exports=router;