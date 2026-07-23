if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

//requiring express
const express = require("express");
const app = express();

//requiring mongoose
const mongoose = require("mongoose");

//requiring ejs files
const path = require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));

//requirng method override package
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

//requring ejsmate
const ejsmate = require("ejs-mate");
app.engine("ejs",ejsmate);

//requiring static files
app.use(express.static(path.join(__dirname,"public")));

//requiring ExpressError
const ExpressError = require("./utils/ExpressError.js");

//requiring all routes of listing.js file
const listingRouter = require("./routes/listing.js");

//requiring all routes of review.js file
const reviewRouter = require("./routes/review.js");

//requiring all routes of user.js file
const userRouter = require("./routes/user.js");

//requiring passport package
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const session = require("express-session");
const {default: MongoStore} = require("connect-mongo");
const flash = require("connect-flash");
const { error } = require("console");

//database connection
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.MONGOATLASDB_URL;

main()
    .then(() =>{
        console.log("connected to DB");
    })
    .catch((err) =>{
        console.log(err);
    });

async function main() {
  await mongoose.connect(dbUrl); 
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});

store.on("error",(err) => {
    console.log("ERROR FOUND IN MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 3,
        maxAge: 1000 * 60 * 60 * 24 * 3,
        httpOnly: true
    }
};

app.use(session(sessionOptions));
app.use(flash());

//authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//starting server
app.listen(8080,() =>{
    console.log("server is listening to port 8080");
});

app.get("/", (req,res) => {
    res.redirect("/listings");
});

//home route
// app.get("/", (req,res) => {
//     res.send("Hi, I am root");
// });

//testing route
// app.get("/testlisting", async (req,res) => {
//     let sampleListing = new listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India"
//     });
//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error")
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req,res) => {
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//     let regiteredUser = await User.register(fakeUser,"helloworld");
//     res.send(regiteredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("/*splat",(req,res,next) => {
    next(new ExpressError(404, "Page Not Found!"));
});

//Error Handler Middleware
app.use((err,req,res,next) => {
    let {statusCode= 500 ,message="something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});