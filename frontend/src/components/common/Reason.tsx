import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function Reason(): JSX.Element {
    const reasons = [
        {
          img: "/images/quality.png",
          text: "Chất lượng món ăn hàng đầu",
        },
        {
          img: "/images/customer-service.png",
          text: "Dịch vụ chăm sóc khách hàng xuất sắc",
        },
        {
          img: "/images/menu.png",
          text: "Menu đa dạng phong cách",
        },
        {
          img: "/images/ingredients.png",
          text: "Chất lượng nguyên liệu cao cấp",
        },
        {
          img: "/images/promotion.png",
          text: "Ưu đãi và khuyến mãi hấp dẫn",
        },
      ];
      return (
        <section className={styles["lydo-section"]}>
        <p className={styles["lydo-subtitle"]}>Lý do</p>
        <h2 className={styles["lydo-title"]}>Tại sao chọn MBM Food?</h2>
        <div className={styles["lydo-grid"]}>
          {reasons.map((item, index) => (
            <div key={index} className={styles["lydo-item"]}>
              <div className={styles["lydo-iconWrapper"]}>
                <Image src={item.img} alt={item.text} width={80} height={80} />
              </div>
              <p className={styles["lydo-text"]}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>
      )
  }