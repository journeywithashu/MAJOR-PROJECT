const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing");
const MONGO_URL = process.env.MONGO_CONNECTION_URL;

main()
    .then(() => {
        console.log("connect to Db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: '698ca2f2666d21c953d41087'
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialize");

}

initDB();