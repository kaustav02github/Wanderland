const listing=require("../models/listing")

module.exports.index=async (req,res)=>{
    const alllistings=await listing.find()
return res.render("listing/index.ejs",{alllistings})
    }

module.exports.rendernewform=async(req,res)=>{
    res.render("listing/new.ejs")
}
module.exports.createNewlisting=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename
    const newlisting=new listing(req.body.listing);
    newlisting.owner=req.user._id;
    newlisting.image={url,filename}
   await newlisting.save();
   req.flash("success","new listing created")
  return  res.redirect("/listings")
 next()
 }

 module.exports.showListing=async (req, res) => {
    const { id } = req.params;
    const sample = await listing.findById(id)
        .populate({
            path: "reviews",
            populate: { path: "author" }
        })
        .populate("owner");

    if (!sample) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }

    res.render("listing/show.ejs", { sample });
}
module.exports.renderEditform=async (req,res)=>{
    let {id}=req.params;
    const sample= await listing.findById(id)
    if(!sample)
        {
            req.flash("error","listing  not found");
            res.redirect("/listings")
        }
   return  res.render("listing/edit.ejs",{sample})
}

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing)
        {throw new ExpressError(400,"Please enter valid listing data")}

let {id}=req.params;
const newlisting=await listing.findByIdAndUpdate(id,{...req.body.listing})
if(typeof req.file!=="undefined")
{
    let url=req.file.path;
    let filename=req.file.filename;
   newlisting.image={url,filename}
   newlisting.save();
}
req.flash("success","listing updated")
res.redirect(`/listings/${id}`)
}

module.exports.deleteListing=async(req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id)
   req.flash("success","listing deleted")
   return res.redirect("/listings")
}