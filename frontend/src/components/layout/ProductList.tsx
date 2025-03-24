import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../../styles/ProductList.module.css";
import { addFavorite, removeFavorite, checkFavorite } from "@/services/Favorite";
import QuickView from "./QuickView";

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
  hot: number;
  view: number;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ProductListProps {
  idcate: string;
}

const ProductList = ({ idcate }: ProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [token, setToken] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3001/api/products/");
        const data = await res.json();
        const filteredProducts = data.data.filter((product: Product) => product.idcate === idcate);
        setProducts(filteredProducts.slice(0, 10));

        if (token) {
          const favoriteStatuses: { [key: string]: boolean } = {};
          await Promise.all(
            filteredProducts.map(async (product: Product) => {
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
  }, [token, idcate]);

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

  return (
    <div className={styles.container}>
      <section className={styles.sectionProduct}>
        <div className={styles.rowFix}>
          {products.map((item) => (
            <div className={styles.colFix} key={item._id}>
              <div className={styles.productAction}>
                <div className={styles.productThumnail}>
                  <Link href={`/product/${item.slug}`} className={styles.imageThum}>
                    <Image
                      className={styles.img}
                      src={`${API_URL}/images/${item.variants[0].image}`}
                      alt={item.name}
                      width={234}
                      height={234}
                    />
                  </Link>
                  <button className={styles.whistList} onClick={() => toggleFavorite(item._id)}>
                    <Heart
                      size={20}
                      color={favorites[item._id] ? "#E51735" : "gray"}
                      fill={favorites[item._id] ? "#E51735" : "transparent"}
                    />
                  </button>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>
                    <Link href={`/product/${item.slug}`} className={styles.productName}>
                      {item.name}
                    </Link>
                  </h3>
                  <div className={styles.productContent}>
                    <span className={styles.ProductDesc} dangerouslySetInnerHTML={{ __html: item.description }} />
                    <Link href={`/product/${item.slug}`}>Xem thêm</Link>
                  </div>
                  <div className={styles.groupForm}>
                    <div className={styles.priceBox}>
                      <span>Giá chỉ từ: </span> {item.variants[0].price.toLocaleString()}₫
                    </div>
                    <button className={styles.add} onClick={() => setSelectedProduct(item)}>
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {selectedProduct && <QuickView product={{ ...selectedProduct, id: selectedProduct._id }} onClose={() => setSelectedProduct(null)} />}
      {/* <ToastContainer position="top-right" autoClose={2000} /> */}
    </div>
  );
};

export default ProductList;
