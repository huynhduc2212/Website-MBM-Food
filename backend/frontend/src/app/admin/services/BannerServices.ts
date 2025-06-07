const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/banners`;

const getAllBanners = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
};

const createBanner = async (formData: FormData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi tạo banner: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tạo banner:", error);
  }
};

const deleteBanner = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Xóa banner thất bại");
  return response.json();
};

const getByIdBanner = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Lấy banner thất bại");
  return response.json();
};

const updateBanner = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: data,
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật banner:", error);
    return null;
  }
};

const BannerServices = {
  getAllBanners,
  createBanner,
  deleteBanner,
  getByIdBanner,
  updateBanner,
};

export default BannerServices;
