"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { addFavorite, getFavorites, removeFavorite } from "../../services/Favorite";
import styles from "../../styles/Favorite.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useCart from "../hooks/useCart";
import Link from "next/link";
import { Modal, Button } from "react-bootstrap"; // Import Modal Bootstrap

interface Product {
  _id: string;
  name: string;
  slug: string;
  idcate: string;
  variants: { option: string; price: number; sale_price: number; image: string }[];
  hot: number;
  view: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

const FavoritePage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false); // Kiểm soát hiển thị modal
  const router = useRouter();
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!token) {
        setShowModal(true); // Hiển thị modal khi chưa đăng nhập
        return;
      }

      try {
        const data = await getFavorites(token);
        console.log("Dữ liệu API trả về:", data);

        if (Array.isArray(data)) {
          const formattedFavorites = data.map((fav) => fav.id_product).filter(Boolean);
          setFavorites(formattedFavorites);
        } else {
          console.error("Dữ liệu API không hợp lệ:", data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
      }
    };

    fetchFavorites();
  }, [token]);

  const toggleFavorite = async (productId: string) => {
    if (!token) {
      setShowModal(true); // Hiển thị modal khi chưa đăng nhập
      return;
    }

    const isFavorite = favorites.some((fav) => fav._id === productId);
    const result = isFavorite
      ? await removeFavorite(productId, token)
      : await addFavorite(productId, token);

    if (!result.error) {
      setFavorites((prev) =>
        isFavorite
          ? prev.filter((p) => p._id !== productId)
          : [...prev, result.newFavorite]
      );
      toast.success(
        isFavorite ? "Đã xóa khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        }
      );
    }
  };

  const { handleAddToCart } = useCart();

  const handleClickAddToCart = (product: Product) => {
    if (!product || product.variants.length === 0) return;

    const selectedVariant = product.variants[0];
    handleAddToCart(product, selectedVariant, 1);
    
  };

  return (
    <div className={`container mt-4 ${styles.favoriteContainer}`}>
      <h2 className={`mb-4 ${styles.favtile}`}>Danh sách yêu thích</h2>

      {favorites.length === 0 ? (
        <p className="text-center">Chưa có sản phẩm yêu thích.</p>
      ) : (
        <div className="row">
          {favorites.map((product) => (
            <div key={product._id} className="col-md-3 col-sm-6 mb-4">
              <div className={`card border-1 shadow-sm ${styles.productCard}`}>
                <i
                  className={`${styles.favoriteIcon} position-absolute top-0 end-0 p-2`}
                  onClick={() => toggleFavorite(product._id)}
                >
                  <button className="border-0">
                    <Heart size={20} color="#E51735" fill="#E51735" />
                  </button>
                </i>

                <Link href={`/product/${product.slug}`} passHref legacyBehavior>
                  <a style={{ textDecoration: "none", color: "inherit" }}>
                    {product.variants[0]?.image && (
                      <div className={`${styles.productImageWrapper}`}>
                        <img
                          src={product.variants[0].image.startsWith("http")
                            ? product.variants[0].image
                            : `${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${product.variants[0].image}`
                          }
                          alt={product.name}
                          width={300}
                          height={300}
                          className={`${styles.productImage}`}
                        
                        />
                      </div>
                    )}

                    <div className="card-body flex-grow-1 d-flex flex-column p-2">
                      <h5 className={`${styles.productTitle} mb-1`}>{product.name}</h5>
                    </div>
                  </a>
                </Link>

                <div
                  className={`${styles.productDescription}`}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                ></div>

                <div className={`card-footer bg-white border-0 d-flex justify-content-between align-items-center p-2 ${styles.productFooter}`}>
                  <div>
                    <p className="fw-bold mb-1">Giá chỉ từ</p>
                    <p className="text-danger fw-bold">
                      {product.variants[0]?.price?.toLocaleString()}₫
                    </p>
                  </div>
                  <button className="btn btn-success btn-sm" onClick={() => handleClickAddToCart(product)}>Thêm</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal thông báo yêu cầu đăng nhập */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu đăng nhập</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Bạn cần đăng nhập để sử dụng tính năng này.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tiếp tục xem
          </Button>
          <Button variant="primary" onClick={() => router.push("/login")}>
            Đăng nhập ngay
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FavoritePage;
