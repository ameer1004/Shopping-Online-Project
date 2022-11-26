const express = require("express");
const Product = require("../models/productModel.js");
const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");
const productRouter = express.Router();

//Get all products
productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

productRouter.get(
  "/search/:searchValue",
  expressAsyncHandler(async (req, res) => {
    const { searchValue } = req.params;
    const productsBySearch = await Product.find({
      name: { $regex: searchValue, $options: "i" },
    });
    res.json(productsBySearch);
  })
);

productRouter.get(
  "/categories",
  expressAsyncHandler(async (req, res) => {
    const categories = await Product.find().distinct("category");
    res.json(categories);
  })
);

productRouter.get(
  "/category/:categoryName",
  expressAsyncHandler(async (req, res) => {
    const { categoryName } = req.params;
    const productsByCategory = await Product.find({ category: categoryName });
    res.json(productsByCategory);
  })
);
productRouter.get(
  "/notification",
  expressAsyncHandler(async (req, res) => {
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    return res.json({
      message: `Available products in our store: ${productCount}

Total orders submitted in our store: ${orderCount}
      `,
    });
  })
);
//Get product by ID
productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(404).json({ message: "Invalid product ID" });
  const product = await Product.findById(id);
  if (!product) return res.status(404).send({ message: "Product not found" });
  res.send(product);
});

productRouter.put(
  "/",
  expressAsyncHandler(async (req, res) => {
    const product = req.body;

    const existingproduct = await Product.findByIdAndUpdate(
      product._id,
      product
    );
    if (!existingproduct) {
      return res.status(404).send({ message: "Product not found" });
    } else {
      res.send(product);
    }
  })
);

productRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const {
      name,
      image,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    } = req.body;
    const newProduct = new Product({
      name,
      image,
      category,
      description,
      price,
      countInStock,
      rating,
      numReviews,
    });
    await newProduct.save();
    const addedProduct = {
      name: newProduct.name,
      image: newProduct.image,
      category: newProduct.category,
      description: newProduct.description,
      price: newProduct.price,
      countInStock: newProduct.countInStock,
      rating: newProduct.rating,
      numReviews: newProduct.numReviews,
    };
    res.json(addedProduct);
  })
);
module.exports = productRouter;
