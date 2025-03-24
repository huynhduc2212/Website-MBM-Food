"use client";
import Link from "next/link";
import styles from "@/styles/Account.module.css";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.accountContainer} >
            {/* Container căn giữa */}
            <div className="container d-flex mt-2 " style={{ maxWidth: "1300px" }}>
                <div className="row bg-white p-3 rounded shadow-sm w-100" style={{ maxWidth: "1300px" }}>
                    {/* Sidebar */}
                    <div className={`col-md-3 ${styles.sidebar}`}>
                        <h5>TRANG TÀI KHOẢN</h5>
                        <p><strong>Xin chào, <span className="text-danger">Quý Khách</span>!</strong></p>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                            <li><Link href="/account">Thông tin tài khoản</Link></li>
                            <li><Link href="/account/orders">Đơn hàng của bạn</Link></li>
                            <li><Link href="/account/booking">Lịch sử đặt bàn</Link></li>
                            <li><Link href="/account/change-password">Đổi mật khẩu</Link></li>
                            <li><Link href="/account/address">Sổ địa chỉ</Link></li>
                        </ul>
                    </div>

                    {/* Nội dung chính */}
                    <div className="col-md-9 content" style={{ paddingLeft: "10px" }}>{children}</div>

                </div>
            </div>
        </div>
    );
}
