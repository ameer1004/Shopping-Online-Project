const bcryptjs = require("bcryptjs");
const express = require("express");
const User = require("../models/userModel.js");
const expressAsyncHandler = require("express-async-handler");
const { generateToken, isAuth } = require("../utils.js");
const Order = require("../models/orderModel.js");

const userRouter = express.Router();

// localhost:3000/check-id/204356345
//req.params.id = '204356345'
userRouter.get("/check-id/:id", async (req, res) => {
  console.log("check id");
  const users = await User.find({ idNumber: req.params.id });
  console.log(users);
  if (users.length) {
    res.json({ available: false });
  } else {
    res.json({ available: true });
  }
});

userRouter.post(
  "/login",
  expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send({ err: "make sure you entered all info" });
    }
    const user = await User.findOne({ email });
    console.log({ user });
    if (!user) {
      return res.status(401).send({ message: "Email not found" });
    }
    const checkPasswordValidation = bcryptjs.compareSync(
      password,
      user.password
    );
    console.log({ checkPasswordValidation });
    if (!checkPasswordValidation) {
      return res.status(401).send({ message: "Password incorrect" });
    }
    const loggedInUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email,
      isAdmin: user.isAdmin,
      city: user.city,
      address: user.address,
      cart: user.cart,
    };
    res.cookie("jwt", generateToken(user), {
      httpOnly: true,
      max: 1000 * 60 * 60 * 24 * 30,
    });

    req.session.user = loggedInUser;
    res.send(loggedInUser);
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const { idNumber, firstName, lastName, email, password, city, address } =
      req.body;

    if (
      !idNumber ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !city ||
      !address
    ) {
      return res.status(400).send({ err: "make sure you enterd all info" });
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log("user already exist");
        return res.status(403).json({ message: "Email is already taken" });
      }
      const newUser = new User({
        idNumber,
        firstName,
        lastName,
        email,
        password: bcryptjs.hashSync(password),
        city,
        address,
      });
      await newUser.save();
      const registerUser = {
        _id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        city: newUser.city,
        address: newUser.address,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      };
      req.session.user = registerUser;
      res.json(registerUser);
    } catch (error) {
      console.log(error);
      res.status(403).send({ error });
    }
  })
);

userRouter.put(
  "/updateprofile",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, password, confirmPassword } = req.body;
      if (password !== confirmPassword)
        return res.status(403).json({ message: "Password must match!" });

      const hashedPassword = bcryptjs.hashSync(password, 8);
      const user = await User.findById({ _id: req.user._id });
      user.name = name || user.name;
      user.email = email || user.email;
      user.password = hashedPassword;
      const newUser = await user.save();

      res.cookie("jwt", generateToken(newUser), {
        httpOnly: true,
        max: 1000 * 60 * 60 * 24 * 30,
      });
      res.send({
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
      });
    } catch (error) {
      res.status(403).send({ message: "User not found" });
    }
  })
);
userRouter.delete("/logout", (req, res) => {
  req.session.destroy();
  res.send({ msg: "bye bye" });
});

userRouter.post(
  "/cart/:userId",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const cart = req.body;
    const user = await User.findById(userId);
    user.cart = cart;
    user.cartLastUpdate = new Date();
    await user.save();
    res.status(200).json({ message: "cart saved" });
  })
);

userRouter.get(
  "/notification/:userId",
  expressAsyncHandler(async (req, res) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user.cart.length && user.cartLastUpdate) {
      return res.json({
        message: `Welcome back, you have a cart from date: ${user.cartLastUpdate.toLocaleDateString(
          "en-GB"
        )}`,
      });
    }

    const orders = await Order.find({ user: userId });
    if (orders.length) {
      const date = orders.at(-1).createdAt.toLocaleDateString("en-GB");
      return res.json({
        message: `Welcome back, last order was done on date: ${date}`,
      });
    }

    res.json({ message: "Welcome back" });
  })
);
module.exports = userRouter;
