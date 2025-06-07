import { useState, useEffect } from "react";
import { toast } from "react-toastify";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  sale_price: number;
  option: string;
  image: string;
  quantity: number;
  note?: string;
}

interface Product {
  _id: string;
  slug: string;
  name: string;
  variants: Variant[];
}

interface Variant {
  price: number;
  sale_price: number;
  option: string;
  image: string;
}

const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load giỏ hàng từ localStorage khi component mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Lưu giỏ hàng vào localStorage khi state thay đổi
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated")); // 🔥 Phát sự kiện
      }, 0);
    }
  }, [cart]);


  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (cartItem) => cartItem._id === item._id && cartItem.option === item.option
      );

      let updatedCart;
      if (existingItemIndex !== -1) {
        updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += item.quantity;

        // ✅ Nếu có ghi chú mới, cập nhật luôn
      if (item.note) {
        updatedCart[existingItemIndex].note = item.note;
      }
      
      } else {
        updatedCart = [...prevCart, item];
      }

      // 🔥 Lưu giỏ hàng vào localStorage
      localStorage.setItem("cart", JSON.stringify(updatedCart));

      // 🔥 Phát sự kiện cập nhật giỏ hàng
      setTimeout(() => {
        window.dispatchEvent(new Event("cartUpdated"));
      }, 0);

      return updatedCart;
    });

    toast.success("Đã thêm vào giỏ hàng!");
  };

  // Hàm xử lý khi ấn nút "Thêm vào giỏ hàng"
  const handleAddToCart = (product: Product, selectedVariant: Variant, quantity: number, note?:string) => {
    if (!product || !selectedVariant) return;

    const newItem: CartItem = {
      _id: product._id, 
      name: product.name,
      price: selectedVariant.price,
      sale_price: selectedVariant.sale_price,
      option: selectedVariant.option,
      image: selectedVariant.image,
      quantity: quantity,
      note: note,
    };

    addToCart(newItem);
  };

  return { cart, addToCart, handleAddToCart };
};

export default useCart;
