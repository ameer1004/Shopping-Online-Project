const express = require("express");
const expressAsyncHandler = require("express-async-handler");
const Order = require("../models/orderModel.js");

const orderRouter = express.Router();

orderRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    //expressAsyncHandler: simple middleware for handling exceptions inside of async express routes and passing them to my express error handlers
    if (!req.session.user) {
      throw new Error("user not on session");
    }
    const query = { shippingDate: req.body.shippingDate };
    const countDates = await Order.countDocuments(query);

    if (countDates >= 3) {
      res.json({ success: false, message: "date not available" });
      return;
    }

    const newOrder = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
      shippingDate: req.body.shippingDate,
      user: req.session.user._id,
    });
    const order = await newOrder.save();
    res
      .status(201)
      .send({ success: true, message: "קניתך בוצעה בהצלחה", order });
  })
);

module.exports = orderRouter;
