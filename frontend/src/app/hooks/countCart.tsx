import { useState, useEffect } from "react";

export default function useCart() {
  const [cartCount, setCartCount] = useState<number>(0);

  // Hàm lấy số lượng sản phẩm trong giỏ hàng
  const getCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.reduce((total: number, item: { quantity: number }) => total + item.quantity, 0);
    } catch (error) {
      console.error("Lỗi khi lấy giỏ hàng từ localStorage:", error);
      return 0;
    }
  };

  // Cập nhật số lượng khi giỏ hàng thay đổi
  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  useEffect(() => {
    // Cập nhật ngay khi component mount
    updateCartCount();

    // Lắng nghe sự kiện cập nhật giỏ hàng từ ứng dụng
    window.addEventListener("cartUpdated", updateCartCount);

    // Lắng nghe thay đổi từ localStorage (khi thay đổi từ tab khác)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        updateCartCount();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return cartCount;
}
