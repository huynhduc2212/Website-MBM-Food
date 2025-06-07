import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/ProductListCate.module.css";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "@/services/Favorite";
import QuickView from "../layout/QuickView";

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
  matchedVariant: Variant;
  hot: number;
  view: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  idcate: string;
  showAll?: boolean;
  minPrice?: number;
  maxPrice?: number;
  selectedSize?: string | null;
  sortOption?: "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest";
}

const ProductListCate = ({
  idcate,
  showAll = false,
  minPrice,
  maxPrice,
  selectedSize,
  sortOption,
}: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [token, setToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products/categories/${idcate}`;
        const queryParams = new URLSearchParams();

        if (minPrice !== undefined)
          queryParams.append("minPrice", String(minPrice));
        if (maxPrice !== undefined)
          queryParams.append("maxPrice", String(maxPrice));
        if (selectedSize !== undefined && selectedSize !== null)
          queryParams.append("size", selectedSize);
        if (sortOption !== undefined) queryParams.append("sort", sortOption);

        if (queryParams.toString()) url += `?${queryParams.toString()}`;

        const res = await fetch(url);
        const data = await res.json();
        let filteredProducts: Product[] = data.data;

        // **Lọc biến thể có giá phù hợp**
        filteredProducts = filteredProducts
          .map((product) => {
            const matchedVariant = product.variants.find(
              (variant) =>
                (!minPrice || variant.price >= minPrice) &&
                (!maxPrice || variant.price <= maxPrice)
            );

            return matchedVariant ? { ...product, matchedVariant } : null;
          })
          .filter(
            (product): product is Product & { matchedVariant: Variant } =>
              product !== null
          );

        // **Lọc theo size nếu có**
        if (selectedSize) {
          filteredProducts = filteredProducts.filter((product) =>
            product.variants.some((variant) => variant.option === selectedSize)
          );
        }

        // **Áp dụng sắp xếp theo sortOption**
        switch (sortOption) {
          case "price-asc":
            filteredProducts.sort(
              (a, b) => a.matchedVariant.price - b.matchedVariant.price
            );
            break;
          case "price-desc":
            filteredProducts.sort(
              (a, b) => b.matchedVariant.price - a.matchedVariant.price
            );
            break;
          case "name-asc":
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case "name-desc":
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case "newest":
            filteredProducts.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
          default:
            // Mặc định sắp xếp theo mới nhất
            filteredProducts.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            );
            break;
        }

        // ⭐ Kiểm tra nếu không có sản phẩm
        if (filteredProducts.length === 0) {
          setProducts([]);
          return;
        }

        // ⭐ Tính tổng số trang & kiểm tra currentPage hợp lệ
        const total = filteredProducts.length;
        const newTotalPages = Math.ceil(total / itemsPerPage);
        setTotalPages(newTotalPages);

        if (!showAll && currentPage > newTotalPages) {
          setCurrentPage(1);
          return;
        }

        // ⭐ Cắt trang
        const paginatedProducts = showAll
          ? filteredProducts
          : filteredProducts.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            );

        setProducts(paginatedProducts);

        if (token) {
          const favoriteStatuses: { [key: string]: boolean } = {};
          await Promise.all(
            filteredProducts.map(async (product) => {
              const result = await checkFavorite(product._id, token);
              favoriteStatuses[product._id] = result?.isFavorite || false;
            })
          );
          setFavorites(favoriteStatuses);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách sản phẩm:", error);
      }
    };
    fetchProducts();
  }, [
    token,
    idcate,
    minPrice,
    maxPrice,
    selectedSize,
    sortOption,
    currentPage,
  ]);

  const toggleFavorite = async (id: string) => {
    if (!token) {
      toast.warning("⚠ Bạn cần đăng nhập để yêu thích sản phẩm!");
      return;
    }

    try {
      if (favorites[id]) {
        await removeFavorite(id, token);
        toast.error("Đã xóa sản phẩm khỏi danh sách yêu thích!");
      } else {
        await addFavorite(id, token);
        toast.success("Đã thêm sản phẩm vào danh sách yêu thích!");
      }
      setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
    } catch (error) {
      console.error("Lỗi khi cập nhật yêu thích:", error);
      toast.error("⚠ Có lỗi xảy ra, vui lòng thử lại!");
    }
  };

  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

  if (products.length === 0) {
    return (
      <div
        style={{
          padding: "15px",
          margin: "20px 0",
          color: "#856404",
          backgroundColor: "#fff3cd",
          border: "1px solid #ffeeba",
          borderRadius: "4px",
        }}
      >
        Không có sản phẩm nào trong danh mục này.
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <section className={styles.sectionProduct}>
        <div className={styles.rowFix}>
          {products.map((item) => (
            <div className={styles.colFix} key={item._id}>
              <div className={styles.productAction}>
                <div className={styles.productThumnail}>
                  <Link
                    href={`/product/${item.slug}`}
                    className={styles.imageThum}
                  >
                    <img
                      className={styles.img}
                      src={`${API_URL}/images/${item.matchedVariant.image}`}
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
                      fill={favorites[item._id] ? "#E51735" : "transparent"}
                    />
                  </button>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>
                    <Link href={`/product/${item.slug}`}>{item.name}</Link>
                  </h3>
                  <div className={styles.productContent}>
                    <span
                      className={styles.ProductDesc}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                    <Link href={`/product/${item.slug}`}>Xem thêm</Link>
                  </div>
                  <div className={styles.groupForm}>
                    <div className={styles.priceBox}>
                      <span className={styles.titlePrice}>Giá: </span>
                      <div className="flex flex-col">
                        <span className={styles.price}>
                          {item.matchedVariant.price.toLocaleString()}₫
                        </span>
                        {item.matchedVariant.sale_price > 0 ? (
                          <span className={styles.salePrice}>
                            {item.matchedVariant.sale_price.toLocaleString()}đ
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <button
                      className={styles.add}
                      onClick={() => setSelectedProduct(item)}
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
              {item.matchedVariant.sale_price > 0 && (
                <span className={styles.bestSellingNewTag}>
                  <span>
                    -
                    {Math.round(
                      100 -
                        (item.matchedVariant.price /
                          item.matchedVariant.sale_price) *
                          100
                    )}
                    %
                  </span>
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ⭐ PHÂN TRANG */}
      {!showAll && totalPages > 1 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                border: currentPage === i + 1 ? "2px solid" : "1px solid #ccc",
                background: currentPage === i + 1 ? "#016a31" : "#fff",
                color: currentPage === i + 1 ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {selectedProduct && (
        <QuickView
          product={{ ...selectedProduct, id: selectedProduct._id }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default ProductListCate;
