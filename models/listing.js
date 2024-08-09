const { validateHeaderName } = require("http");
const mongoose=require("mongoose")
const Review=require("./review.js")
const listingSchema=new mongoose.Schema({
    title:{type:String,
        required:true
    },
    description:String,
    image: {
        filename: { type: String, },
        url: { type: String },
      },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Review"
    }],
    owner: 
    {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    },


})
//delete all the reviews from Review model after listing model deletion
listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing)
   {await Review.deleteMany({_id:{$in:listing.reviews}})}
})

const listing=mongoose.model("listing",listingSchema);
module.exports=listing