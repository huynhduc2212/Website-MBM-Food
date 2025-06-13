const nodemailer = require("nodemailer");

const sendEmail = async ({ name, email, phone, message }) => {
    try {
        if (!phone || !message) {
            throw new Error("Số điện thoại và nội dung không được để trống!");
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            debug: true,  // Bật debug để xem log
            logger: true  // Ghi log chi tiết
        });
        

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Xác nhận yêu cầu hỗ trợ từ MBM",
            html: `
                <div style="background-color: #f4f4f4; padding: 20px;">
                    <table width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
                        <!-- Header -->
                        
                        <!-- Nội dung -->
                        <tr>
                            <td style="padding: 20px; font-family: Arial, sans-serif; color: #333333;">
                                <h2 style="text-align: center; color: #006a31;">Xác nhận yêu cầu hỗ trợ</h2>
                                <p>Xin chào <strong>${name}</strong>,</p>
                                <p>Cảm ơn bạn đã liên hệ với <strong>MBM</strong>. Chúng tôi đã nhận được yêu cầu của bạn:</p>
                                <p><strong>Số điện thoại:</strong> ${phone}</p>
                                <p style="background-color: #f8f9fa; padding: 10px; border-radius: 5px; border-left: 4px solid #006a31;">
                                    <strong>Nội dung:</strong> ${message}
                                </p>
                                <p>Chúng tôi sẽ phản hồi bạn trong thời gian sớm nhất.</p>
                                <p>Trân trọng,</p>
                                <p><strong>Đội ngũ hỗ trợ MBM</strong></p>
                            </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                            <td align="center" style="padding: 15px; font-size: 12px; color: #777;">
                                <p>&copy; 2024 MBM. Mọi quyền được bảo lưu.</p>
                            </td>
                        </tr>
                    </table>
                </div>
            `,
        };        

        await transporter.sendMail(mailOptions);
        console.log("Email đã gửi thành công");
    } catch (error) {
        console.error("Lỗi gửi email: ", error.message);
        throw new Error("Lỗi gửi email: " + error.message);
    }
};


module.exports = { sendEmail };
