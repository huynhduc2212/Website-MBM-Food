const mongoose = require("mongoose");

const PaymentMethodSchema = new mongoose.Schema(
  {
    payment_name: {
      type: String,
      enum: ["cash", "momo"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentMethod", PaymentMethodSchema);
