const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/registers`;

const getAllRegisters = async () => {
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

const updateRegisterStatus = async (id: string, cancel_reason: string) => {
  const response = await fetch(`${API_URL}/${id}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      cancel_reason,
    }),
  });

  if (!response.ok) {
    throw new Error("Lỗi khi cập nhật trạng thái bàn ăn");
  }

  return await response.json();
};

const RegisterServices = {
  getAllRegisters,
  // getTableById,
  updateRegisterStatus,
};
export default RegisterServices;
