import React from "react";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface News {
  _id: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageSummary?: string;
  create_at: string;
  status: number;
  author: string;
  view: number;
  hot: number;
}
export default function News(): JSX.Element {
  const [newsData, setNewsData] = useState<News[]>([]);
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/posts`
        );
        const result = await response.json();

        if (result && Array.isArray(result.posts)) {
          setNewsData(result.posts); // Lấy danh sách `posts` từ kết quả API
        } else {
          console.error("Dữ liệu từ API không đúng định dạng:", result);
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
      }
    };

    fetchNews();
  }, []);
  return (
    <section className={styles.newsSection}>
      <h3 className={styles.subTitle}>Tin tức</h3>
      <h2 className={styles.mainTitle}>Tin tức mới nhất</h2>
      <div className={styles.newsList}>
        {newsData.map((news) => (
          <Link
            href={`/news/${news.slug}`}
            key={news._id}
            className={styles.newsLink}
          >
            <div className={styles.newsItem}>
              {news.imageSummary && (
                <div className={styles.newsImgWrapper}>
                  <img
                    src={`${API_URL}/images/${news.imageSummary}`}
                    alt={news.title}
                    className={styles.newsImg}
                    width={300}
                    height={200}
                  />
                </div>
              )}

              <div className={styles.newsContent}>
                <h3 className={styles.newsTitle}>{news.title}</h3>
                <p className={styles.newsDate}>
                  {new Date(news.create_at).toLocaleDateString("vi-VN")}
                </p>
                <p
                  className={styles.newsDesc}
                  dangerouslySetInnerHTML={{ __html: news.content }}
                />
                <button
                  onClick={() =>
                    router.push(`/news/${news.slug}`)
                  }
                  className={styles.readMore}
                >
                  Đọc tiếp
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
