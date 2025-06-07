import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function Home(): JSX.Element {
    const promoData = [
        { name: "Khuyến mãi 1", img: "/images/promo-1.png" },
        { name: "Khuyến mãi 2", img: "/images/promo-2.png" },
        { name: "Khuyến mãi 3", img: "/images/promo-3.png" },
        { name: "Khuyến mãi 4", img: "/images/promo-4.png" },
      ];
      return (
        <section className={styles.section}>
        {/* Tiêu đề nhỏ "Chương trình" */}
        <h3 className={styles.subTitle}>Chương trình</h3>

        {/* Tiêu đề lớn "Các chương trình nổi bật" */}
        <h2 className={styles.title}>Các chương trình nổi bật</h2>

        <div className={styles.promoList}>
          {promoData.map((promo, index) => (
            <div key={index} className={styles.promoItem}>
              <Image
                src={promo.img}
                alt={promo.name}
                width={280} // Nhỏ hơn container để tạo khoảng trắng
                height={180} // Tỉ lệ nhỏ hơn hình gốc
                className={styles.promoImage}
              />
            </div>
          ))}
        </div>
      </section>
      )
  }