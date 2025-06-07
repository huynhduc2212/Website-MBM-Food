import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}

export default function FeaturedCategories(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/categories`
        );

        if (response.status === 403) return;

        const data = await response.json();
        if (data && Array.isArray(data.data)) {
          setCategories(data.data.slice(0, 5));
        }
      } catch (error: unknown) {
        if (error instanceof Error && !error.message.includes("403")) {
          console.error("Lỗi khi tải danh mục:", error.message);
        }
      }
    };

    fetchCategories();
  }, []);
  return (
    <section className={styles.section}>
      <h2 className={styles.titlelitter}>Nổi Bật</h2>
      <h2 className={styles.title}>Danh mục nổi bật</h2>
      <div className={styles.categoryList}>
        {categories.slice(0, 4).map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className={styles.categoryLink}
          >
            <div className={styles.categoryItem}>
              <p>{category.name}</p>
              <img
                src={`${API_URL}/images/${category.image}`}
                alt={category.name}
                width={85}
                height={95}
              />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
