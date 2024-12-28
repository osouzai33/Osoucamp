const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash("success", "OsouCamp へようこそ");
            res.redirect("/campgrounds");
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
});

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    (req, res) => {
        req.flash("success", "おかえりなさい！");
        console.log(req.session.returnTo);
        const redirectUrl = req.session.returnTo;
        res.redirect(redirectUrl);
    }
);

router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "ログアウトしました");
        res.redirect("/campgrounds");
    });
});

module.exports = router;
