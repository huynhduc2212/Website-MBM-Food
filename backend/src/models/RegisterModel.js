const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const registerSchema = new Schema(
  {
    id_user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id_table: { type: Schema.Types.ObjectId, ref: "Table", required: true },
    start_time: { type: String, required: true },
    create_at: { type: Date, required: true },
    status: { type: String, required: true, enum: ["Confirmed","Completed", "Cancelled"], default: "Confirmed" },
  }
);

module.exports = mongoose.model("Register", registerSchema);
