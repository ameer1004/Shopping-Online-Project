const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
      },
    ],
    shippingAddress: { type: String, required: true },
    shippingDate: { type: Date, required: true },
    paymentMethod: { type: String, required: true },
    totalPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // paymentResult: {
    //   id: String,
    //   status: String,
    //   update_time: String,
    //   email_address: String,
    // },
    // isPaid: { type: Boolean, default: false },
    // paidAt: { type: Date },
    // isDelivered: { type: Boolean, default: false },
    // deliveredAt: { type: Date },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
