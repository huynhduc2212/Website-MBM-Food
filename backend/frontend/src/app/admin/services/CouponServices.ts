import { TCreateCouponParams } from "../types";

const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/coupons`;

const createCoupon = async (couponData: TCreateCouponParams) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
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

const getAllCoupons = async () => {
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

const getCouponById = async (id: string) => {
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

const updateCoupon = async (id: string, couponData: TCreateCouponParams) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(couponData),
    });
    return await response.json();
  } catch (error) {
    console.error("Lỗi khi cập nhật sản phẩm:", error);
    return null;
  }
};

const deleteCoupon = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Xóa mã giảm giá thất bại");
  return response.json();
};

const updatedStatusCoupon = async (id: string, status: string) => {
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
    throw new Error("Lỗi khi cập nhật trạng thái sản phẩm");
  }

  return await response.json();
};

const CouponServices = {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  updatedStatusCoupon,
};
export default CouponServices;
