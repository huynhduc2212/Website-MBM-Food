"use client";
import { useEffect, useState } from "react";
import orderService from "../../admin/services/OrderServices";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";

export default function AddressTable() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
    const [expandedOrders, setExpandedOrders] = useState<string | null>(null); // 🔥 Kiểm soát trạng thái mở rộng đơn hàng
    const [currentPage, setCurrentPage] = useState(1); // 🔥 Trang hiện tại
    const ordersPerPage = 5; // 🔥 Số đơn hàng trên mỗi trang

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (!userId) {
            setLoading(false);
            return;
        }
        fetchOrders(userId);
    }, []);

    const fetchOrders = async (userId: string) => {
        try {
            const data = await orderService.getOrdersByUserId(userId);
            const ordersWithDetails = data.orders.map((order: any) => ({
                ...order,
                details: data.orderDetails.filter((detail: any) => detail.id_order === order._id) || [],
            }));
            setOrders(ordersWithDetails);
        } catch (err) {
            console.error("Lỗi khi lấy đơn hàng:", err);
        } finally {
            setLoading(false);
        }
    };

    const cancelOrder = async (orderId: string) => {
        const result = await Swal.fire({
            title: "Bạn có chắc chắn muốn hủy đơn hàng này?",
            text: "Hành động này không thể hoàn tác!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Có, hủy đơn!",
            cancelButtonText: "Không",
        });

        if (!result.isConfirmed) return;

        try {
            await orderService.updateOrderStatus(orderId, { order_status: "Canceled" });
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === orderId ? { ...order, order_status: "Canceled" } : order
                )
            );
            Swal.fire("Đã hủy!", "Đơn hàng của bạn đã được hủy.", "success");
        } catch (error) {
            console.error("Lỗi khi hủy đơn hàng:", error);
            Swal.fire("Lỗi!", "Có lỗi xảy ra, vui lòng thử lại.", "error");
        }
    };

    const sortedOrders = [...orders].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;
        const orderA = a[key];
        const orderB = b[key];

        if (orderA < orderB) return direction === "asc" ? -1 : 1;
        if (orderA > orderB) return direction === "asc" ? 1 : -1;
        return 0;
    });

    const requestSort = (key: string) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // 🔥 Tính toán dữ liệu phân trang
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(orders.length / ordersPerPage);

    if (loading) return <p>Loading...</p>;
    if (!orders.length) return <p>Không tìm thấy đơn hàng nào!</p>;

    return (
        <div className="container mt-4">
            <h5 className="mb-3">📦 ĐƠN HÀNG CỦA BẠN</h5>
            <table className="table table-striped table-bordered text-center ">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => requestSort("order_code")} style={{ cursor: "pointer" }}>Mã đơn hàng 🔽</th>
                        <th>Ngày đặt hàng</th>
                        <th>Khách hàng</th>
                        <th onClick={() => requestSort("order_status")} style={{ cursor: "pointer" }}>Trạng thái 🔽</th>
                        <th onClick={() => requestSort("total_amount")} style={{ cursor: "pointer" }}>Tổng tiền 🔽</th>
                        <th>Chi tiết đơn hàng</th>
                        <th>Hủy đơn(only Pending)</th>
                    </tr>
                </thead>
                <tbody>
                    {currentOrders.map((order) => (
                        <tr key={order._id}>
                            <td>{order.order_code || "N/A"}</td>
                            <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
                            <td>
                                {order.name} <br />
                                📧 {order.id_user?.email} <br />
                                📞 {order.phone}
                            </td>
                            <td>
                                <span className={`badge ${order.order_status === "Pending" ? "bg-warning" : order.order_status === "Shipped" ? "bg-primary" : order.order_status === "Delivered" ? "bg-success" : "bg-danger"}`}>
                                    {order.order_status}
                                </span>
                            </td>
                            <td>{order.total_amount?.toLocaleString("vi-VN")} VND</td>
                            <td>
                                {order.details.slice(0, expandedOrders === order._id ? order.details.length : 2).map((item: any, index: any) => (
                                    <div key={index} className="text-start">
                                        <strong>{item.id_product?.name || "Sản phẩm không xác định"}</strong>
                                        <br />
                                        Số lượng: {item.quantity} - Giá: {item.price?.toLocaleString("vi-VN")} VND
                                    </div>
                                ))}
                                {order.details.length > 2 && (
                                    <button
                                        className="btn btn-sm btn-info mt-2"
                                        onClick={() => setExpandedOrders(expandedOrders === order._id ? null : order._id)}
                                    >
                                        {expandedOrders === order._id ? "Thu gọn" : "Xem thêm"}
                                    </button>
                                )}
                            </td>
                            <td>
                                {order.order_status === "Pending" && (
                                    <button className="btn btn-danger btn-sm" onClick={() => cancelOrder(order._id)}>
                                        Hủy đơn
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔥 Thanh phân trang */}
            <div className="d-flex justify-content-center mt-3">
                <button
                    className="btn btn-light border-0 shadow-none mx-1"
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
                                className={`btn mx-1 border-0 shadow-none ${currentPage === pageNumber ? "btn-primary text-white" : "btn-light"
                                    }`}
                                onClick={() => setCurrentPage(pageNumber)}
                            >
                                {pageNumber}
                            </button>
                        );
                    }

                    if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                        return <span key={pageNumber} className="mx-2">...</span>;
                    }

                    return null;
                })}

                <button
                    className="btn btn-light border-0 shadow-none mx-1"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    →
                </button>
            </div>

        </div>
    );
}
