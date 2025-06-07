// import { TCreateCategoryParams } from "../types";

const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/categories`;
const getAllCategories = async () => {
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

const createCategory = async (formData: FormData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Lỗi khi tạo danh mục: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tạo danh mục:", error);
  }
};

const deleteCategory = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Xóa danh mục thất bại");
  return response.json();
};

const getCategoryById = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) throw new Error("Lấy danh mục thất bại");
  return response.json();
};

const getCategoryBySlug = async (slug: string) => {
  const response = await fetch(`${API_URL}/slug/${slug}`);
  if (!response.ok) throw new Error("Lấy danh mục thất bại");
  return response.json();
};

const updateCategory = async (id: string, data: FormData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: data,
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật danh mục:", error);
    return null;
  }
};

const CategoryServices = {
  getAllCategories,
  createCategory,
  deleteCategory,
  getCategoryById,
  updateCategory,
  getCategoryBySlug,
};

export default CategoryServices;
