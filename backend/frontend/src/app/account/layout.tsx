"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/account.module.css";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={styles.accountContainer}>
            <div className="container mt-2">
                <div className="row bg-white p-3 rounded shadow-sm">
                    {/* Nút bấm để hiển thị menu trên mobile */}
                    <button 
                        className="btn btn-success d-md-none mb-3" 
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? "✖ Đóng Menu" : "☰ Mở Menu"}
                    </button>

                    {/* Sidebar */}
                    <div className={`col-md-3 ${isOpen ? "d-block" : "d-none d-md-block"} ${styles.sidebar}`}>
                        <h5 className={styles.text}>TRANG TÀI KHOẢN</h5>
                        <p><strong>Xin chào, <span className="text-danger">Quý Khách</span>!</strong></p>
                        <ul className="list-unstyled d-flex flex-column gap-2">
                            <li><Link href="/account">Thông tin tài khoản</Link></li>
                            <li><Link href="/account/orders">Đơn hàng của bạn</Link></li>
                            <li><Link href="/account/booking">Lịch sử đặt bàn</Link></li>
                            <li><Link href="/account/change-password">Đổi mật khẩu</Link></li>
                            <li><Link href="/account/address">Sổ địa chỉ</Link></li>
                        </ul>
                    </div>

                    {/* Nội dung chính */}
                    <div className="col-md-9">{children}</div>
                </div>
            </div>
        </div>
    );
}
