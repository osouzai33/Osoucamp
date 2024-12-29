const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get(
    "/:id",
    catchAsync(async (req, res) => {
        const campground = await Campground.findById(req.params.id)
            .populate({
                path: "reviews",
                populate: {
                    path: "author",
                },
            })
            .populate("author");
        console.log(campground);
        if (!campground) {
            req.flash("error", "キャンプ場が見つかりませんでした");
            return res.redirect("/campgrounds");
        }
        res.render("campgrounds/show", { campground });
    })
);

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(async (req, res) => {
        const campground = new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash("success", "新しいキャンプ場を登録しました");
        res.redirect(`/campgrounds/${campground._id}`);
    })
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const campground = await Campground.findById(id);
        if (!campground) {
            req.flash("error", "キャンプ場が見つかりませんでした");
            return res.redirect("/campgrounds");
        }

        res.render("campgrounds/edit", { campground });
    })
);

router.put(
    "/:id",
    validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        const camp = await Campground.findByIdAndUpdate(id, {
            ...req.body.campground,
        });
        req.flash("success", "キャンプ場を更新しました");
        res.redirect(`/campgrounds/${camp._id}`);
    })
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(async (req, res) => {
        const { id } = req.params;
        await Campground.findByIdAndDelete(id);
        req.flash("success", "キャンプ場を削除しました");
        res.redirect("/campgrounds");
    })
);

module.exports = router;
