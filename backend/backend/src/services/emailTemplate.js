const generateEmailTemplate = (orderData) => {
    if (!orderData || !Array.isArray(orderData.orderDetails)) {
        console.error("❌ orderDetails không hợp lệ:", orderData.orderDetails);
        throw new Error("Dữ liệu orderDetails không hợp lệ!");
    }

    return `
        <div style="max-width: 600px; margin: 20px auto; font-family: Arial, sans-serif; border: 2px solid #016a30; border-radius: 8px; overflow: hidden;">
            <div style="background: #016a30; color: white; text-align: center; padding: 15px;">
                <h1 style="margin: 0; font-size: 24px;">HÓA ĐƠN ĐẶT HÀNG</h1>
            </div>
            <div style="padding: 20px; background: #f9f9f9;">
                <p style="font-size: 16px; margin: 5px 0;"><strong>Mã đơn hàng:</strong> ${orderData.order_code}</p>
                <p style="font-size: 16px; margin: 5px 0;"><strong>Tên khách hàng:</strong> ${orderData.name}</p>
                <p style="font-size: 16px; margin: 5px 0;"><strong>Địa chỉ nhận hàng:</strong> ${orderData.receive_address}</p>
                <p style="font-size: 16px; margin: 5px 0;"><strong>Số điện thoại:</strong> ${orderData.phone}</p>
                <p style="font-size: 16px; margin: 5px 0;"><strong>Tổng tiền:</strong> <span style="color: #d9534f; font-weight: bold;">${orderData.total_payment.toLocaleString()} VND</span></p>

                <h2 style="color: #016a30; border-bottom: 2px solid #016a30; padding-bottom: 5px;">Chi tiết đơn hàng</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                    <thead>
                        <tr style="background: #016a30; color: white;">
                            <th style="padding: 10px; text-align: left;">Sản phẩm</th>
                            <th style="padding: 10px; text-align: center;">Số lượng</th>
                            <th style="padding: 10px; text-align: right;">Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderData.orderDetails.map(item => `
                        <tr style="background: #fff;">
                            <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
                            <td style="padding: 10px; text-align: center; border-bottom: 1px solid #ddd;">${item.quantity}</td>
                            <td style="padding: 10px; text-align: right; border-bottom: 1px solid #ddd; font-weight: bold;">${item.price.toLocaleString()} VND</td>
                        </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
            <div style="background: #016a30; color: white; text-align: center; padding: 10px;">
                <p style="margin: 0;">Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!</p>
            </div>
        </div>
    `;
};

module.exports = { generateEmailTemplate };
