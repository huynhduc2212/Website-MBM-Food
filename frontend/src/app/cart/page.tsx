"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../../styles/CartPage.module.css";
import CartIcon from "@/components/ui/empty";
import { useRouter } from "next/navigation";

interface CartItem {
  _id: string; 
  name: string;
  price: number;
  sale_price?: number;
  quantity: number;
  image: string;
  variants?: string;
}

const CartPage = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
      if (!Array.isArray(storedCart)) throw new Error("Invalid cart data");
  
      const formattedCart = storedCart.map((item: any) => ({
        _id: item._id || "", 
        name: item.name || "Sản phẩm không tên",
        price: item.price || 0,
        sale_price: item.sale_price || 0,
        quantity: item.quantity || 1,
        image: item.image || "default.jpg",
        variants: item.option ? item.option : undefined,
      }));
  
      setCart(formattedCart);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ localStorage:", error);
      setCart([]);
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    // 🔥 Phát sự kiện cập nhật
    window.dispatchEvent(new Event("cartUpdated")); 
  };

  const increaseQuantity = (_id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const newCart = cart.map((item) =>
      item._id === _id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateCart(newCart);
  };

  const decreaseQuantity = (_id: string, event: React.MouseEvent) => {
    event.preventDefault();
    const newCart = cart.map((item) =>
      item._id === _id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    updateCart(newCart);
  };

  const removeItem = (_id: string) => {
    const newCart = cart.filter((item) => item._id !== _id);
    updateCart(newCart);
    // 🔥 Phát sự kiện cập nhật
    window.dispatchEvent(new Event("cartUpdated")); 
  };

  const getTotalPrice = () => {
    return cart.reduce(
      (total, item) =>
        total + (item.sale_price && item.sale_price > 0 ? item.sale_price : item.price) * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    try {
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : null;

      if (user && user.isLoggedIn) {
        router.push("../checkout");
      } else {
        router.push("../login");
      }
    } catch (error) {
      console.error("Lỗi khi parse JSON:", error);
      router.push("../login");
    }
  };

  return (
    <div className={styles.container}>
      <section className={styles.mainCartPage}>
        <div className={styles.mainContainer}>
          <div className={styles.wrapBackGround}>
            <div className={styles.headerCart}>
              <div className={styles.titleBlockPage}>
                <h1 className={styles.titleCart}></h1>
              </div>
            </div>

            {cart.length > 0 ? (
              <div className={styles.row}>
                <div className={styles.cartLeft}>
                  <div className={styles.cartHeaderInfo}>
                    <div>Thông tin sản phẩm</div>
                    <div>Đơn giá</div>
                    <div>Số lượng</div>
                    <div>Thành tiền</div>
                  </div>
                  {cart.map((item) => (
                    <div key={item._id} className={styles.cartBody}>
                      <div className={styles.ajaxCartRow}>
                        <div className={styles.ajaxCartProduct}>
                          <Image
                            className={styles.ajaxImage}
                            src={`http://localhost:3001/images/${item.image}`}
                            alt={item.name}
                            width={100}
                            height={100}
                          />
                          <div className={styles.gridItemInfo}>
                            <div className={styles.cartName}>
                              <a className={styles.ProductName}>{item.name}</a>
                              {item.variants && (
                                <span className={styles.VariantTitle}>{item.variants}</span>
                              )}
                              <button
                                className={styles.removebtn}
                                onClick={() => removeItem(item._id)}
                              >
                                Xóa
                              </button>
                            </div>
                            <div className={styles.grid}>
                              <div className={styles.cartPrice}>
                                <span className={styles.price}>
                                  {item.sale_price && item.sale_price > 0
                                    ? item.sale_price
                                    : item.price.toLocaleString()} đ
                                </span>
                              </div>
                            </div>
                            <div className={styles.grid}>
                              <div className={styles.cartSelect}>
                                <div className={styles.qtyBtnCart}>
                                  <button
                                    className={styles.qtybtn}
                                    onClick={(e) => decreaseQuantity(item._id, e)}
                                  >
                                    -
                                  </button>
                                  <span className={styles.textQty}>{item.quantity}</span>
                                  <button
                                    className={styles.qtybtn}
                                    onClick={(e) => increaseQuantity(item._id, e)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className={styles.grid}>
                              <div className={styles.cartPrice}>
                                <span className={styles.price}>
                                  {((item.sale_price && item.sale_price > 0 ? item.sale_price : item.price) * item.quantity).toLocaleString()} đ
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className={styles.cartFooter}>
                    <div className={styles.offSet}>
                      <div className={styles.subTotal}>
                        <div className={styles.cartSubTotal}>
                          <div className={styles.cartCol}>Tổng tiền:</div>
                          <div className={styles.textRight}>
                            <span className={styles.totalPrice}>
                              {getTotalPrice().toLocaleString()} đ
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className={styles.checkOut}>
                        <button 
                          className={styles.cartBtnCheckOut}
                          onClick={handleCheckout}
                        >
                          Thanh toán
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.Empty}>
                <CartIcon />
                <p>Giỏ hàng của bạn đang trống.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default CartPage;
