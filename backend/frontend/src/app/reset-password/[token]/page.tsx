"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

const ResetPassword = ({ params }: { params: { token: string } }) => {
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mật khẩu gửi đi:", password);
    console.log("Token gửi đi:", params.token);

    try {
      const bodyData = JSON.stringify({ newPassword: password });
      console.log("Dữ liệu gửi đi:", bodyData);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user/reset-password/${params.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: bodyData,
        }
      );

      const result = await res.json();
      console.log("Phản hồi từ server:", result);

      if (!res.ok) throw new Error(result.message);

      toast.success("Mật khẩu đã được cập nhật!");
      router.push("/login");
    } catch (err) {
      console.error("Lỗi:", err);
      toast.error(err instanceof Error ? err.message : "Lỗi hệ thống!");
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow-lg p-4"
        style={{ maxWidth: "400px", width: "100%" }}
      >
        <h2 className="text-center mb-4">Đặt lại mật khẩu</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Cập nhật mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
