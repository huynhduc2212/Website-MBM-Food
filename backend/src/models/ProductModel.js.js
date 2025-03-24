const mongoose = require("mongoose");
const generateSlug = require("../middleware/slugMiddleware");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    idcate: { type: ObjectId, ref: "category" },
    description: { type: String },
    variants: [
      {
        option: { type: String },
        price: { type: Number, required: true },
        sale_price: { type: Number, default: 0 },
        image: { type: String, required: true },
      },
    ],
    hot: { type: Number, default: 0 },
    view: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Unactive"], default: "Active" },
    flag: { type: Boolean, default: true },
  },

  { timestamps: true }
);

productSchema.pre("save", generateSlug);

module.exports = mongoose.model("product", productSchema);
