"use client";
import styles from "../../styles/Product.module.css";
import Image from "next/image";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState } from "react";
import ProductList from "../../components/common/ProductList";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}
export default function PageProduct(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/categories`
        );
        const data = await response.json();
        // console.log("Dữ liệu từ API:", data);
        if (data && Array.isArray(data.data)) {
          setCategories(data.data.slice(0, 5));
        } else {
          console.error("Dữ liệu từ API không đúng định dạng mong đợi:", data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);
  return (
    <main className={styles.home}>
      {/* Danh mục nổi bật */}
      <section className={styles.section}>
        <h2 className={styles.titlelitter}>Nổi Bật</h2>
        <h2 className={styles.title1}>Danh mục nổi bật</h2>
        <div className={styles.categoryList}>
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category._id}
              href={`/${category.slug}`}
              className={styles.categoryLink}
            >
              <div className={styles.categoryItem}>
                <p>{category.name}</p>
                <img
                  src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${category.image}`}
                  alt={category.name}
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          ))}
        </div>
      </section>
      <div className={styles.container}>
        <div className={styles.section_product}>
          <div className={styles.titleModule}>
            <h3>
              <a href="">Pizza</a>
            </h3>
          </div>
          <ProductList idcate="67b0a4fbb5a39baf9de368ff" />
        </div>

        <div className={styles.section_product}>
          <div className={styles.titleModule}>
            <h3>
              <a href="">Khai vị</a>
            </h3>
          </div>
          <ProductList idcate="67b0a54db5a39baf9de36902" />
        </div>

        <div className={styles.section_product}>
          <div className={styles.titleModule}>
            <h3>
              <a href="">Mì ý</a>
            </h3>
          </div>
          <ProductList idcate="67b0a582b5a39baf9de36904" />
        </div>

        <div className={styles.section_product}>
          <div className={styles.titleModule}>
            <h3>
              <a href="">Salad</a>
            </h3>
          </div>
          <ProductList idcate="67b0a5d2b5a39baf9de36907" />
        </div>

        <div className={styles.section_product}>
          <div className={styles.titleModule}>
            <h3>
              <a href="">Thức Uống</a>
            </h3>
          </div>
          <ProductList idcate="67b0a75ab5a39baf9de3690a" />
        </div>
      </div>
    </main>
  );
}
