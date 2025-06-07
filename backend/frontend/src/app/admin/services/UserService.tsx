const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/user`;

const getAllUsers = async (page = 1, limit = 5) => {
  const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
  return response.json();
};

const getUserById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
};

const deleteUser = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

const register = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  return response.json();
};

const login = async (email, password) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return response.json();
};

const updateUser = async (id, updateData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  return response.json();
};

const findUserByName = async (username) => {
  const response = await fetch(`${API_URL}/search?username=${username}`);
  const data = await response.json();

  // Giả sử API trả về: { user: {...} } hoặc { users: [...] } hoặc null
  if (Array.isArray(data.users)) {
    return data.users; // nếu trả về dạng danh sách
  }

  if (data.user) {
    return [data.user]; // nếu trả về 1 user
  }

  return []; // nếu không tìm thấy
};


const toggleUserStatus = async (id) => {
  console.log(
    `🔄 Toggling status for ID: ${id}, URL: ${API_URL}/toggle-active/${id}`
  );

  try {
    const response = await fetch(`${API_URL}/toggle-active/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle status: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("✅ API response:", data);
    return data.user;
  } catch (error) {
    console.error("❌ Error toggling user status:", error);
    return null;
  }
};

export default {
  getAllUsers,
  getUserById,
  deleteUser,
  register,
  login,
  updateUser,
  findUserByName,
  toggleUserStatus,
};
