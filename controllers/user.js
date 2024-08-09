const User=require("../models/user")
module.exports.signupRender=(req,res)=>{
   return  res.render("./users/signup.ejs")
    }


module.exports.signup=async(req,res)=>{
    try{
     let {username,email,password}=req.body;
    let newUser=new User({username,email})
   const newRegister= await User.register(newUser,password);
   console.log(newRegister)
   req.login(newRegister,(err)=>{
     if(err){
         return next(err);
     }
     req.flash("success","new user welcome to WanderLand")
    return res.redirect("/listings")
   })
 } 
 catch(err){
     req.flash("error",err.message);
    return res.redirect("/listings");
 }
 }

 module.exports.loginRender=(req,res)=>{
   return res.render("users/login.ejs")
}


module.exports.login=async(req,res)=>{
               
req.flash("success","welcome to wanderland")
let redirectUrl=res.locals.redirectUrl||"/listings"
return res.redirect(redirectUrl)
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
          return   next(err);
        }
        req.flash("success","logged out successfully")
       return res.redirect("/listings")
    })
}