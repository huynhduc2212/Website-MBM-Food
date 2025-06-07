export const checkTokenValidity = async (token: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/auth/check-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 403) return { valid: false }; // Không in lỗi nếu 403

    if (!response.ok) {
      throw new Error("Token không hợp lệ hoặc đã hết hạn");
    }

    return await response.json();
  } catch (error) {
    console.log("🚀 ~ checkTokenValidity ~ error:", error)
    return { valid: false }; // Không in lỗi ra console
  }
};
