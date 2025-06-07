const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    position: { type: String},
    status: {
      type: String,
      enum: ["Available", "Reserved"],
      default: "Available",
    },
    name: { type: String, required: true },
    image:{ type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
