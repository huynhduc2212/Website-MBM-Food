const { sendMail } = require("../services/emailService"); // ✅ Kiểm tra lại đường dẫn
const { generateEmailTemplate } = require("../services/emailTemplate");

const sendMailController = async (req, res) => {
    try {
        const { email, orderData } = req.body;

        if (!email || !orderData) {
            return res.status(400).json({ message: "Thiếu email hoặc dữ liệu đơn hàng" });
        }

        const emailContent = generateEmailTemplate(orderData);

        await sendMail(email, "Xác nhận đơn hàng", emailContent);

        res.status(200).json({ message: "Email đã được gửi thành công" });
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
        res.status(500).json({ message: "Lỗi khi gửi email" });
    }
};

module.exports = { sendMailController };
