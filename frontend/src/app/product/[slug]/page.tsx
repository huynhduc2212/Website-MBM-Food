"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../../styles/ProductDetail.module.css";
import useCart from "../../hooks/useCart";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import { fetchNews, fetchFeaturedNews } from "../../../services/post";
import {
  addFavorite,
  removeFavorite,
  checkFavorite,
} from "@/services/Favorite";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { Heart } from "lucide-react";
import QuickView from "@/components/layout/QuickView";

interface Variant {
  option: string;
  price: number;
  sale_price: number;
  image: string;
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
interface Coupon {
  _id: string;
  code: string;
  discount: number;
}

interface Post {
  _id: string;
  title: string;
  slug: string;
  create_at: string | number | Date;
  content: string;
  imageSummary?: string;
  author: string;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [note, setNote] = useState<string>("");
  const [tintucNoibat, setTintucNoibat] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
  const [token, setToken] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);
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
  const couponConditions: Record<string, string> = {
    MBM20:
      "Áp dụng cho đơn hàng từ 200k trở lên. Không đi kèm với chương trình khác.",
    FREESHIP:
      "Áp dụng cho đơn hàng từ 300k trở lên. Không đi kèm với chương trình khác.",
    MBM50:
      "Áp dụng cho đơn hàng từ 500k trở lên. Không đi kèm với chương trình khác.",
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const [news, featuredNews] = (await Promise.all([
          fetchNews(),
          fetchFeaturedNews(),
        ])) as [Post[], Post[]];

        if (!news.length) throw new Error("Không có bài viết nào.");
        if (!featuredNews.length) throw new Error("Không có tin nổi bật.");

        setTintucNoibat(featuredNews);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    getData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products`
        );
        const data = await res.json();
        const filteredProducts = data.data.filter(
          (product: Product) => product.idcate
        );
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
  }, [token]);

  // useEffect lấy sản phẩm liên quan
  useEffect(() => {
    if (!product || !product.idcate) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products`
        );
        const data = await res.json();

        console.log("Dữ liệu sản phẩm:", data); // Kiểm tra dữ liệu trả về

        const filtered = data.data.filter(
          (p: Product) => p.idcate === product.idcate && p._id !== product._id
        );

