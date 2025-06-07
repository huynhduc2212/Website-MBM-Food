import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
  export default function Home(): JSX.Element {
      return (
        <section className={styles.about}>
        <div className={styles.aboutContainer}>
          {/* Hình lớn bên trái */}
          <div className={styles.aboutImage}>
            <Image
              src="/images/pizza0.png"
              alt="MBM Food"
              width={403}
              height={403}
            />
          </div>

          {/* Nội dung bên phải */}
          <div className={styles.aboutContent}>
            <h3 className={styles.aboutSubtitle}>Về Chúng Tôi</h3>
            <h2 className={styles.aboutTitle}>MBM Food</h2>
            <p className={styles.aboutText}>
              Chào mừng bạn đến với MBM Food - điểm đến lý tưởng cho những người
              yêu thương thức pizza tại thành phố! MBM Food tự hào là địa chỉ
              pizza hàng đầu, nổi tiếng với chất lượng món ăn tuyệt vời, dịch vụ
              tận tâm và mức độ hài lòng cao từ phía khách hàng.
            </p>

            {/* Danh sách hình nhỏ */}
            <div className={styles.imageGallery}>
              <div className={styles.galleryItem}>
                <Image
                  src="/images/pizza1.png"
                  alt="Pizza 1"
                  width={201}
                  height={201}
                />
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="/images/pizza2.png"
                  alt="Pizza 2"
                  width={201}
                  height={201}
                />
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="/images/pizza3.png"
                  alt="Pizza 3"
                  width={201}
                  height={201}
                />
              </div>
              <div className={styles.galleryItem}>
                <Image
                  src="/images/pizza4.png"
                  alt="Pizza 4"
                  width={201}
                  height={201}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      )
  }