const mongoose = require("mongoose");

const EmailSchema = new mongoose.Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Email", EmailSchema);
