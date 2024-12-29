const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const { render } = require("ejs");

router.get("/", catchAsync(campgrounds.index));

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router.get("/:id", catchAsync(campgrounds.showCampground));

router.post(
    "/",
    isLoggedIn,
    validateCampground,
    catchAsync(campgrounds.createCampground)
);

router.get(
    "/:id/edit",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.renderEditForm)
);

router.put(
    "/:id",
    validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.updateCampground)
);

router.delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
