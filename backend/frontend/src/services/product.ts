// services/productService.ts
export const fetchProducts = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_URL_IMAGE}/api/products`);

    if (!response.ok) {
      throw new Error(`Lỗi HTTP! Mã trạng thái: ${response.status}`);
    }

    const data = await response.json();

    if (data && Array.isArray(data.data)) {
      return data.data; // Trả về danh sách sản phẩm
    } else {
      console.error("Dữ liệu từ API không đúng định dạng mong đợi:", data);
      return [];
    }
  } catch (error) {
    console.error("Lỗi khi tải sản phẩm:", error);
    return [];
  }
};
