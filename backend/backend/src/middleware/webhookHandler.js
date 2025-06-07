const Transaction = require("../models/Transaction");

exports.processWebhook = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const transaction = await Transaction.findOne({ orderId });
        if (!transaction) return res.status(404).json({ message: "Transaction not found" });
        transaction.status = status;
        await transaction.save();
        res.status(200).json({ message: "Webhook processed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};