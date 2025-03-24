"use client";
import { useEffect, useState } from "react";
import { getUserById } from "@/services/user";
import styles from "@/styles/Account.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AccountInfo() {
    const [user, setUser] = useState<any>(null);


    useEffect(() => {
        async function fetchUser() {
            const userId = localStorage.getItem('userId');
            if (userId) {
                const response = await getUserById(userId);
                if (!response.error) {
                    setUser(response);
                }
            }
        }
        fetchUser();
    }, []);

    if (!user) return <p>Đang tải...</p>;

    return (
        <div>
            <h5>THÔNG TIN TÀI KHOẢN</h5>
            <p><strong>Họ tên:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Địa chỉ:</strong> {user.address || "Chưa có địa chỉ"}</p>
        </div>
    );
}
