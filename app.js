require('dotenv').config();

// console.log(process.env.SECRET)
const express=require("express");
const { default: mongoose } = require("mongoose");
const app=express();
const path = require("path");
const methodOverride=require("method-override")
const ejsMate=require("ejs-mate");
const listingRoutes=require("./routes/listing.js")
const reviewRoutes=require("./routes/review.js")
const userRoutes=require("./routes/user.js")
const ExpressError=require("./util/ExpressErors.js")
const flash=require("connect-flash")
const session=require("express-session");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
const passport = require("passport");
const port = process.env.PORT || 8080;
const sessionOptions=
                    {secret:process.env.secret,
                    resave:false,
                    saveUninitialized:true,
                    cookie:{
                        expires:Date.now()+7*24*60*60*1000,
                        maxAge:7*24*60*60*1000,
                        httpOnly:true}
                    }


  main().then(()=>{
    console.log("connection successful")
}).catch((err)=>{console.log(err)})
async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(sessionOptions));
app.use(flash())


//passport set up
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user//currUser will be available at our renders(frontend part..ejs)
    next();
})


app.use("/listings",listingRoutes)
app.use("/listings/:id/reviews",reviewRoutes)
app.use("/",userRoutes)
 app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode).render('error.ejs', { err });
});

// app.all("*",(req,res,next)=>{
// next(new ExpressError(404,"page not found!"))
// })


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

})

