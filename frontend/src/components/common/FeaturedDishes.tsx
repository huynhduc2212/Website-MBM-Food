import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useEffect, useState, useRef } from "react";
import { Heart } from "lucide-react";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
  // getFavorites,
} from "../../services/Favorite";
import { incrementView } from "@/services/incrementView";
import { toast } from "react-toastify";
import { checkTokenValidity } from "@/services/Auth";
import Swal from "sweetalert2";
import QuickView from "../layout/QuickView";

interface Variant {
  option: string;
  price: number;
  sale_price: number;
  image: string;
}
interface Product {
  _id: string;
  name: string;
  idcate: string;
  description: string;
  variants: Variant[];
  hot?: number;
  view: number;
  slug: string;
}

export default function FeaturedDishes(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  const [token, setToken] = useState<string | null>(null);
  const alertShown = useRef(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  useEffect(() => {
    const fetchProducts = async () => {
      const storedToken = localStorage.getItem("token");
      let tokenStatus = { valid: false };

      if (storedToken) {
        tokenStatus = await checkTokenValidity(storedToken);
        if (!tokenStatus.valid) {
          localStorage.removeItem("token");
          setToken(null);

          if (!alertShown.current) {
            alertShown.current = true;
            Swal.fire({
              title: "Phiên đăng nhập đã hết hạn!",
              text: "Bạn có muốn đăng nhập lại không?",
              icon: "warning",
              showCancelButton: true,
              confirmButtonText: "Đăng nhập lại",
              cancelButtonText: "Tiếp tục",
              confirmButtonColor: "#d33",
              cancelButtonColor: "#3085d6",
            }).then((result) => {
              if (result.isConfirmed) {
                router.push("/login");
              }
            });
          }
        }
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products`
        );

        if (response.status === 403) return;

        if (!response.ok) {
          throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
        }

        const data = await response.json();
        if (data?.data && Array.isArray(data.data)) {
          setProducts(data.data);

          if (storedToken && tokenStatus.valid) {
            const favoriteStatus: { [key: string]: boolean } = {};
            await Promise.all(
              data.data.map(async (product: any) => {
                const result = await checkFavorite(product._id, storedToken);
                favoriteStatus[product._id] = result?.isFavorite || false;
              })
            );
            setFavorites(favoriteStatus);
          }
        }
      } catch (error: unknown) {
        if (error instanceof Error && !error.message.includes("403")) {
          console.error("Lỗi khi tải sản phẩm:", error.message);
        }
      }
    };

    fetchProducts();
  }, [token]);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
  // Toggle trạng thái yêu thích
  const toggleFavorite = async (food_id: string) => {
    if (!token) {
      toast.error("Bạn cần đăng nhập để yêu thích sản phẩm!", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    const newFavorites = { ...favorites };

    if (favorites[food_id]) {
      await removeFavorite(food_id, token);
      newFavorites[food_id] = false;
      toast.error("Đã xóa sản phẩm khỏi danh sách yêu thích!", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      await addFavorite(food_id, token);
      newFavorites[food_id] = true;
      toast.success("Đã thêm sản phẩm vào danh sách yêu thích!", {
        position: "top-right",
        autoClose: 2000,
      });
    }

    setFavorites(newFavorites);
  };
  return (
    <section className={styles.section}>
      <h2 className={styles.TitleHot}>Món ăn nổi bật</h2>
      <Swiper
        className={styles.customSwiper}
        modules={[Navigation, Pagination]}
        spaceBetween={20}
        slidesPerView={2}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          1024: { slidesPerView: 2 },
        }}
      >
        {products
          .filter((product) => product.hot === 1)
          .map((food) => (
            <SwiperSlide key={food._id} className={styles.slideItem}>
              <div className={styles.foodItem}>
                <button
                  className={styles.heartIcon}
                  onClick={async () => {
                    await toggleFavorite(food._id);
                  }}
                >
                  <Heart
                    size={20}
                    className={
                      favorites[food._id]
                        ? styles.heartActive
                        : styles.heartInactive
                    }
                  />
                </button>
                <Link
                  href={`/product/${food.slug}`}
                  onClick={() => incrementView(food._id, food.view)}
                >
                  <img
                    src={`${API_URL}/images/${
                      food.variants[0]?.image || "default.png"
                    }`}
                    alt={food.name}
                    width={150}
                    height={140}
                  />
                </Link>
                <div className={styles.foodContent}>
                  <Link
                    href={`/product/${food.slug}`}
                    onClick={() => incrementView(food._id, food.view)}
                  >
                    <h3 className={styles.foodName}>{food.name}</h3>
                  </Link>
                  <p
                    className={styles.foodDesc}
                    dangerouslySetInnerHTML={{
                      __html: food.description || "Không có mô tả",
                    }}
                  />
                  <Link
                    href={`/product/${food.slug}`}
                    onClick={() => incrementView(food._id, food.view)}
                  >
                    <p className={styles.viewMore}>Xem thêm</p>
                  </Link>
                  <div className={styles.foodPriceContainer}>
                    <p className={styles.foodPriceLabel}>Giá chỉ từ: </p>
                    <span className={styles.foodPrice}>
                      {food.variants[0]?.price.toLocaleString() || "Liên hệ"}đ
                    </span>
                  </div>
                </div>
                <button
                  className={styles.addButton}
                  onClick={() => setSelectedProduct(food)}
                >
                  Thêm
                </button>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>
      {selectedProduct && (
        <QuickView
          product={{ ...selectedProduct, id: selectedProduct._id }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
