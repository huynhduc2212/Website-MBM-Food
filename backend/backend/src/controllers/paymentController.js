const paymentMethodService = require('../services/paymentService');
const axios = require("axios");
const crypto = require("crypto");
const PaymentMethod = require("../models/PaymentMethod");
const Order = require("../models/Order");


const MOMO_PARTNER_CODE = "MOMO"; 
const MOMO_ACCESS_KEY = "F8BBA842ECF85"; 
const MOMO_SECRET_KEY = "K951B6PE1waDMi640xX08PD3vg6EkVlz"; 
const MOMO_ENDPOINT = "https://test-payment.momo.vn/v2/gateway/api/create";
const RETURN_URL = "http://localhost:3002/result";
// const RETURN_URL = "https://mbmfood.store/result";

const NOTIFY_URL = "http://localhost:3001/api/payment/momo/callback"; // URL backend nhận callback
// const NOTIFY_URL = "https://mbmfood.store/api/payment/momo/callback"; // URL backend nhận callback

// Tạo thanh toán Momo
const createMomoPayment = async (req, res) => {
    try {
        console.log("--- Bắt đầu xử lý thanh toán Momo ---"); // Log start
        console.log("Dữ liệu nhận được từ frontend:", req.body); // Log request body
        const { order_code, amount} = req.body;

        if (!order_code || !amount) {
            console.log("Lỗi: Thiếu order_code hoặc amount"); // Log missing params
            return res.status(400).json({ message: "Thiếu order_code hoặc amount" });
        }
        
        // Tạo raw signature
        const requestId = `${order_code}_${Date.now()}`;
        const orderInfo = `Thanh toán đơn hàng #${order_code}`;
        const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=&ipnUrl=${NOTIFY_URL}&orderId=${order_code}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${RETURN_URL}&requestId=${requestId}&requestType=captureWallet`;
        console.log("Raw signature:", rawSignature); 
        const signature = crypto.createHmac("sha256", MOMO_SECRET_KEY).update(rawSignature).digest("hex");
        console.log("Generated signature:", signature); 

        const paymentData = {
            partnerCode: MOMO_PARTNER_CODE,
            requestId,
            amount,
            orderId: order_code,
            orderInfo,
            redirectUrl: RETURN_URL,
            ipnUrl: NOTIFY_URL,
            extraData: "",
            requestType: "captureWallet",
            signature,
             
            lang: "vi"
        };
        console.log("Payment data to Momo:", paymentData); // Log payment data

        // Gửi yêu cầu thanh toán đến Momo
        const response = await axios.post(MOMO_ENDPOINT, paymentData);
        console.log("Momo API response:", response.data); // Log Momo API response
        return res.json({ payUrl: response.data.payUrl });

    } catch (error) {
        console.error("Lỗi khi tạo thanh toán Momo:", error); 
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// Xử lý callback từ Momo
const momoCallback = async (req, res) => {
    try {
        const { orderId, resultCode } = req.body;

        if (resultCode === 0) {
            // Cập nhật trạng thái thanh toán trong bảng Order
            const updateResult = await Order.updateOne(
                { order_code: orderId },
                { payment_status: "Completed" }
            );

            console.log(`✅ Thanh toán Momo thành công cho đơn hàng ${orderId}`);
            console.log("Cập nhật payment_status:", updateResult);

            if (updateResult.matchedCount === 0) {
                console.warn(`⚠️ Không tìm thấy đơn hàng với order_code: ${orderId}`);
            }

        } else {
            console.log(`❌ Thanh toán Momo thất bại cho đơn hàng ${orderId}`);
        }

        res.status(200).json({ message: "Callback received" });

    } catch (error) {
        console.error("Lỗi xử lý callback Momo:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};


// Lấy danh sách phương thức thanh toán
const getAll = async (req, res) => {
    try {
        const payments = await paymentMethodService.getAllPaymentMethods();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm phương thức thanh toán
const createPaymentMethod = async(req, res) =>{
    try {
        const method = await paymentMethodService.createPaymentMethod(req.body);
        res.status(201).json(method);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// update phương thức thanh toán : 
const updatePaymentMethod = async (req, res) => {
    try {
        const updatedMethod = await paymentMethodService.updatePaymentMethod(req.params.id, req.body);
        if (!updatedMethod) return res.status(404).json({ message: "Payment method not found" });
        res.status(200).json(updatedMethod);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
// xóa phương thức thanh toán:
const deletePaymentMethod = async (req, res) => {
    try {
        const deletedMethod = await paymentMethodService.deletePaymentMethod(req.params.id);
        if (!deletedMethod) return res.status(404).json({ message: "Payment method not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getAll , createMomoPayment, momoCallback , createPaymentMethod, updatePaymentMethod, deletePaymentMethod };
