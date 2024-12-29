const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    if (!campgrounds) {
        req.flash("error", "キャンプ場が見つかりませんでした");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/index", { campgrounds });
};
