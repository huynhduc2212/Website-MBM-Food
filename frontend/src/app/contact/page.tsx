import Image from "next/image";
import styles from "@/styles/Contact.module.css";

export default function Contact() {
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
                <p>support@sapo.vn</p>
              </div>
            </div>
          </div>

          <h2 className={styles.title}>Liên hệ với chúng tôi</h2>
          <p className={styles.description}>
            Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và chúng
            tôi sẽ liên lạc lại với bạn sớm nhất có thể.
          </p>
          <form className={styles.form}>
            <input
              type="text"
              placeholder="Họ và tên"
              className={styles.input}
            />
            <input type="email" placeholder="Email" className={styles.input} />
            <input
              type="tel"
              placeholder="Điện thoại*"
              className={styles.input}
            />
            <textarea
              placeholder="Nội dung"
              className={styles.textarea}
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
