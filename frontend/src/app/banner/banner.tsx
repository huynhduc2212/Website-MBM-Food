import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchBanners } from "@/services/banner";
import { fetchProducts } from "@/services/product";
import styles from "@/styles/Banner.module.css";

const Banner = () => {
  const [banners, setBanners] = useState([]);
  const [products, setProducts] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchBanners().then((data) => {
      console.log("Fetched Banners:", data);
      setBanners(data);
    });

    fetchProducts().then((data) => {
      console.log("Fetched Products:", data);
      setProducts(data);
    });
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  if (banners.length === 0 || products.length === 0) return null; // Đảm bảo có dữ liệu

  return (
    <section className={styles.banner}>
      <button
        className={styles.prev}
        onClick={() =>
          setCurrentIndex(
            (prev) => (prev - 1 + banners.length) % banners.length
          )
        }
      >
        ❮
      </button>

      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`${styles.bannerItem} ${
            index === currentIndex ? styles.active : ""
          }`}
        >
          <Link
            href={products.length > 0 ? `/product/${products[index % products.length].slug}` : "#"}
            passHref
          >
            <Image
              src={`http://localhost:3001/images/${banner.image}`}
              alt={banner.title || "Banner"}
              width={1280}
              height={500}
              priority
              className={styles.bannerImage}
              style={{ cursor: "pointer" }}
            />
          </Link>
        </div>
      ))}

      <button
        className={styles.next}
        onClick={() => setCurrentIndex((prev) => (prev + 1) % banners.length)}
      >
        ❯
      </button>
    </section>
  );
};

export default Banner;
