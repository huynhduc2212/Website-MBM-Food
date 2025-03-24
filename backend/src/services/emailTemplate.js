const generateEmailTemplate = (orderData) => {
    return `
    <html>
    <head>
        <style>
            .container { font-family: Arial, sans-serif; padding: 20px; }
            .header { background-color: #4CAF50; color: white; text-align: center; padding: 10px; font-size: 24px; }
            .content { margin-top: 20px; }
            .order-details { border-collapse: collapse; width: 100%; }
            .order-details th, .order-details td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .footer { margin-top: 20px; font-size: 14px; text-align: center; color: #555; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Xác nhận đơn hàng</div>
            <div class="content">
                <p>Chào ${orderData.name},</p>
                <p>Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi. Dưới đây là chi tiết đơn hàng của bạn:</p>
                <p><strong>Mã đơn hàng:</strong> ${orderData.order_code}</p>
                <table class="order-details">
                    <tr>
                        <th>Tên sản phẩm</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                    </tr>
                    ${orderData.products.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price.toLocaleString()}đ</td>
                        </tr>
                    `).join('')}
                </table>
                <p><strong>Mã giảm giá:</strong> ${orderData.discount_code ? orderData.discount_code : "Không áp dụng"}</p>
                <p><strong>Giảm giá : ${orderData.discount_value.toLocaleString()}đ</strong></p>
                <p><strong>Tổng tiền đơn hàng:</strong> ${orderData.total_amount.toLocaleString()}đ</p>
                <p><strong>Tổng tiền thanh toán:</strong> ${orderData.total_payment.toLocaleString()}đ</p>
                <p><strong>Địa chỉ giao hàng:</strong> ${orderData.receive_address}</p>
            </div>
            <div class="footer">Cảm ơn bạn đã đặt hàng! Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</div>
        </div>
    </body>
    </html>`;
};

module.exports = { generateEmailTemplate };
