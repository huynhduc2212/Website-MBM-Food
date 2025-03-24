const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_code: { type: String, unique: true, required: true },
    id_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    id_coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    total_amount: { type: Number, required: true },
    total_payment: { type: Number, required: false },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    name: { type: String, required: true },
    note: { type: String, default: "" },
    receive_address: { type: String, required: true },
    id_payment_method: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      required: true,
    },
    order_status: {
      type: String,
      enum: ["Pending", "Shipping", "Delivered", "Canceled"],
      default: "Pending",
    },
    payment_status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    createdAt: { type: Date, default: Date.now }, // Cho phép ghi đè
  },
  {
    timestamps: { createdAt: true, updatedAt: true }, // Vẫn giữ timestamps để có updatedAt
  }
);

module.exports = mongoose.model("Order", orderSchema);
