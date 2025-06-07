import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function Assess(): JSX.Element {
      return (
        <section className={styles.danhgiaSection}>
        <div className={styles.danhgiaContent}>
          <h2>Khách hàng nói gì về chúng tôi</h2>
          <p>
            Chúng tôi cung cấp cho bạn cách chuẩn bị bữa ăn hoàn chỉnh, bao gồm
            các nguyên liệu cần thiết được đóng gói sẵn cho một bữa tối thân
            thánh cũng như hướng dẫn công thức nấu ăn dễ làm theo một cách đẹp
            mắt.
          </p>
          <div className={styles.danhgiaStats}>
            <div className={styles.stat}>
              <span>12+</span>
              <p>Cửa hàng</p>
            </div>
            <div className={styles.stat}>
              <span>200+</span>
              <p>Nhân viên</p>
            </div>
            <div className={styles.stat}>
              <span>5000+</span>
              <p>Khách hàng</p>
            </div>
          </div>
        </div>

        <div className={styles.danhgiaCard}>
          <Image
            src="/images/danhgia_1.webp"
            alt="Hoàng Dung"
            width={60}
            height={60}
            className={styles.avatar}
          />
          <div className={styles.danhgiaText}>
            <h3>Hoàng Dung</h3>
            <p className={styles.danhgiaRole}>Nhân viên văn phòng</p>
            <p className={styles.danhgiaComment}>
              Các món ăn ở MBM Food đều rất ngon. Con tôi cũng rất thích, mỗi
              tuần đều dẫn con tôi đến đây ăn. Không những ngon mà không gian
              còn rất thoải mái.
            </p>
          </div>
        </div>
      </section>
      )
  }