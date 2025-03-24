"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/Register.module.css";

interface RegisterForm {
  username: string;
  email: string;
  password: string;
  
}

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterForm>();
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const onSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const res = await fetch("http://localhost:3001/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: { message?: string } = await res.json();
      if (!res.ok) throw new Error(result.message || "Đăng kí thất bại!");

      toast.success("Tạo tài khoản thành công!");
      setTimeout(() => {
        router.push("/login");
      }, 2000); // Chờ 2 giây trước khi chuyển trang để người dùng thấy thông báo
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>ĐĂNG KÝ</h2>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <input type="text" placeholder="Tên đăng nhập" {...register("username", { required: "Tên đăng nhập là bắt buộc" })} className={styles.input} />
        {errors.username && <p className={styles.error}>{errors.username.message}</p>}

        <input type="email" placeholder="Email" {...register("email", { required: "Email là bắt buộc" })} className={styles.input} />
        {errors.email && <p className={styles.error}>{errors.email.message}</p>}

        <input type="password" placeholder="Mật khẩu" {...register("password", { required: "Mật khẩu là bắt buộc" })} className={styles.input} />
        {errors.password && <p className={styles.error}>{errors.password.message}</p>}

        

        <p className={styles.terms}>
          Bằng cách đăng ký, bạn đồng ý với <a href="#" className={styles.link}>Điều khoản dịch vụ</a>.
        </p>
        <button type="submit" className={styles.button}>Đăng ký</button>
      </form>
      <p>
        Bạn đã có tài khoản? <a href="/login" className={styles.link}>Đăng nhập ngay!</a>
      </p>
    </div>
  );
}
