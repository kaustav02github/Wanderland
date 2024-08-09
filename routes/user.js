const express=require("express");
const User=require("../models/user")
const router=express.Router();
const wrapAsync=require("../util/asyncWrap")
const passport=require("passport");
const { saveRedirectUrl, loggedIn } = require("../middleware");
const userController = require("../controllers/user");
//sinup get route

router.route("/signup")
.get(userController.signupRender)
.post(userController.signup)


router.route("/login")
.get(userController.loginRender)
.post(saveRedirectUrl,passport.authenticate("local",
    {failureRedirect:"/login",failureFlash:true}),
    userController.login)


router.get("/logout",userController.logout)


module.exports=router;