const { sendEmail } = require("../services/emailCustomerServices");

const sendEmailController = async (req, res) => {
    try {
        await sendEmail(req.body);
        res.status(200).json({ success: true, message: "Email đã được gửi thành công!" });
    } catch (error) {
        res.status(500).json({ error: error.message || "Gửi email thất bại, vui lòng thử lại!" });
    }
};

module.exports = { sendEmailController };
