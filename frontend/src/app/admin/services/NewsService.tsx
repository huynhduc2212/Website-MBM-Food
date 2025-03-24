const API_URL = "http://localhost:3001/api/posts";

const getAllNews = async (page: number = 1, limit: number = 5) => {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error("Lỗi khi lấy danh sách bài viết:", error);
        throw error;
    }
};

const getNewsById = async (id: string) => {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
};

const addNews = async (newsData: any) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
    });
    return response.json();
};

const updateNews = async (id: string, newsData: any) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsData),
    });
    return response.json();
};

const deleteNews = async (id: string) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

const searchNewsByTitle = async (title: string) => {
    const response = await fetch(`${API_URL}/search?title=${title}`);
    return response.json();
};

// 🆕 API kích hoạt bài viết
const activateNews = async (id: string, status: number) => {
    const response = await fetch(`${API_URL}/activate/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) throw new Error(`Lỗi ${response.status}: ${response.statusText}`);

    return response.json();
};

export default { 
    getAllNews, 
    getNewsById, 
    addNews, 
    updateNews, 
    deleteNews, 
    searchNewsByTitle, 
    activateNews // ✅ Đã thêm API kích hoạt bài viết
};
