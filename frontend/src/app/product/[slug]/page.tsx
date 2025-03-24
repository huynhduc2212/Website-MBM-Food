"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../../../styles/ProductDetail.module.css";
import useCart from "../../hooks/useCart";

interface Variant {
  option: string;
  price: number;
  sale_price: number;
  image: string;
}

interface Product {
  _id: string;
  id: string;
  name: string;
  description: string;
  slug: string;
  variants: Variant[];
  idcate: string;
}
interface Coupon {
  _id: string;
  code: string;
  discount: number;
}

const ProductDetail = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  
  const couponConditions: Record<string, string> = {
    MBM20:
      "Áp dụng cho đơn hàng từ 200k trở lên. Không đi kèm với chương trình khác.",
    FREESHIP:
      "Áp dụng cho đơn hàng từ 300k trở lên. Không đi kèm với chương trình khác.",
    MBM50:
      "Áp dụng cho đơn hàng từ 500k trở lên. Không đi kèm với chương trình khác.",
  };

  useEffect(() => {
    if (!slug) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3001/api/products/slug/${slug}`
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
    fetch("http://localhost:3001/api/coupons")
      .then((res) => res.json())
      .then((data) => setCoupons(data.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu coupon:", error));
  }, []);
  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
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
    handleAddToCart(product, selectedVariant, quantity);
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
                <Image
                  src={`http://localhost:3001/images/${selectedVariant.image}`}
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
                  <div className={styles.price}>
                    <p>
                      {selectedVariant.sale_price > 0
                        ? selectedVariant.sale_price
                        : selectedVariant.price.toLocaleString()}{" "}
                      đ
                    </p>
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
                              .filter((variant) => variant.option.trim() !== "") // Lọc các option rỗng
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

                        <div className={styles.addCart}>
                          <button
                            className={styles.add}
                            onClick={handleClickAddToCart}
                          >
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                      <div className={styles.groupBtn}>
                        <button className={styles.buyNow}>Mua Ngay</button>
                        <button className={styles.booking}>Đặt bàn</button>
                      </div>
                      <div className={styles.hotline}>
                        Gọi<a href="$">123456</a>Để được hỗ trợ ngay
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={styles.order_3}>
              <div className={styles.product_lq}>
                <h3 className={styles.title}>
                  <a href="" className={styles.titleName} title="Món ăn liên quan">Món ăn liên quan</a>
                  <div className={styles.fix_swipper_border}>
                    <div className={styles.swiper_wrapper}>
                                
                    </div>
                  </div>
                </h3>
              </div>
            </div>
            <div className="order_4">
              <div className="blog"></div>
              <a href=""></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
