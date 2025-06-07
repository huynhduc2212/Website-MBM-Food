"use client";

import Image from "next/image";
import styles from "@/styles/Contact.module.css";
import ContactServices from "../../services/contact";
import { sendEmail } from "../../services/contact"; 
import { useEffect, useState } from "react";

export default function Contact() {
    const [message, setMessage] = useState<string | null>(null); // 👉 Thêm state lưu thông báo
  
    const [formData, setFormData] = useState({
      name: "",
      email: "",
      phone: "",
      message: "",
  });
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
        if (userId) {
          const user = await ContactServices.getUserById(userId); // Sử dụng getUserById từ BookingServices
          if (user) {
            setFormData({
              name: user.address[0].name || "", // Cập nhật tên
              email: user.email || "", // Cập nhật email
              phone: user.phone || "",
              message: "", // Để trống phần message
            });
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };
  
    fetchUserData();
  }, []); // Dùng useEffect để chỉ chạy một lần khi component mount
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null); // Reset thông báo trước khi gửi
  
    // Gọi hàm sendEmail từ contact.ts
    const result = await sendEmail(formData);
  
    if (result.success) {
      setMessage(result.message);
    } else {
      setMessage(result.message);
    }
  };
  return (
    <section className={styles.container}>
      <div className={styles.contentBox}>
        <div className={styles.leftBox}>
          <h2 className={styles.title}>Thông tin cửa hàng</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <Image
                src="/images/locationgreen.jpg"
                alt="Địa chỉ"
                width={25}
                height={25}
                className={styles.imageGreen}
              />
              <div>
                <h3 className={styles.infoTitle}>Địa chỉ</h3>
                <p>70 Lữ Gia, Phường 15, Quận 11, TP.HCM</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Image
                src="/images/clockgreen.jpg"
                alt="Thời gian làm việc"
                width={25}
                height={25}
                className={styles.imageGreen}
              />
              <div>
                <h3 className={styles.infoTitle}>Thời gian làm việc</h3>
                <p>8h - 22h</p>
                <p>Từ thứ 2 đến chủ nhật</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Image
                src="/images/phonegreen.jpg"
                alt="Hotline"
                width={25}
                height={25}
                className={styles.imageGreen}
              />
              <div>
                <h3 className={styles.infoTitle}>Hotline</h3>
                <p>1900 6750</p>
              </div>
            </div>
            <div className={styles.infoItem}>
              <Image
                src="/images/mailgreen.jpg"
                alt="Email"
                width={25}
                height={25}
                className={styles.imageGreen}
              />
              <div>
                <h3 className={styles.infoTitle}>Email</h3>
                <p>mbmfoodstore@gmail.com</p>
              </div>
            </div>
          </div>

          <h2 className={styles.title}>Liên hệ với chúng tôi</h2>
          <p className={styles.description}>
            Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng
            tôi sẽ liên lạc lại với bạn sớm nhất có thể.
          </p>
          {/* Hiển thị thông báo nếu có */}
          {message && <div className={styles.message_box}>{message}</div>}
          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Họ và tên"
              className={styles.input}
              onChange={handleChange}
              name="name"
              value={formData.name}
            />
            <input type="email" 
            placeholder="Email" 
            className={styles.input}
            onChange={handleChange}
            name="email"
            value={formData.email} />
            <input
              type="number"
              placeholder="Điện thoại*"
              className={styles.input}
              onChange={handleChange}
              name="phone"
              value={formData.phone}
            />
            <textarea
              placeholder="Nội dung"
              className={styles.textarea}
              onChange={handleChange}
              name="message"
              value={formData.message}
            ></textarea>
            <button type="submit" className={styles.button}>
              Gửi thông tin
            </button>
          </form>
        </div>
        {/* https://www.google.com/maps/embed/v1/place?key=AIzaSyAHsh-yRblukJEyvT4SiB1PbLmXEJJ6v54&q=70+Lữ+Gia,+Phường+15,+Quận+11,+TP.HCM */}
        <div className={styles.rightBox}>
          <iframe
            src="https://www.google.com/maps/embed/v1/place?key=AIzaSyAHsh-yRblukJEyvT4SiB1PbLmXEJJ6v54&q=70+Lữ+Gia,+Phường+15,+Quận+11,+TP.HCM"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
