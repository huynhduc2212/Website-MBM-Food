const mongoose = require("mongoose");
const { updatedStatus, typeUpdate } = require("../middleware/couponMiddleware");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    type: { type: String, enum: ["Amount", "Shipping"], required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["Active", "Expired", "Used_up"],
      default: "Active",
    },
    quantity: { type: Number, required: true, min: 0 },
    description: { type: String },
  },
  { timestamps: true }
);

couponSchema.pre('save', updatedStatus);
couponSchema.pre(['updateOne', 'findOneAndUpdate', 'updateMany'], typeUpdate);

module.exports = mongoose.model("coupon", couponSchema);
