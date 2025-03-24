import React, { useState } from "react";
import Image from "next/image";
import styles from "../../styles/QuickView.module.css";
import useCart from "../../app/hooks/useCart";

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

interface QuickViewProps {
  product: Product;
  onClose: () => void;
}

const QuickView: React.FC<QuickViewProps> = ({ product, onClose }) => {
  const initialVariant = product?.variants.length > 0 ? product.variants[0] : null;
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(initialVariant);
  const [quantity, setQuantity] = useState<number>(1);

  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : prev));

  const { handleAddToCart } = useCart();

  const handleClickAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (!product || !selectedVariant) return;
  
    handleAddToCart(product, selectedVariant, quantity);
  };
  
  const handleClose = () => {
    onClose();
  };

  if (!product || !selectedVariant) return <p>Loading...</p>;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
      <button className={styles.closeButton} onClick={handleClose}>✖</button>

        <div className={styles.content}>
          <Image
            src={`http://localhost:3001/images/${selectedVariant.image}`}
            alt={product.name}
            width={400}
            height={400}
          />
          <div className={styles.form}>
            <div className={styles.detailProduct2}>
              <h1 className={styles.titleProduct}>{product.name}</h1>
              <div className={styles.price}>
                <p>
                  {selectedVariant.sale_price > 0
                    ? selectedVariant.sale_price
                    : selectedVariant.price.toLocaleString()}{" "}đ
                </p>
              </div>

              {/* Chọn kích thước */}
              {product.variants.some((v) => v.option.trim() !== "") && (
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
                    {product.variants.map((variant) => (
                      <label key={variant.option}>
                        <input
                          type="radio"
                          name="variant"
                          checked={selectedVariant.option === variant.option}
                          onChange={() => setSelectedVariant(variant)}
                        />
                        {variant.option}
                      </label>
                    ))}
                  </div>
                </div>
              )}
              <label className={styles.labelNote}>Ghi chú</label>
              <input type="text" placeholder="Ghi chú món ăn" className={styles.inputNote} />

              <div className={styles.quantity}>
                <label>Số lượng</label>
                <div className={styles.numberControl}>
                  <button className={styles.btnNum} onClick={decreaseQuantity}>-</button>
                  <span className={styles.quantityShow}>{quantity}</span>
                  <button className={styles.btnNum} onClick={increaseQuantity}>+</button>
                </div>
              </div>

              <button className={styles.add} onClick={handleClickAddToCart}>
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickView;
