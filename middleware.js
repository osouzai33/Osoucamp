module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log("Middleware", req.originalUrl);
        req.session.returnTo = req.originalUrl;
        req.flash("error", "ログインしてください");
        console.log("Middleware After", req.session.returnTo);
        return res.redirect("/login");
    }
    next();
};
