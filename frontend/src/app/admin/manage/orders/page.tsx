"use client";

import { useEffect, useState } from "react";
import orderService from "../../services/OrderServices";
import styles from "../../styles/order.module.css";
import Swal from "sweetalert2";


interface Order {
  _id: string;
  order_code: string;
  id_user: { _id: string };
  createdAt: Date;
  order_status: "Pending" | "Shipping" | "Delivered" | "Canceled";
  payment_status: "Pending" | "Completed";
  id_payment_method: { _id: string };
  details: { _id: string; id_product: { name: string }; quantity: number; price: number }[];
  total_amount: number;
}

const STATUS_FLOW: Record<Order["order_status"], Order["order_status"][]> = {
  Pending: ["Shipping"],
  Shipping: ["Delivered"],
  Delivered: [],
  Canceled: [],
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | Order["order_status"]>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, searchDate, orders]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      const updatedOrders = data

        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Sắp xếp mới nhất trước

      setOrders(updatedOrders);
    } catch (err) {
      console.error("Lỗi khi lấy đơn hàng:", err);
    } finally {
      setLoading(false);
    }
  };


  const filterOrders = () => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter((order) =>
        order.order_code.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (searchDate) {
      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.createdAt).toLocaleDateString("en-CA"); // Chuyển về YYYY-MM-DD
        console.log("orderDate:", orderDate, "searchDate:", searchDate);
        return orderDate === searchDate;
      });
    }




    if (statusFilter) {
      filtered = filtered.filter((order) => order.order_status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order["order_status"]) => {
    try {
      const order = orders.find((o) => o._id === orderId);
      if (!order) return;
  
      // Nếu đơn hàng có MoMo và chưa thanh toán, tự động hủy đơn hàng
      if (
        order.order_status === "Pending" && 
        order.payment_status !== "Completed" && 
        order.id_payment_method._id !== "67d8351376759d2abe579970" // MoMo (không phải COD)
      ) {
        newStatus = "Canceled";
      }

      const response = await orderService.updateOrderStatus(orderId, { order_status: newStatus });
      if (!response) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng!");
        return;
      }
  
      setOrders((prevOrders) =>
        prevOrders.map((order) => {
          if (order._id !== orderId) return order;
  
          // Nếu thanh toán MOMO và đã thanh toán, tự động chuyển sang "Shipping"
          if (
            order.order_status === "Pending" && 
            order.payment_status === "Completed" && 
            order.id_payment_method._id !== "67d8351376759d2abe579970" // Không phải COD
          ) {
            updateOrderStatus(order._id, "Shipping");
          }
  
          // Nếu đơn hàng chuyển sang "Delivered" và thanh toán COD, cập nhật trạng thái thanh toán
          if (newStatus === "Delivered" && order.id_payment_method._id === "67d8351376759d2abe579970") {
            return { ...order, order_status: "Delivered", payment_status: "Completed" };
          }
  
          return { ...order, order_status: newStatus };
        })
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };
  
  // Kiểm tra và cập nhật tự động khi điều kiện phù hợp
  useEffect(() => {
    orders.forEach((order) => {
      if (order.order_status === "Pending" && order.payment_status === "Completed" && order.id_payment_method._id !== "67d8351376759d2abe579970") {
        updateOrderStatus(order._id, "Shipping");
      }
      if (
        order.order_status === "Pending" &&
        order.id_payment_method._id !== "67d8351376759d2abe579970" && // MoMo
        order.payment_status !== "Completed" // Chưa thanh toán
      ) {
        updateOrderStatus(order._id, "Canceled");
      }
      if (order.order_status === "Delivered" && order.id_payment_method._id === "67d8351376759d2abe579970" && order.payment_status !== "Completed") {
        updateOrderStatus(order._id, "Delivered");
      }
    });
  }, [orders]); // Chạy khi danh sách đơn hàng thay đổi
  
  


  const handleStatusChange = async (orderId: string, currentStatus: Order["order_status"]) => {
    const nextStatus = STATUS_FLOW[currentStatus]?.[0];
    if (!nextStatus) return;

    Swal.fire({
      title: "Xác nhận chuyển trạng thái",
      text: `Bạn có muốn chuyển đơn hàng sang trạng thái "${nextStatus}" không?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Có, tiếp tục!",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#3085d6",  // Màu xanh dương
      cancelButtonColor: "#d33",  // Màu đỏ giúp dễ nhìn thấy hơn
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        updateOrderStatus(orderId, nextStatus);
        Swal.fire("Thành công!", `Trạng thái đơn hàng đã chuyển sang "${nextStatus}".`, "success");
      }
    });
  };

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <p>Loading...</p>;



  return (
    <div className={`${styles.tableContainer} mt-4` } >
      <h4 className="fw-bold fs-3 mb-3">Danh sách đơn hàng</h4>

      {/* Ô tìm kiếm và lọc trạng thái */}
      <div className="d-flex mb-3">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Tìm kiếm theo mã đơn hàng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="form-control me-2"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Order["order_status"])}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="Pending">Pending</option>
          <option value="Shipping">Shipping</option>
          <option value="Delivered">Delivered</option>
          <option value="Canceled">Canceled</option>
        </select>
      </div>

      {/* Bảng đơn hàng */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Ngày đặt hàng</th>
            <th>Sản phẩm</th>
            <th>Thành tiền</th>
            <th className="text-center">Trạng thái đơn hàng</th>
            <th className="text-center">Phương thức thanh toán</th>
            <th className="text-center">Trạng thái thanh toán</th>

          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            paginatedOrders.map((order) => (
              <tr key={order._id} className={styles.row}>
                <td>
                  <a href={`https://mbmfood.store/admin/manage/custumerList/${order.id_user._id}`}>
                    #{order.order_code}
                  </a>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {order.details.slice(0, 2).map((item) => (
                    <div key={item._id}>
                      {item.id_product.name} - {item.quantity} x {item.price.toLocaleString("vi-VN")} VND
                    </div>
                  ))}
                </td>
                <td>{order.total_amount.toLocaleString("vi-VN")} VND</td>
                <td className="text-center">
                  <button
                    className={`${styles.statusBtn} ${styles[order.order_status]}`}
                    onClick={() => handleStatusChange(order._id, order.order_status)}
                  >
                    {order.order_status}
                  </button>
                </td>
                <td className="text-center p-3">
                  <span className={order.id_payment_method._id === "67d8351376759d2abe579970" ? styles.cash : styles.momo}>
                    {order.id_payment_method._id === "67d8351376759d2abe579970" ? "💵 Cash" : "📱 Momo"}
                  </span>
                </td>
                <td className="text-center p-3">
                  <span className={`${styles.paymentStatus} ${styles[order.payment_status]}`}>
                    {order.payment_status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center">
                <p className="fw-bold text-muted">Không có đơn hàng nào!</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>


      
      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-3">
          <button
            className="btn btn-light"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            ←
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNumber = index + 1;

            if (
              pageNumber === 1 ||
              pageNumber === totalPages ||
              (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
            ) {
              return (
                <button
                  key={pageNumber}
                  className={`btn mx-1 ${currentPage === pageNumber ? "btn-primary text-white" : "btn-light"}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            }

            if (
              pageNumber === currentPage - 2 ||
              pageNumber === currentPage + 2
            ) {
              return <span key={pageNumber} className="mx-2">...</span>;
            }

            return null;
          })}

          <button
            className="btn btn-light"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}

    </div>
  );
};

export default OrderManagementPage;
