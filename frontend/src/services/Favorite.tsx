const API_URL = "http://localhost:3001/api/favorite";

const fetchAPI = async (url: string, options: RequestInit) => {
    try {
        const response = await fetch(url, options).catch(() => {
            throw new Error("Network error");
        });

        if (response?.status === 403) {
            return { error: true, message: "Forbidden" }; // Không in lỗi vào console
        }

        if (!response?.ok) {
            throw new Error(`Lỗi: ${response?.status} - ${response?.statusText}`);
        }

        return await response.json();
    } catch (error) {
        if (error instanceof Error && !error.message.includes("403")) {
            console.error("Lỗi API:", error.message);
        }
        return { error: true, message: error instanceof Error ? error.message : "Lỗi không xác định" };
    }
};


export const addFavorite = async (id_product: string, token: string) => {
    const result = await fetchAPI(`${API_URL}/add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_product }),
    });

    // ✅ Nếu lỗi 403, không log lỗi và trả về `{ success: false }`
    if (result.error && result.status === 403) {
        return { success: false };
    }

    return result;
};

export const getFavorites = async (token: string) => {
    const result = await fetchAPI(`${API_URL}/list`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Nếu lỗi 403, trả về danh sách rỗng `[]`
    if (result.error && result.status === 403) {
        return [];
    }

    return result;
};

export const removeFavorite = async (id_product: string, token: string) => {
    const result = await fetchAPI(`${API_URL}/remove/${id_product}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Nếu lỗi 403, không log lỗi và trả về `{ success: false }`
    if (result.error && result.status === 403) {
        return { success: false };
    }

    return result;
};

export const checkFavorite = async (id_product: string, token: string) => {
    const result = await fetchAPI(`${API_URL}/check/${id_product}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    // ✅ Nếu lỗi 403, trả về `{ isFavorite: false }`
    if (result.error && result.status === 403) {
        return { isFavorite: false };
    }

    return result;
};
