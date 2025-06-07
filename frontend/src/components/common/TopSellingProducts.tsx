import React from "react";
import styles from "@/styles/Home.module.css";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
export default function Home(): JSX.Element {
  const [, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);
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
  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/orders/top-selling-products`
        );
        const data = await response.json();

        const products: Product[] = data.map(
          (item: { data: Product }) => item.data
        );
        setBestSellingProducts(products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm bán chạy:", error);
      }
    };

    fetchTopSellingProducts();
  }, []);
  return (
    <section className={styles.bestSelling}>
      <div className={styles.bestSellingWrapper}>
        <h2 className={styles.bestSellingTitle}>Món ăn</h2>
        <span className={styles.bestSellingSubtitle}>Được bán nhiều nhất</span>
        <div className={styles.bestSellingList}>
          {/* Hiển thị các sản phẩm bán chạy */}
          {bestSellingProducts.map((item) => (
            <div key={item._id} className={styles.bestSellingItem}>
              {item.hot === 1 && (
                <span className={styles.bestSellingNewTag}>Hot</span>
              )}

              <button
                className={styles.heartIcon}
                onClick={async () => {
                  await toggleFavorite(item._id);
                }}
              >
                <Heart
                  size={20}
                  className={
                    favorites[item._id]
                      ? styles.heartActive
                      : styles.heartInactive
                  }
                />
              </button>
              <Link
                href={`/product/${item.slug}`}
                onClick={() => incrementView(item._id, item.view)}
              >
                <img
                  src={`${API_URL}/images/${
                    item.variants?.[0]?.image || "default.png"
                  }`}
                  alt={item.name}
                  width={230}
                  height={200}
                />
              </Link>
              <Link
                href={`/product/${item.slug}`}
                onClick={() => incrementView(item._id, item.view)}
              >
                <h3 className={styles.bestSellingItemName}>{item.name}</h3>
              </Link>
              <p
                className={styles.bestSellingItemDesc}
                dangerouslySetInnerHTML={{
                  __html: item.description || "Không có mô tả",
                }}
              />
              <Link
                href={`/product/${item.slug}`}
                className={styles.menufoodMore}
                onClick={() => incrementView(item._id, item.view)}
              >
                Xem thêm
              </Link>
              <div className={styles.bestSellingContainer}>
                <div className={styles.bestSellingFoodPrice}>
                  <p>Giá chỉ từ:</p>
                  <span>
                    {item.variants?.[0]?.price.toLocaleString() || "Liên hệ"}đ
                  </span>
                </div>
                <button
                  className={styles.bestSellingAddButton}
                  onClick={() => setSelectedProduct(item)}
                >
                  Thêm
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedProduct && (
        <QuickView
          product={{ ...selectedProduct, id: selectedProduct._id }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
