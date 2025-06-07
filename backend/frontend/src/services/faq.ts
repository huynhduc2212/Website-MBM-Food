const API_URL_USER = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user`;
const API_URL_REGISTER = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/registers`;

export const sendEmail = async (formData: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/emailCustomer/send-email`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return { success: true, message: "✅ Bạn đã gửi tin nhắn thành công!" };
    } else {
      console.error(result.error);
      return { success: false, message: "❌" + result.error };
    }
  } catch (error) {
    console.error("❌ Lỗi khi gọi API:", error);
    return {
      success: false,
      message: "❌ Có lỗi xảy ra, vui lòng thử lại sau!",
    };
  }
};
// Lấy thông tin người dùng theo ID
const getUserById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL_USER}/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
};

// Lấy danh sách các yêu cầu đăng ký của người dùng
const getRegistersByUser = async (userId: string) => {
  try {
    const response = await fetch(`${API_URL_REGISTER}/user/${userId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu:", error);
  }
};

const FaqServices = {
  getUserById,
  getRegistersByUser,
};

export default FaqServices;
