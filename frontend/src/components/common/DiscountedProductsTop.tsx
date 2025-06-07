import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function DiscountedProductsTop(): JSX.Element {
      return (
        <section className={styles.discountSection}>
        {/* Phần trên: Chia thành 2 cột (Text bên trái, banner bên phải) */}
        <div className={styles.discountHeader}>
          {/* Bên trái: Text */}
          <div className={styles.discountContent}>
            <h3 className={styles.discountSubTitle}>Món ăn</h3>
            <h2 className={styles.discountTitle}>Đang được giảm giá</h2>
            <p className={styles.discountDescription}>
              Chúng tôi thường xuyên cập nhật những chương trình khuyến mãi để
              quý khách có thể trải nghiệm tất cả món ăn của chúng tôi.
            </p>
            <p className={styles.discountEndText}>
              Chương trình đã kết thúc, hẹn gặp lại trong thời gian sớm nhất!
            </p>
          </div>

          {/* Bên phải: Banner */}
          <div className={styles.discountBanner}>
            <Image
              src="/images/banner-discount.png"
              alt="Pizza ngon"
              width={350}
              height={280}
            />
          </div>
        </div>
      </section>
      )
  }