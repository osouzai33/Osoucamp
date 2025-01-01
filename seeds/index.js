const mongoose = require("mongoose");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

const cities = require("./cities");

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

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const randomCityIndex = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 5000) + 3000;
        const campground = new Campground({
            author: "676c399ab7034be995050716",
            location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
            title: `${sample(descriptors)}・${sample(places)}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[randomCityIndex].longitude,
                    cities[randomCityIndex].latitude,
                ],
            },
            images: [
                {
                    url: "https://res.cloudinary.com/dp6zctsvy/image/upload/v1735463244/samples/landscapes/nature-mountains.jpg",
                    filename: "samples/landscapes/nature-mountains",
                },
                {
                    url: "https://res.cloudinary.com/dp6zctsvy/image/upload/v1735463241/sample.jpg",
                    filename: "sample",
                },
                {
                    url: "https://res.cloudinary.com/dp6zctsvy/image/upload/v1735463243/samples/landscapes/beach-boat.jpg",
                    filename: "samples/landscapes/beach-boat",
                },
            ],
            description:
                "日々の喧騒を離れ、自然の中で心を解き放つひとときを。木々のざわめきや鳥のさえずりに耳を傾けながら、静かな時間を過ごすことができます。家族や仲間と焚き火を囲むひとときは、かけがえのない思い出に。初心者でも安心の設備を完備。ここでしか味わえない自然との一体感を、ぜひ体験してください。",
            price,
        });
        await campground.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});
