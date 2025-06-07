import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
  export default function Home(): JSX.Element {
    const specialBannerImages = [
        { base: "/images/bannereff1.png", overlay: "/images/bannereff4.png" },
        { base: "/images/bannereff2.png", overlay: "/images/bannereff5.png" },
        { base: "/images/bannereff3.png", overlay: "/images/bannereff6.png" },
      ];
      return (
        <section className="styles.specialBanner">
        <div className={styles.specialBannerContainer}>
          {specialBannerImages.map((banner, index) => (
            <div key={index} className={styles.specialBannerItem}>
              {/* Hình nền chính */}
              <Image
                src={banner.base}
                alt={`Banner ${index + 1}`}
                width={350}
                height={200}
                className={styles.specialBannerBase}
              />
              {/* Hình hiệu ứng đè lên */}
              <Image
                src={banner.overlay}
                alt={`Effect ${index + 1}`}
                width={350}
                height={200}
                className={`${styles.specialBannerOverlay} ${
                  styles[`overlay${index}`]
                }`}
              />
            </div>
          ))}
        </div>
      </section>
      )
  }