const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tableSchema = new Schema(
  {
    position: { type: String, required: true },
    status: {
      type: String,
      enum: ["Available", "Reserved"],
      default: "Available",
    },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Table", tableSchema);
