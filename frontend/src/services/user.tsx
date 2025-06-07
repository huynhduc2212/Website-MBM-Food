const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user`;

const fetchAPI = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({})); // Xử lý lỗi JSON
      throw new Error(
        `Lỗi: ${response.status} - ${errorData.message || response.statusText}`
      );
    }
    return await response.json().catch(() => ({})); // Trả về JSON hoặc object rỗng
  } catch (error) {
    console.error("Lỗi API:", error);
    return {
      error: true,
      message: error instanceof Error ? error.message : "Lỗi không xác định",
    };
  }
};

export const registerUser = async (userData: object) => {
  return fetchAPI(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
};

export const loginUser = async (email: string, password: string) => {
  return fetchAPI(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
};

export const logoutUser = async () => {
  return fetchAPI(`${API_URL}/logout`, { method: "POST" });
};

export const getAllUsers = async (page: number = 1, limit: number = 5) => {
  return fetchAPI(`${API_URL}?page=${page}&limit=${limit}`, {});
};

export const findUserByName = async (username: string) => {
  return fetchAPI(`${API_URL}/search?username=${username}`, {});
};

export const updateUser = async (
  userId: string,
  updateData: object,
  token: string
) => {
  return fetchAPI(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
};

export const updatePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) {
    throw new Error("Bạn chưa đăng nhập.");
  }

  const response = await fetch(`${API_URL}/update-password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, oldPassword, newPassword }),
  });

  if (!response.ok) {
    let errorMessage = `Lỗi: ${response.status}`;
    try {
      const errorData = await response.json();
      errorMessage += ` - ${errorData.message}`;
    } catch {
      errorMessage += " - Lỗi không xác định.";
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const deleteUser = async (userId: string, token: string) => {
  return fetchAPI(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const addAddress = async (
  userId: string,
  address: object[],
  token: string
) => {
  console.log("userId:", userId);
  console.log("addresses:", address);
  console.log("token:", token);

  if (!userId || !Array.isArray(address) || address.length === 0) {
    throw new Error("User ID và danh sách địa chỉ không được để trống");
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user/add-address`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ address }), // ✅ Gửi dưới dạng mảng
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Thêm địa chỉ thất bại");
  }

  return await response.json();
};

// Cập nhật địa chỉ (đúng chuẩn của addAddress)
export const updateAddress = async (
  userId: string,
  addressId: string,
  updatedAddress: object,
  token: string
) => {
  return fetchAPI(
    `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user/${userId}/address/${addressId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedAddress), // ✅ Gửi object, không phải array
    }
  );
};

export const getUserById = async (userId: string) => {
  return fetchAPI(`${API_URL}/${userId}`, {});
};
