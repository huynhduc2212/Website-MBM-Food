const Order = require("../models/Order");
const OrderDetail = require("../models/OrderDetail");
// const PaymentMethod = require("../models/PaymentMethod");
const mongoose = require("mongoose");
// const Coupon = require("../models/CouponModel");
class OrderService {
  async updateOrder(orderId, updateData) {
    try {
      // Cập nhật thông tin Order
      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
      });

      if (!updatedOrder) {
        throw new Error("Không tìm thấy đơn hàng");
      }

      // Xóa OrderDetail cũ trước khi thêm dữ liệu mới
      await OrderDetail.deleteMany({ id_order: orderId });

      // Thêm OrderDetail mới từ updateData.details
      if (updateData.details && updateData.details.length > 0) {
        const orderDetails = updateData.details.map((product) => ({
          id_order: orderId,
          id_product: product.id_product,
          total_amount: product.price || product.price * product.quantity, // Tránh lỗi thiếu total
          quantity: product.quantity,
          name: product.name,
        }));

        await OrderDetail.insertMany(orderDetails);
      }

      return updatedOrder;
    } catch (error) {
      throw new Error("Lỗi khi cập nhật đơn hàng: " + error.message);
    }
  }


  async createOrder(orderData, orderDetails) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orderCode = `MBM${Date.now()}`; 
      const newOrder = new Order({
        order_code: orderCode, 
        id_user: orderData.id_user,
        id_coupon: orderData.id_coupon,
        total_amount: orderData.total_amount,
        total_payment: orderData.total_payment || orderData.total_amount,
        address: orderData.address,
        phone: orderData.phone,
        name: orderData.name,
        note: orderData.note || "",
        receive_address: orderData.receive_address,
        id_payment_method: orderData.id_payment_method,
        payment_status: orderData.payment_status || "Pending",
        order_status: orderData.order_status || "Pending",
      });
      const savedOrder = await newOrder.save({ session });

      const orderDetailPromises = orderDetails.map((detail) => {
        const newOrderDetail = new OrderDetail({
          id_order: savedOrder._id,
          id_product: detail.id_product,
          price: detail.price,
          quantity: detail.quantity,
          name: detail.name,
        });
        return newOrderDetail.save({ session });
      });

      const savedOrderDetails = await Promise.all(orderDetailPromises);

      await session.commitTransaction();
      session.endSession();

      return {
        order: savedOrder,
        orderDetails: savedOrderDetails,
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new Error(`Lỗi khi tạo đơn hàng: ${error.message}`);
    }
  }

  async getAllOrders() {
    const orders = await Order.find()
      .populate("id_user", "name")
      .populate("id_payment_method", "name")
      .lean();

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const details = await OrderDetail.find({ id_order: order._id })
          .populate("id_product", "name price")
          .lean();
        return { ...order, details }; // Gán `details` vào mỗi order
      })
    );

    return ordersWithDetails;
  }

  async getOrderByOrderCode(orderCode) {
    try {
      const order = await Order.findOne({ order_code: orderCode })
        .populate("id_user", "name email")
        .populate("id_payment_method", "name")
        .lean();
  
      if (!order) return null;
  
      order.details = await OrderDetail.find({ id_order: order._id }).populate({
        path: "id_product",
        select: "name variants.price",
      }).lean();
  
      return order;
    } catch (error) {
      throw new Error(`Lỗi khi lấy đơn hàng: ${error.message}`);
    }
  }
  

  async getOrderById(orderId) {
    const order = await Order.findById(orderId)
      .populate("id_user", "name email")
      .populate("id_payment_method", "name")
      .lean();
    if (!order) return null;

    order.details = await OrderDetail.find({ id_order: order._id }).populate({
      path: "id_product",
      select: "name variants.price",
      model: "product", // Đảm bảo model đúng
    });
    return order;
  }



  async updateOrderStatus(id, order_status) {
    if (!["Pending", "Shipped", "Delivered", "Canceled"].includes(order_status)) {
        throw new Error("Trạng thái không hợp lệ");
    }

    // Lấy đơn hàng hiện tại
    const order = await Order.findById(id);
    if (!order) {
        throw new Error("Không tìm thấy đơn hàng");
    }

    // Cập nhật trạng thái đơn hàng
    let updateData = { order_status };

    // Nếu trạng thái mới là "Delivered" và phương thức thanh toán là "67d8351376759d2abe579970"
    if (order_status === "Delivered" && order.id_payment_method.toString() === "67d8351376759d2abe579970") {
        updateData.payment_status = "Completed";
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

    return updatedOrder;
}


  async deleteOrder(orderId) {
    const order = await Order.findByIdAndDelete(orderId);
    if (order) {
      await OrderDetail.deleteMany({ id_order: orderId });
    }
    return order;
  }
  async getOrdersByUserId(userId) {
    try {
      const orders = await Order.find({ id_user: userId })
        .populate("id_user", "username email")

        .populate("id_payment_method", "method")
        .sort({ createdAt: -1 });

      const orderIds = orders.map((order) => order._id);
      const orderDetails = await OrderDetail.find({
        id_order: { $in: orderIds },
      }).populate("id_product", "name price");

      return { orders, orderDetails };
    } catch (error) {
      throw new Error("Lỗi khi lấy đơn hàng của user: " + error.message);
    }
  }

  async updateOrderTime(orderId, newCreatedAt) {
    try {
        console.log("🔄 Đang cập nhật thời gian cho đơn hàng:", orderId);
        console.log("📅 Thời gian mới:", newCreatedAt);

        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { $set: { createdAt: new Date(newCreatedAt) } }, // 🔥 Bắt buộc dùng $set để update
          { new: true, timestamps: false } // ⛔ Tắt timestamps để tránh bị ghi đè
      );
      

        console.log("✅ Đơn hàng sau khi cập nhật:", updatedOrder);

        if (!updatedOrder) {
            throw new Error("Không tìm thấy đơn hàng");
        }

        return updatedOrder;
    } catch (error) {
        throw new Error("Lỗi khi cập nhật thời gian đơn hàng: " + error.message);
    }
}

}

module.exports = new OrderService();
