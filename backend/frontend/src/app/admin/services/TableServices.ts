import { TCreateTableParams } from "../types";

const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/tables`;

const createTable = async (formData: FormData) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Lỗi khi tạo mã giảm giá: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi tạo mã giảm giá:", error);
    throw error;
  }
};

const getAllTables = async () => {
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

const getTableById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
};

const updateTable = async (id: string, formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      body: formData,
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật bàn ăn:", error);
    return null;
  }
};

const deleteTable = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Xóa bàn thất bại");
  return response.json();
};

const updateTableStatus = async (id: string, status: string) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status,
    }),
  });

  if (!response.ok) {
    throw new Error("Lỗi khi cập nhật trạng thái bàn ăn");
  }

  return await response.json();
};

const TableServices = {
  createTable,
  getAllTables,
  getTableById,
  updateTable,
  deleteTable,
  updateTableStatus,
};
export default TableServices;
