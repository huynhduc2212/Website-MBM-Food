"use client";

import "../../styles/new.css";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchNews, fetchFeaturedNews } from "../../services/post";

export interface Post {
  _id: string;
  title: string;
  slug: string;
  create_at: string | number | Date;
  content: string;
  imageSummary?: string;
  author: string;
}

export default function New() {
  const [laytintuc, setLaytintuc] = useState<Post[]>([]);
  const [tintucNoibat, setTintucNoibat] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const [news, featuredNews] = await Promise.all([
          fetchNews(),
          fetchFeaturedNews(),
        ]) as [Post[], Post[]];
  
        if (!news.length) throw new Error("Không có bài viết nào.");
        if (!featuredNews.length) throw new Error("Không có tin nổi bật.");
  
        setLaytintuc(news);
        setTintucNoibat(featuredNews);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };
  
    getData();
  }, []);

  const truncateHTML = (html: string, maxLength: number) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || "";
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="about-container">
      <div className="blog_wrapper layout">
        <div className="container">
          <div className="row">
            <div className="col-lg-8">
              <div className="list-blogs">
                <div className="row row-fix">
                  {laytintuc.map((tintuc) => (
                    <div className="col-fix" key={tintuc._id}>
                      <div className="item-blog">
                        <div className="block-thumb">
                          <Link href={`/news/${tintuc.slug}`}>
                            <img
                              src={
                                tintuc.imageSummary
                                    ? `${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${tintuc.imageSummary}`
                                    : "/placeholder.jpg"
                            }
                              alt={tintuc.title}
                              width={940}
                              height={640}
                             
                            />
                          </Link>
                        </div>
                        <div className="block-content">
                          <h3>
                            <Link href={`/news/${tintuc.slug}`}>
                              {tintuc.title}
                            </Link>
                          </h3>
                          <div className="time-post">
                            {new Date(tintuc.create_at).toLocaleDateString()}
                          </div>
                          <p>{truncateHTML(tintuc.content, 150)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="col-xl-4">
              <div className="aside-section">
                <h2 className="aside-title">Danh mục tin tức</h2>
                <ul className="aside-list">
                  <li><Link href="/">Trang chủ</Link></li>
                  <li><Link href="/about">Giới thiệu</Link></li>
                  <li className="menu-item">
                    <Link href="/product">Sản phẩm</Link>
                    <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
                      {isOpen ? "−" : "+"}
                    </button>
                  </li>
                  {isOpen && (
                    <ul className="submenu">
                      <li><Link href="/pizza">Pizza</Link></li>
                      <li><Link href="/khai-vi">Khai vị</Link></li>
                      <li><Link href="/my-y">Mỳ Ý</Link></li>
                      <li><Link href="/salad">Salad</Link></li>
                      <li><Link href="/thuc-uong">Thức uống</Link></li>
                    </ul>
                  )}
                  <li><Link className="font-bold" href="/news">Tin tức</Link></li>
                  <li><Link href="/contact">Liên hệ</Link></li>
                  <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
                  <li><Link href="/storesystem">Hệ thống cửa hàng</Link></li>
                  <li><Link href="/booking">Đặt bàn</Link></li>
                </ul>
              </div>

              <div className="aside-section">
                <h2 className="aside-title">Tin tức nổi bật</h2>
                <div className="item-blog-small">
                  <ul className="aside-list">
                    {tintucNoibat.map((tintuc) => (
                      <li className="aside-news-item" key={tintuc.slug}>
                        <div className="block-thumb">
                          <Link href={`/news/${tintuc.slug}`}>
                            <img
                              src={
                                tintuc.imageSummary
                                    ? `${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${tintuc.imageSummary}`
                                    : "/placeholder.jpg"
                            }
                              alt={tintuc.title}
                              width={120}
                              height={120}
                            />
                          </Link>
                        </div>
                        <div className="block-content">
                          <Link href={`/news/${tintuc.slug}`}>
                            {tintuc.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div> {/* Kết thúc sidebar */}
          </div>
        </div>
      </div>
    </div>
  );
}
