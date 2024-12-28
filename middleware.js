module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "ログインしてください");
        return res.redirect("/login");
    }
    next();
};
