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

const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const MongoStore = require("connect-mongo");

const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");

const CampgroundRoutes = require("./routes/campgrounds");
const ReviewRoutes = require("./routes/reviews");
const UserRoutes = require("./routes/users");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/osou-camp";
mongoose
    .connect(dbUrl)
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
app.use(mongoSanitize());

const secret = process.env.SECRET || "mysecret";

const store = MongoStore.create({
    mongoUrl: dbUrl,
    secret: {
        secret: secret,
    },
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true,
    },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

const scriptSrcUrls = ["https://api.mapbox.com", "https://cdn.jsdelivr.net"];
const styleSrcUrls = ["https://api.mapbox.com", "https://cdn.jsdelivr.net"];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
const imgSrc = ["https://res.cloudinary.com", "https://images.unsplash.com"];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: ["'self'", "blob:", "data:", ...imgSrc],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
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
