const fs = require(`fs`);
const mongoose = require("mongoose");
const dotenv = require(`dotenv`);
dotenv.config({ path: "./config.env" });
const Tour = require("../../model/tourModel");
const Review = require("../../model/reviewModel");
const User = require("../../model/userModel");

// MongoDB Connection
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`=====DB Connected=====`);
  });

//   Read JSON
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);
// IMPORT in DB
const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log(`=====DATA Succesfully Loaded in DB=====`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE All DATA From DB Collection
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log(`======DATA Succesfully Deleted======`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Execute Scripts for terminal Import & DELETE

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

// node dev-data/data/import-dev-data.js --(import || delete)
