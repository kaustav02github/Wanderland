const Review=require("../models/review")
const listing=require("../models/listing")


module.exports.postReview=async(req,res)=>{
    let newlisting=await listing.findById(req.params.id);
    let newreview=new Review(req.body.Review);
    newreview.author=req.user._id;
    newlisting.reviews.push(newreview);
    await newlisting.save();
    await newreview.save();
    req.flash("success","new review created!")
    console.log("new review saved");
    res.redirect(`/listings/${newlisting._id}`)

}
module.exports.destroyReview=async (req,res)=>{
    let {id,reviewid}=req.params;
    await listing.findByIdAndUpdate(id,{$pull:{reviews:reviewid}})//find listing by id and then deleting that particular review
    await Review.findByIdAndDelete(reviewid)
    req.flash("success","review successfully deleted")
    res.redirect(`/listings/${id}`)
}