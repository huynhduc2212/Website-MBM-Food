import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/ProductNotification.module.css";
import Link from "next/link";
import { incrementView } from "@/services/incrementView";
interface Variant {
  option: string;
  price: number;
  sale_price: number;
  image: string;
  _id: string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  idcate: string;
  variants: Variant[];
  hot?: number;
  view: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  flag: boolean;
}

const ProductNotification: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);
  const [visible, setVisible] = useState(false);
  const [hidden, setHidden] = useState(false); // Thêm trạng thái để kiểm soát việc ẩn hẳn

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/products");
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data.data || []);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const showRandomProduct = () => {
        const randomIndex = Math.floor(Math.random() * products.length);
        const product = products[randomIndex];
        setRandomProduct(product);
        setHidden(false); // Hiện lên
        setVisible(true);

        setTimeout(() => {
          setVisible(false); // Trượt xuống
          setTimeout(() => setHidden(true), 500); // Ẩn hẳn sau 0.5s (khớp thời gian trượt xuống)
        }, 5000);
      };

      const firstTimeout = setTimeout(() => {
        showRandomProduct();
        const interval = setInterval(showRandomProduct, 15000); // Lặp lại sau 15s
        return () => clearInterval(interval);
      }, 5000);

      return () => clearTimeout(firstTimeout);
    }
  }, [products]);

  const handleClose = () => {
    setVisible(false); // Trượt xuống
    setTimeout(() => setHidden(true), 500); // Ẩn hẳn
  };

  if (hidden) return null; // Chỉ ẩn khi hiệu ứng đã hoàn tất

  const productImage = randomProduct?.variants[0]?.image
    ? `http://localhost:3001/images/${randomProduct.variants[0].image}`
    : "/placeholder.png";

  return (
    <div
      className={`${styles.notificationContainer} ${
        !visible || !randomProduct ? styles.hide : ""
      }`}
    >
      <Link
        href={`/product/${randomProduct?.slug ?? "#"}`}
        onClick={() =>
          randomProduct && incrementView(randomProduct._id, randomProduct.view)
        }
      >
        <Image
          src={productImage}
          alt={randomProduct?.name ?? "Sản phẩm"}
          width={60}
          height={60}
          className={styles.productImage}
        />
      </Link>
      <div className={styles.notificationContent}>
        <Link
          href={`/product/${randomProduct?.slug ?? "#"}`}
          onClick={() =>
            randomProduct &&
            incrementView(randomProduct._id, randomProduct.view)
          }
        >
          <h4>{randomProduct?.name ?? "Sản phẩm"}</h4>
        </Link>
        <p>
          Giá: {randomProduct?.variants[0]?.price?.toLocaleString() ?? "N/A"}{" "}
          VND
        </p>
        <span>Đã được mua cách đây 45 phút</span>
      </div>
      <button className={styles.closeBtn} onClick={handleClose}>
        ×
      </button>
    </div>
  );
};

export default ProductNotification;
