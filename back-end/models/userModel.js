const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    idNumber: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    cart: {
      type: [
        {
          _id: String,
          name: String,
          image: String,
          category: String,
          description: String,
          price: Number,
          countInStock: Number,
          rating: Number,
          numReviews: Number,
          createdAt: String,
          updatedAt: String,
          quantity: Number,
        },
      ],
      default: [],
    },
    cartLastUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
