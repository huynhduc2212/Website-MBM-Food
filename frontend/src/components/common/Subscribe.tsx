import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function Subscribe(): JSX.Element {
      return (
        <section className={styles.subscribe}>
        {/* Hình ảnh bên trái */}
        <div className={styles.imageLeft}>
          <Image
            src="/images/left-image.png"
            alt="Decor"
            width={300}
            height={250}
          />
        </div>

        {/* Nội dung chính */}
        <div className={styles.content}>
          <h2>Đăng ký nhận tin</h2>
          <p>
            Nhập email của bạn và nhận nhiều chương trình ưu đãi hấp dẫn từ cửa
            hàng!
          </p>
          <div className={styles.subscribeForm}>
            <input type="email" placeholder="Nhập email nhận tin khuyến mãi" />
            <button>ĐĂNG KÝ</button>
          </div>
        </div>

        {/* Hình ảnh bên phải */}
        <div className={styles.imageRight}>
          <Image
            src="/images/right-image.png"
            alt="Pizza"
            width={300}
            height={300}
          />
        </div>
      </section>
      )
  }