        console.log("Sản phẩm liên quan:", filtered); // Kiểm tra sau khi lọc
        setRelatedProducts(filtered);
      } catch (err) {
        console.error("Lỗi khi tải món ăn liên quan:", err);
      }
    };

    fetchRelated();
  }, [product]);

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products/slug/${slug}`
        );
        if (!res.ok) throw new Error("Lỗi khi tải sản phẩm");
        const data = await res.json();
        setProduct(data.data);
        setSelectedVariant(data.data.variants[0]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_URL_IMAGE}/api/coupons`)
      .then((res) => res.json())
      .then((data) => setCoupons(data.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu coupon:", error));
  }, []);
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    // alert(`Đã sao chép mã: ${code}`);
    toast.success(`Đã sao chép mã: ${code}`);
  };
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) =>
      prevQuantity > 1 ? prevQuantity - 1 : prevQuantity
    );
  };
  const { handleAddToCart } = useCart();

  const handleClickAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!product || !selectedVariant) return;
    handleAddToCart(product, selectedVariant, quantity, note);
  };

  const router = useRouter();
  const handleBuyNow = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!product || !selectedVariant) return;

    const user = localStorage.getItem("user");

    if (!user) {
      toast.error("Bạn cần đăng nhập để mua ngay sản phẩm.");
      router.push("/login");
      return;
    }

    handleAddToCart(product, selectedVariant, quantity, note);
    router.push("/checkout");
  };

  if (!product || !selectedVariant) return <p>Loading...</p>;

  return (
    <div>
      {/* Phần Chi tiết */}
      <div className={styles.container}>
        <div className={styles.detailProduct}>
          <div className={styles.row}>
            <div className={styles.productLeft}>
              <div className={styles.productImage}>
                <img
                  src={`${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${selectedVariant.image}`}
                  alt={product.name}
                  width={400}
                  height={400}
                />
              </div>
              <div className={styles.voucherContainer}>
                <div>
                  <div className={styles.tittleVoucher}>
                    <span>NHẬN VOUCHER NGAY !!!</span>
                  </div>
                  <div className={styles.rowFix}>
                    {coupons.map((coupon) => (
                      <div key={coupon._id} className={styles.colFix}>
                        <span>
                          {" "}
                          Nhập mã <b className={styles.code}>
                            {coupon.code}
                          </b>{" "}
                          Giảm {coupon.discount.toLocaleString()}đ.
                          <span>{couponConditions[coupon.code]}</span>
                        </span>
                        <button
                          className={styles.voucherBtn}
                          onClick={() => copyToClipboard(coupon.code)}
                        >
                          Sao chép
                        </button>
                      </div>
                    ))}

                    <div className={styles.colNote}>
                      <span>
                        Lưu Mã và nhập ở trang <b>THANH TOÁN</b> bạn nhé!
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* PHẦN MÔ TẢ */}
              <div className={styles.descContainer}>
                <div className={styles.descTit}>
                  <p>MÔ TẢ MÓN ĂN</p>
                </div>
                <div
                  className={styles.descContent}
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            </div>
            <div className={styles.form}>
              <div className={styles.detailProduct2}>
                <div className={styles.titleProduct}>
                  <h1>{product.name}</h1>
                </div>
                <form action="#" className={styles.form}>
                  <div className={styles.price_container}>
                    <span className={styles.price}>
                      {selectedVariant.price.toLocaleString()} đ
                    </span>
                    {selectedVariant.sale_price > 0 && (
                      <>
                        <s className={styles.oldPrice}>
                          {selectedVariant.sale_price.toLocaleString()} đ
                        </s>
                        <div className={styles.savePrice}>
                          Tiết kiệm:{" "}
                          <span className={styles.savePriceValue}>
                            {(
                              selectedVariant.sale_price - selectedVariant.price
                            ).toLocaleString()}
                            đ
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className={styles.formProduct}>
                    <div className={styles.select}>
                      {product.variants.some(
                        (variant) => variant.option.trim() !== ""
                      ) && (
                        <div className={styles.swatch}>
                          <div className={styles.selectHeader}>
                            <p>
                              {product.idcate === "67b0a54db5a39baf9de36902"
                                ? "Loại"
                                : "Kích thước"}
                              :{" "}
                              <span>
                                {selectedVariant?.option || "Chưa chọn"}
                              </span>
                            </p>
                          </div>
                          <div className={styles.selectOption}>
                            {product.variants
                              .filter((variant) => variant.option.trim() !== "")
                              .map((variant) => (
                                <label
                                  key={variant.option}
                                  className={styles.selectOptionElement}
                                >
                                  <input
                                    type="checkbox"
                                    checked={
                                      selectedVariant?.option === variant.option
                                    }
                                    onChange={() => setSelectedVariant(variant)}
                                  />
                                  {variant.option}
                                </label>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className={styles.note}>
                      <label htmlFor="" className={styles.labelNote}>
                        Ghi chú
                      </label>
                      <input
                        type="text"
                        placeholder="Ghi chú món ăn"
                        className={styles.inputNote}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                      />
                    </div>
                    <div className={styles.clearForm}>
                      <div className={styles.quantity}>
                        <div className={styles.numberShow}>
                          <label htmlFor="">Số lượng</label>
                          <div className={styles.numberControl}>
                            <button
                              className={styles.btnNum}
                              onClick={decreaseQuantity}
                              type="button"
                            >
                              -
                            </button>
                            <span className={styles.quantityShow}>
                              {quantity}
                            </span>
                            <button
                              className={styles.btnNum}
                              onClick={increaseQuantity}
                              type="button"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className={styles.groupBtn}>
                        <button
                          className={styles.buyNow}
                          onClick={handleClickAddToCart}
                        >
                          Thêm vào giỏ hàng
                        </button>
                        <button
                          className={styles.booking}
                          onClick={handleBuyNow}
                        >
                          Mua Ngay
                        </button>
                      </div>
                      <div className={styles.hotline}>
                        Gọi<a href="$"> 1900 6750</a> Để được hỗ trợ ngay
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Món ăn liên quan */}
            <div className={styles.order_3}>
              {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                  <h2 className={styles.title}>Món ăn liên quan</h2>
                  <Swiper
                    key={relatedProducts.length}
                    modules={[Navigation]}
                    navigation
                    spaceBetween={20}
                    slidesPerView={4}
                    breakpoints={{
                      320: { slidesPerView: 1 },
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 4 },
                    }}
                  >
                    {relatedProducts.map((item) => (
                      <SwiperSlide key={item._id}>
                        <div className={styles.relatedItem}>
                          <div className={styles.productAction}>
                            <div className={styles.productThumnail}>
                              <Link
                                href={`/product/${item.slug}`}
                                className={styles.imageThum}
                              >
                                <img
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
                                  color={
                                    favorites[item._id] ? "#E51735" : "gray"
                                  }
                                  fill={
                                    favorites[item._id]
                                      ? "#E51735"
                                      : "transparent"
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
                                <Link
                                  className={styles.More}
                                  href={`/product/${item.slug}`}
                                >
                                  Xem thêm
                                </Link>
                              </div>
                              <div className={styles.groupForm}>
                                <div className={styles.priceBox}>
                                  <span>Giá chỉ từ: </span>{" "}
                                  {item.variants[0].price.toLocaleString()}₫
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
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </section>
              )}
            </div>

            {/* Tin tức */}
            <div className={styles.col4}>
              <div className={styles.blockBlog}>
                <h2 className={styles.title}>Tin tức nổi bật</h2>
                <div className={styles.blog_small}>
                  <ul className="aside-list">
                    {tintucNoibat.map((tintuc) => (
                      <li className={styles.aside_news_item} key={tintuc.slug}>
                        <div className={styles.block_thumb}>
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
                        <div className={styles.block_content}>
                          <Link href={`/news/${tintuc.slug}`}>
                            {tintuc.title}
                          </Link>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedProduct && (
        <QuickView
          product={{ ...selectedProduct, id: selectedProduct._id }}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};
export default ProductDetail;
