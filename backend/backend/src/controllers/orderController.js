const OrderService = require("../services/orderService");

class OrderController {
   async createOrder  (req, res) {
    try {
      const { orderData, orderDetails } = req.body;
      
      if (!orderData || !orderData.id_user || !orderData.total_amount || 
          !orderData.address || !orderData.phone || 
          !orderData.name || !orderData.receive_address) {
        return res.status(400).json({
          success: false,
          message: 'Thiếu thông tin đơn hàng bắt buộc'
        });
      }
  
      if (!orderDetails || !Array.isArray(orderDetails) || orderDetails.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Cần có ít nhất một sản phẩm trong đơn hàng'
        });
      }

      for (const detail of orderDetails) {
        if (!detail.id_product || !detail.price || !detail.quantity || !detail.name) {
          return res.status(400).json({
            success: false,
            message: 'Thiếu thông tin chi tiết đơn hàng bắt buộc'
          });
        }
      }
  
      const result = await OrderService.createOrder(orderData, orderDetails);
  
      return res.status(201).json({
        success: true,
        message: 'Tạo đơn hàng thành công',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Lỗi khi tạo đơn hàng: ${error.message}`
      });
    }
  };
  async getTopSellingProducts(req, res) {
    try {
      const topProducts = await OrderService.getTop5SellingProducts();
      res.status(200).json(topProducts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateOrder(req, res) {
    try {
      console.log("Dữ liệu nhận từ client:", req.body);

      const { orderId } = req.params;
      const updateData = req.body;

      // Kiểm tra xem details có dữ liệu không
      if (!updateData.details || updateData.details.length === 0) {
        return res
          .status(400)
          .json({ message: "Danh sách sản phẩm không được để trống!" });
      }

      console.log("Danh sách sản phẩm gửi lên:", updateData.details);

      const updatedOrder = await OrderService.updateOrder(orderId, updateData);
      console.log("Dữ liệu sau khi cập nhật:", updatedOrder);

      res.status(200).json(updatedOrder);
    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
      res.status(400).json({ message: error.message });
    }
  }

  async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAllOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const order = await OrderService.getOrderById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json(order);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getOrderByOrderCode(req, res) {
    try {
      const { orderCode } = req.params;
  
      const order = await OrderService.getOrderByOrderCode(orderCode);
  
      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy đơn hàng với mã đơn hàng này",
        });
      }
  
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Lỗi khi lấy đơn hàng: ${error.message}`,
      });
    }
  }
  
  

  async updateOrderStatus(req, res) {
    try {
      const { id } = req.params;
      const { order_status } = req.body;

      const updatedOrder = await OrderService.updateOrderStatus(id, order_status);

      res.status(200).json(updatedOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async deleteOrder(req, res) {
    try {
      const order = await OrderService.deleteOrder(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async getOrdersByUserId(req, res) {
    try {
      const { userId } = req.params;
      const data = await OrderService.getOrdersByUserId(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async updateOrderTime(req, res) {
    try {
        const { createdAt } = req.body;
        const { orderId } = req.params;

        console.log("📩 Dữ liệu nhận từ client:", createdAt);

        if (!createdAt) {
            return res.status(400).json({ error: "Thiếu giá trị createdAt" });
        }

        const updatedOrder = await OrderService.updateOrderTime(orderId, createdAt);

        res.json({ message: "Cập nhật thành công!", updatedOrder });
    } catch (error) {
        console.error("❌ Lỗi khi cập nhật thời gian:", error);
        res.status(500).json({ error: error.message });
    }
}

}

module.exports = new OrderController();
