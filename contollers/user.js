const User = require("../models/user");

module.exports.renderSignUpForm = (req,res) => {
    res.render("users/signup.ejs");
}

module.exports.signUp = async (req,res) => {
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const regiteredUser = await User.register(newUser, password);
        console.log(regiteredUser);
        req.login(regiteredUser,(err) => {
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    }
    catch(e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.renderLoginForm = (req,res) => {
    res.render("users/login.ejs");
}

module.exports.login = async (req,res) => {
    req.flash("success","Welcome back to Wanderlust!");
    res.redirect(res.locals.redirectUrl || "/listings");
}

module.exports.logout = (req,res,next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    })
}