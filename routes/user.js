//requiring express
const express = require("express");

//creating router object
const router = express.Router();

//requiring user model
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../contollers/user.js");

router.get("/signup",userController.renderSignUpForm);

router.post("/signup",wrapAsync(userController.signUp));

router.get("/login",userController.renderLoginForm);

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect: "/login", failureFlash: true}), userController.login);

router.get("/logout", userController.logout);

module.exports = router;