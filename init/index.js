const mongoose=require("mongoose");
const dotenv = require('dotenv');
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL =process.env.MONGO_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({...obj, owner:'66af84f36a8b6c696cb06f0b'}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();