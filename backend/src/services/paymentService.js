const PaymentMethod = require('../models/PaymentMethod');

// Lấy danh sách phương thức thanh toán
const getAllPaymentMethods = async () => {
    return await PaymentMethod.find();
};

// Thêm phương thức thanh toán mới
const createPaymentMethod = async (data) =>{
    return await PaymentMethod.create(data);
}

// Cập nhật phương thức thanh toán
const updatePaymentMethod = async (id, data) => {
    return await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
}

// Xóa phương thức thanh toán
const deletePaymentMethod = async (id) => {
    return await PaymentMethod.findByIdAndDelete(id);
}
const updatePaymentStatus = async (paymentId, status) => {
    return await PaymentMethod.findByIdAndUpdate(
        paymentId,
        { status },
        { new: true }
    );
};
const getPaymentMethodById = async (id) => {
    const payment = await PaymentMethod.findById(id);
    if (!payment) throw new Error('Không tìm thấy phương thức thanh toán');
    return payment;
};
module.exports =  {
    getAllPaymentMethods,
    createPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    updatePaymentStatus,
    getPaymentMethodById
};
