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
import QuickView from "../layout/QuickView";
import { checkTokenValidity } from "@/services/Auth";
import Swal from "sweetalert2";

interface Category {
  _id: string;
  name: string;
  image: string;
  slug: string;
}
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
export default function Menu(): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();
  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  const [token, setToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const alertShown = useRef(false);
  const handleScrollToCategory = (categoryId: string) => {
    const section = document.getElementById(categoryId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
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
    <section className={styles.menufoodContainer}>
      <div className={styles.menufoodsubtitle}>Tất cả</div>
      <h2 className={styles.menufoodTitle}>Menu dành cho bạn</h2>

      <div className={styles.menufoodTabs}>
        {categories.slice(0, 5).map((category) => (
          <div
            key={category._id}
            className={styles.menufoodTab}
            onClick={() => handleScrollToCategory(category._id)}
          >
            {category.name}
          </div>
        ))}
      </div>

      {categories.map((category) => {
        const filteredProducts = products
          .filter((product) => product.idcate === category._id)
          .slice(0, 4);

        return (
          <div key={category._id} id={category._id}>
            <h3 className={styles.menufoodCategoryTitle}>{category.name}</h3>
            <div className={styles.menufoodGrid}>
              {filteredProducts.map((item) => (
                <div key={item._id} className={styles.menufoodCard}>
                  <Link
                    href={`/product/${item.slug}`}
                    onClick={() => incrementView(item._id, item.view)}
                  >
                    <img
                      src={`${API_URL}/images/${
                        item.variants[0]?.image || "default.png"
                      }`}
                      alt={item.name}
                      className={styles.menufoodImage}
                    />
                  </Link>
                  <div className={styles.menufoodContent}>
                    <Link
                      href={`/product/${item.slug}`}
                      onClick={() => incrementView(item._id, item.view)}
                    >
                      <h4 className={styles.menufoodItemName}>{item.name}</h4>
                    </Link>
                    <p
                      className={styles.menufoodItemDesc}
                      dangerouslySetInnerHTML={{
                        __html: item.description || "Không có mô tả",
                      }}
                    ></p>
                    <Link
                      href={`/product/${item.slug}`}
                      className={styles.menufoodMore}
                      onClick={() => incrementView(item._id, item.view)}
                    >
                      Xem thêm
                    </Link>
                    <p className={styles.menufoodPrice}>
                      Giá chỉ từ:{" "}
                      <span>
                        {item.variants[0]?.price
                          ? item.variants[0].price.toLocaleString() + "đ"
                          : "Liên hệ"}
                      </span>
                    </p>
                    <div className={styles.menufoodActions}>
                      <button
                        className={styles.menufoodAdd}
                        onClick={() => setSelectedProduct(item)}
                      >
                        Thêm
                      </button>
                    </div>
                  </div>
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
                </div>
              ))}
            </div>
            <Link
              href={`/${category.slug}`}
              className={styles.menufoodViewMore}
            >
              Xem chi tiết &raquo;
            </Link>
          </div>
        );
      })}
      {selectedProduct && (
        <QuickView
          product={{ ...selectedProduct, id: selectedProduct._id }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </section>
  );
}
