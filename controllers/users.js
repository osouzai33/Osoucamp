const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
    res.render("users/login");
};

module.exports.login = (req, res) => {
    req.flash("success", "おかえりなさい！");
    console.log(req.session);
    // console.log("session return to", req.session.returnTo);
    req.session.save((err) => {
        if (err) {
            console.log("セッションの保存中にエラーが発生しました", err);
            return res.redirect("/campgrounds");
        }
        const redirectUrl = req.session.returnTo || "/campgrounds";
        delete req.session.returnTo;
        console.log("Redirect to ".redirectUrl);
        res.redirect(redirectUrl);
    });
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash("success", "ログアウトしました");
        res.redirect("/campgrounds");
    });
};
