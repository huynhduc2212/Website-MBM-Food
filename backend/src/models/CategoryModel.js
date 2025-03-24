const mongoose = require("mongoose");
const generateSlug = require("../middleware/slugMiddleware");
const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    name: { type: String, required: true },
    image: { type: String},
    slug: { type: String, unique: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

categorySchema.pre("save", generateSlug);


module.exports = mongoose.model("category", categorySchema);
