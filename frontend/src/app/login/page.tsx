"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Spinner } from "react-bootstrap";
import styles from "../../styles/Login.module.css";

interface LoginForm {
  email: string;
  password: string;
}

interface ForgotPasswordForm {
  email: string;
}

const Login = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { register: registerForgot, handleSubmit: handleForgotSubmit } = useForm<ForgotPasswordForm>();

  const [error, setError] = useState<string>("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const router = useRouter();

  // Xử lý đăng nhập
  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Đăng nhập thất bại");

      if (!result.token || !result.userId || !result.role) {
        throw new Error("Dữ liệu từ server không hợp lệ.");
      }

      // Lưu token vào localStorage
      localStorage.setItem("token", result.token);
      localStorage.setItem("userId", result.userId);
      localStorage.setItem(
        "user",
        JSON.stringify({
          isLoggedIn: true,
          userId: result.userId,
          role: result.role.trim().toLowerCase(),
        })
      );
      window.dispatchEvent(new Event("storage"));

      toast.success("Đăng nhập thành công!", {
        autoClose: 100,
      });

      // Điều hướng theo vai trò
      const role = result.role.trim().toLowerCase();
      setTimeout(() => {
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "user") {
          router.push("/");
        } else {
          toast.error(`Vai trò "${result.role}" không có quyền truy cập.`);
        }
      }, 1000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý gửi email quên mật khẩu
  const onForgotPasswordSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
    setForgotLoading(true);
    try {
      const res = await fetch("http://localhost:3001/api/user/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Gửi yêu cầu thất bại");

      toast.success("Hãy kiểm tra email để đặt lại mật khẩu!");
      setShowForgotPassword(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      toast.error(errorMessage);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đăng nhập</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="Email"
          {...register("email", { required: "Vui lòng nhập email" })}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          {...register("password", { required: "Vui lòng nhập mật khẩu" })}
          className={styles.input}
        />
        <div className={styles.rememberForgot}>
          <label>
            <input type="checkbox" /> Ghi nhớ đăng nhập
          </label>
          <a
            href="#"
            className={styles.link}
            onClick={() => setShowForgotPassword(true)}
          >
            Quên mật khẩu?
          </a>
        </div>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "Đăng nhập"}
        </button>
      </form>
      <p>
        Bạn chưa có tài khoản?{" "}
        <a href="/register" className={styles.link}>
          Đăng ký
        </a>
      </p>

      {/* Modal Quên Mật Khẩu (Bootstrap) */}
      <Modal show={showForgotPassword} onHide={() => setShowForgotPassword(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Quên mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleForgotSubmit(onForgotPasswordSubmit)}>
            <input
              type="email"
              placeholder="Nhập email của bạn"
              {...registerForgot("email", { required: "Vui lòng nhập email" })}
              className="form-control mb-3"
            />
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={() => setShowForgotPassword(false)}>
                Hủy
              </Button>
              <Button type="submit" variant="primary" className="ms-2" disabled={forgotLoading}>
                {forgotLoading ? <Spinner animation="border" size="sm" /> : "Gửi yêu cầu"}
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;
