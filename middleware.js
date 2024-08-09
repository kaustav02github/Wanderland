const listing=require("./models/listing")
const Review=require("./models/review")
const {listingSchema,reviewSchema}=require("./schema.js")
const ExpressError=require("./util/ExpressErors.js")


module.exports.loggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create new listing")
       return  res.redirect("/login")
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {res.locals.redirectUrl=req.session.redirectUrl}
   return  next();
}


module.exports.Owner=async(req,res,next)=>{
let {id}=req.params;
const sample= await listing.findById(id)
if(!res.locals.currUser||!sample.owner.equals(res.locals.currUser._id)){
    req.flash("error","you are not the owner")
   return  res.redirect(`/listings/${id}`)
}
next();
}


module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
   
    if(error){
        let err_msg=error.details.map(el=>el.message).join(",")
       next(new ExpressError(400,err_msg));
    }
    else{next();}
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const err_msg = error.details.map(el => el.message).join(',');
        console.log('Error in review validation schema:', err_msg); // Log the error message
        throw new ExpressError(400, err_msg);
    } else {
        next();
    }
};


module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewid}=req.params;
    const review= await Review.findById(reviewid)
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error","you can't delete someone else's review!!")
       return  res.redirect(`/listings/${id}`)
    }
    next();
    }