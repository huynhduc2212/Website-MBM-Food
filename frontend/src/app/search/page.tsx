"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "../../styles/ProductList.module.css";
import Image from "next/image";
import Link from "next/link";
import "../../styles/new.css";
import { toast } from "react-toastify";
import { Heart } from "lucide-react";
import { addFavorite, removeFavorite } from "@/services/Favorite";

export default function SearchPage() {
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get("query") || "";
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    // news: any[];
  }>({
    products: [],
    // news: [],
  });

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm) return;
      try {
        const response = await fetch(
          `http://localhost:3001/api/search?query=${searchTerm}`
        );

        if (!response.ok) {
          throw new Error(`Lỗi: ${response.status}`);
        }

        const data = await response.json();
        setSearchResults({
          products: data.products || [],
          // news: data.news || [],
        });
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    };

    fetchResults();
  }, [searchTerm]);

  useEffect(() => {
    // Lấy token từ localStorage
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const toggleFavorite = async (id: string) => {
    if (!token) {
      toast.warning("⚠ Bạn cần đăng nhập để yêu thích sản phẩm!");
      return;
    }
  
    try {
      if (favorites[id]) {
        await removeFavorite(id, token);
        toast.error(" Đã xóa sản phẩm khỏi danh sách yêu thích!");
      } else {
        await addFavorite(id, token);
        toast.success(" Đã thêm sản phẩm vào danh sách yêu thích!");
      }
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      toast.error("⚠ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  
  

  return (
    <div className="about-container">
      {/* Kết quả tìm kiếm */}
      <div className={styles.searchPage}>
        {searchResults.products.length > 0 && (
          <div className={styles.resultCategory}>
            <div className={styles.container}>
              <section className={styles.sectionProduct}>
                <h1 className={styles.titlepagesearch}>
                  <span>Kết quả tìm kiếm cho: {searchTerm}</span>
                </h1>
                <div className={styles.rowFix}>
                  {searchResults.products.map((item) => (
                    <div className={styles.colFix} key={item._id}>
                      <div className={styles.productAction}>
                        <div className={styles.productThumnail}>
                          <Link
                            href={`/product/${item.slug}`}
                            className={styles.imageThum}
                          >
                            <Image
                              className={styles.img}
                              src={`${API_URL}/images/${item.variants[0].image}`}
                              alt={item.name}
                              width={234}
                              height={234}
                            />
                            
                          </Link>
                          <button
                            className={styles.whistList}
                            onClick={() => toggleFavorite(item._id)}
                          >
                            <Heart
                              size={20}
                              color={favorites[item._id] ? "#E51735" : "gray"}
                              fill={
                                favorites[item._id] ? "#E51735" : "transparent"
                              }
                            />
                          </button>
                        </div>

                        <div className={styles.productInfo}>
                          <h3 className={styles.productName}>
                            <Link
                              href={`/product/${item.slug}`}
                              className={styles.productName}
                            >
                              {item.name}
                            </Link>
                          </h3>
                          <div className={styles.productContent}>
                            <span
                              className={styles.ProductDesc}
                              dangerouslySetInnerHTML={{
                                __html: item.description,
                              }}
                            />
                            <Link href={`/product/${item.slug}`}>Xem thêm</Link>
                          </div>
                          <div className={styles.groupForm}>
                            <div className={styles.priceBox}>
                              <span>Giá chỉ từ: </span>{" "}
                              {item.variants[0].price.toLocaleString()}₫
                            </div>
                            <button className={styles.add}>Thêm</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* {searchResults.news.length > 0 && (
          <div className={styles.resultCategory}>
            <h3>📰 Tin tức</h3>
            <div className={styles.grid}>
              {searchResults.news.map((item, index) => (
                <Link
                  key={index}
                  href={`/news/${item.slug}`}
                  className={styles.resultItem}
                >
                  {item.image && (
                    <Image
                      src={`/images/${item.image}`}
                      alt={item.title}
                      width={100}
                      height={100}
                    />
                  )}
                  <p>{item.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )} */}

        {searchResults.products.length === 0}
      </div>
    </div>
  );
}
