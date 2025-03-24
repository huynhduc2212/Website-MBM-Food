const { sendEmail } = require("../services/emailService");
const { generateEmailTemplate } = require("../services/emailTemplate");

const sendMailController = async (req, res) => {
    try {
        const { email, orderData } = req.body;

        // Tạo template HTML từ orderData
        const htmlContent = generateEmailTemplate(orderData);

        // Gửi email
        await sendEmail(email, "Xác nhận đơn hàng", htmlContent);

        res.status(200).json({ success: true, message: "Email sent successfully" });
    } catch (error) {
        console.error("⚠️ Error sending email:", error);
        res.status(500).json({ success: false, message: "Failed to send email", error: error.message });
    }
};

module.exports = { sendMailController };
