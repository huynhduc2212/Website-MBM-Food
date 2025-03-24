"use client";
import styles from "@/styles/Footer.module.css";
import Image from "next/image";
import Link from "next/link";

export default function Footer(): JSX.Element {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerSection}>
          <h3>VỀ CHÚNG TÔI</h3>
          <p>
            Chào mừng bạn đến với MBM Food - điểm đến lý tưởng cho những người
            yêu thưởng thức pizza tại thành phố! MBM Food tự hào là địa chỉ
            pizza hàng đầu, nổi tiếng với chất lượng món ăn tuyệt vời, dịch vụ
            tận tâm và mức độ hài lòng cao từ phía khách hàng.
          </p>
          <h3>HÌNH THỨC THANH TOÁN</h3>
          <div className={styles.paymentMethods}>
            <Image src="/images/payment-cash.png" alt="Tiền mặt" width={50} height={30} />
            <Image src="/images/payment-bank.png" alt="Chuyển khoản" width={50} height={30} />
            <Image src="/images/payment-visa.png" alt="Visa" width={50} height={30} />
          </div>
        </div>

        <div className={styles.footerSection}>
          <h3>THÔNG TIN</h3>
          <p>
            Công ty TNHH MBM Food chuyên phục vụ trong lĩnh vực nhà hàng. Mã số
            thuế: 123456xxxx - Ngày cấp: 13/05/2024 - Nơi cấp: Sở kế hoạch và
            đầu tư TPHCM - Website: mbmfood.net
          </p>

          <FooterInfoItem icon="/images/location.png" text="70 Lữ Gia, Phường 15, Quận 11, TP.HCM" />
          <FooterInfoItem icon="/images/clock.png" text="8h - 22h, Thứ 2 đến Chủ Nhật" />
          <FooterInfoItem icon="/images/phone.png" text="1900 6750" />
          <FooterInfoItem icon="/images/email.png" text="support@mbm.vn" />
        </div>

        <div className={styles.footerSection}>
          <h3>CHÍNH SÁCH</h3>
          <ul>
            {["Chính sách thành viên", "Chính sách thanh toán", "Bảo mật thông tin cá nhân", "Hướng dẫn mua hàng", "Hướng dẫn thanh toán"].map((item, index) => (
              <li key={index}>
                <Link href="#">{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.footerSection}>
          <h3>THEO DÕI CHÚNG TÔI</h3>
          <div className={styles.socialIcons}>
            {["zalo", "facebook", "youtube", "instagram"].map((social, index) => (
              <Link key={index} href="#">
                <Image src={`/images/${social}.png`} alt={social} width={24} height={24} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

interface FooterInfoItemProps {
  icon: string;
  text: string;
}

function FooterInfoItem({ icon, text }: FooterInfoItemProps): JSX.Element {
  return (
    <div className={styles.infoItem}>
      <div className={styles.iconWrapper}>
        <Image src={icon} alt="icon" width={20} height={20} />
      </div>
      <span>{text}</span>
    </div>
  );
}