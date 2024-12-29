const ExpressError = require("./utils/ExpressError");
const { campgroundSchema, reviewSchema } = require("./schema");
const Campground = require("./models/campground");
const Review = require("./models/review");
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

module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    if (result.error) {
        const msg = result.error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash("error", "そのアクションの権限がありません");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map((e) => e.message).join(",");
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash("error", "レビューが見つかりませんでした");
        return res.redirect(`/campgrounds/${id}`);
    }
    if (!review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "そのアクションの権限がありません");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
};
