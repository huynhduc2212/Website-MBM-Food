"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import userService from "../../../services/UserService";
import orderService from "../../../services/OrderServices";
import styles from "../../../styles/DetailUser.module.css";

interface User {
    _id: string;
    username: string;
    email: string;
    phone: string;
    avatar?: string;
}

interface OrderDetail {
    _id: string;
    id_order: string;
    id_product: {
        name: string;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    order_code: string;
    createdAt: string;
    order_status: string;
    total_amount: number;
    phone: string;
    details?: OrderDetail[];
}

const UserDetailPage: React.FC = () => {
    const { id: paramId } = useParams();
    const searchParams = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;

    useEffect(() => {
        const id = searchParams.get("id") || paramId;
        if (id) {
            userService.getUserById(id)
                .then((data: User) => setUser(data))
                .catch(err => console.error("Lỗi khi lấy user:", err));

            orderService.getOrdersByUserId(id)
                .then((data: { orders: Order[], orderDetails: OrderDetail[] }) => {
                    setOrders(data.orders || []);
                    setOrderDetails(data.orderDetails || []);
                })
                .catch(err => console.error("Lỗi khi lấy đơn hàng:", err))
                .finally(() => setLoading(false));
        }
    }, [paramId, searchParams]);

    if (loading) return <p>Loading...</p>;
    if (!user) return <p>Không tìm thấy người dùng!</p>;

    const totalSpent = orders.reduce((sum, order) => sum + order.total_amount, 0);
    const userPhone = orders.length > 0 ? orders[0].phone : user.phone;
    const avatarUrl = user.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.username}`;

    const mergedOrders = orders.map(order => ({
        ...order,
        details: orderDetails.filter(detail => detail.id_order === order._id)
    }));

    const totalPages = Math.ceil(orders.length / ordersPerPage);
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = mergedOrders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div className="container mt-4" style={{ maxWidth: "100%" }}>
            <h4 className="fw-bold fs-3 mb-3">
                Thông tin người dùng: {user?.username}
            </h4>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div
                        className="card text-center p-3 shadow-sm"
                        style={{ backgroundColor: "#e9f7ef", borderRadius: "10px" }}
                    >
                        <img
                            src={avatarUrl}
                            className="rounded-circle mx-auto d-block border border-success"
                            alt="Profile"
                            style={{ width: "120px", height: "120px", objectFit: "cover", marginBottom: "15px" }}
                        />
                        <h5 className="mt-4 mb-2 text-success fw-bold">Tên: {user.username}</h5>
                        <p className="text-muted mb-3">Số điện thoại: {userPhone}</p>
                        <a
                            href={`mailto:${user.email}`}
                            className="text-success fw-bold text-decoration-none mb-3 d-block"
                        >
                            Email: {user.email}
                        </a>
                        <button className="btn btn-success w-100 mt-4 py-2 fw-bold">
                            Tổng tiền: {totalSpent.toLocaleString("vi-VN")} VND
                        </button>
                    </div>

                </div>
                <div className="col-md-9">
                    <div className="card p-3">
                        <h2 className="fw-bold fs-5">Đơn hàng của người dùng</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Ngày tháng</th>
                                    <th>Trạng thái đơn hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentOrders.map(order => (
                                    <tr key={order._id}>
                                        <td><a href="#">#{order.order_code}</a></td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge bg-${order.order_status === "pending" ? "warning" : "success"}`}>
                                                {order.order_status}
                                            </span>
                                        </td>
                                        <td>
                                            {order.details.length > 0 ? (
                                                order.details.map((item, index) => (
                                                    <div key={item._id || index}>
                                                        {item.id_product.name} - {item.quantity} x {item.price.toLocaleString("vi-VN")} VND
                                                    </div>
                                                ))
                                            ) : (
                                                "N/A"
                                            )}
                                        </td>
                                        <td>{order.total_amount.toLocaleString("vi-VN")} VND</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* PHÂN TRANG */}
                        {totalPages > 1 && (
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
