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
      location: `${cities[randomCityIndex].prefecture}${cities[randomCityIndex].city}`,
      title: `${sample(descriptors)}・${sample(places)}`,
      image: "https://picsum.photos/250/200 ",
      description:
        "キャンプとは、自然に身を委ねることである。世間に揉まれている日常から自分を解き放つ場である。そんなひと時をぜひここで。",
      price,
    });
    await campground.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
