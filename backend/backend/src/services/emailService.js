const nodemailer = require("nodemailer");

const sendMail = async (to, subject, htmlContent) => {
    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
    };

    return transporter.sendMail(mailOptions);
};

// ✅ Đảm bảo xuất hàm đúng
module.exports = { sendMail };
