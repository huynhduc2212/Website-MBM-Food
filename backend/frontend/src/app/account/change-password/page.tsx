"use client";
import { useState } from "react";
import { updatePassword } from "@/services/user";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage("Vui lòng điền đầy đủ thông tin.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Mật khẩu xác nhận không khớp.");
            return;
        }

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setMessage("Không tìm thấy thông tin người dùng.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const response = await updatePassword(userId, oldPassword, newPassword);
            if (response.error) {
                throw new Error(response.message || "Lỗi không xác định.");
            }

            setMessage("Đổi mật khẩu thành công!");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            setMessage("Lỗi: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h5>ĐỔI MẬT KHẨU</h5>
            <form onSubmit={handleChangePassword}>
                <div className="mb-3">
                    <label htmlFor="oldPassword" className="form-label">Mật khẩu cũ</label>
                    <input
                        type="password"
                        className="form-control"
                        id="oldPassword"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                    <input
                        type="password"
                        className="form-control"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
                </button>
                {message && <p className="mt-2">{message}</p>}
            </form>
        </div>
    );
}
