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
    const campground = new Campground({
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
