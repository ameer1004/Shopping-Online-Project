const express = require("express");
const data = require("../datadb.js");
const Product = require("../models/productModel.js");
const User = require("../models/userModel.js");

const seedRouter = express.Router();

seedRouter.get("/", async (req, res) => {
  await Product.deleteMany();
  //await User.deleteMany();
  const createdProducts = await Product.insertMany(data.products);
  //const createdUsers = await User.insertMany(data.users);
  res.send({ createdProducts });
  //res.send({ createdUsers });

  // res.send({ createdProducts, createdUsers });
});

module.exports = seedRouter;
