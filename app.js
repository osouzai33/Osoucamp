if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const CampgroundRoutes = require("./routes/campgrounds");
const ReviewRoutes = require("./routes/reviews");
const UserRoutes = require("./routes/users");

mongoose
    .connect("mongodb://localhost:27017/osou-camp", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("MongoDB 接続成功");
    })
    .catch((error) => {
        console.log("MongoDB コネクションエラー");
        console.log(error);
    });

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const sessionConfig = {
    secret: "mysecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        // httpOnly: true,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.get("/", (req, res) => {
    res.render("home");
});

app.use("/", UserRoutes);

app.use("/campgrounds", CampgroundRoutes);

app.use("/campgrounds/:id/reviews", ReviewRoutes);

app.all("*", (req, res, next) => {
    next(new ExpressError("ページが見つかりませんでした", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "何か問題が起きました。" } = err;
    if (!err.message) err.message = "何か問題が起きました。";
    res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
    console.log("ポート3000でリクエスト待受中...");
});
