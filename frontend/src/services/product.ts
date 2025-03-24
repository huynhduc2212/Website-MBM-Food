// services/productService.ts
export const fetchProducts = async () => {
  try {
    const response = await fetch("http://localhost:3001/api/products");

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