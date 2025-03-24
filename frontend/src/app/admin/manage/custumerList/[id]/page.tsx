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
    status: string;
    total_amount: number;
    phone: string;
    details?: OrderDetail[];
}

const UserDetailPage: React.FC = () => {
    const { id: paramId } = useParams();
    const searchParams = useSearchParams();
    const [showAllOrders, setShowAllOrders] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);

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
    
    const mergedOrders = orders.map(order => ({
        ...order,
        details: orderDetails.filter(detail => detail.id_order === order._id)
    }));

    return (
        <div className="container mt-4">
            <h4 className="fw-bold fs-3 mb-3">Danh sách người dùng</h4>
            <div className="row pt-1">
                <div className="col-md-3">
                    <div className="card text-center p-4 shadow-sm" style={{ backgroundColor: "#e9f7ef", borderRadius: "10px" }}>
                        <img
                            src={user.avatar || "https://via.placeholder.com/100"}
                            className="rounded-circle mx-auto d-block border border-success"
                            alt="Profile"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                        />
                        <h5 className="mt-3 text-success fw-bold">Name: {user.username}</h5>
                        <p className="text-muted">Number: {userPhone}</p>
                        <a href={`mailto:${user.email}`} className="text-success fw-bold text-decoration-none">
                            Email: {user.email}
                        </a>
                        <button className="btn btn-success w-100 mt-3 fw-bold">
                            Total: {totalSpent.toLocaleString("vi-VN")} VND
                        </button>
                    </div>
                </div>
                <div className="col-md-9">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="fw-bold fs-5">Orders</h2>
                    </div>
                    <div className="card p-3">
                        <p>
                            Total spent: <strong>{totalSpent.toLocaleString("vi-VN")} VND</strong>
                            on <strong>{orders.length} orders</strong>
                        </p>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Order</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {mergedOrders.slice(0, showAllOrders ? mergedOrders.length : 1).map(order => (
                                    <tr key={order._id}>
                                        <td><a href="#">#{order.order_code}</a></td>
                                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <span className={`badge bg-${order.status === "pending" ? "warning" : "success"}`}>
                                                {order.status}
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
                        {!showAllOrders && mergedOrders.length > 1 && (
                            <button className="btn btn-secondary w-100" onClick={() => setShowAllOrders(true)}>...</button>
                        )}
                        {showAllOrders && (
                            <button className="btn btn-danger w-100" onClick={() => setShowAllOrders(false)}>Đóng</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;
