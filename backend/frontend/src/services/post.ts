export interface Post {
  _id: string;
  title: string;
  slug: string;
  create_at: string | number | Date;
  summary?: string;
  content?: string;
  imageSummary?: string;
  author?: string;
  status: number; // Thêm status vào interface
  view:number;
}

// ✅ Fetch tất cả bài viết có status = 1
export const fetchNews = async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_IMAGE}/api/posts`);
    if (!res.ok) throw new Error(`Lỗi khi lấy tin tức! Mã lỗi: ${res.status}`);

    const data = await res.json();

    if (!data.posts || !Array.isArray(data.posts)) {
      throw new Error("Dữ liệu không hợp lệ hoặc thiếu 'posts'");
    }

    // 🔥 Lọc chỉ lấy bài viết có status = 1
    const filteredPosts = data.posts.filter((post: Post) => post.status === 1);

    return filteredPosts;
  } catch (error) {
    console.error("Lỗi khi fetch tin tức:", error);
    return [];
  }
};

// ✅ Fetch tin nổi bật có status = 1
export const fetchFeaturedNews = async (): Promise<Post[]> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL_IMAGE}/api/posts/newest/4`);
    if (!res.ok) throw new Error("Lỗi khi lấy tin nổi bật!");

    const data = await res.json();

    // 🔥 Lọc chỉ lấy bài viết có status = 1
    const filteredPosts = data.filter((post: Post) => post.status === 1);
    return filteredPosts;
  } catch (error) {
    console.error("Lỗi khi fetch tin nổi bật:", error);
    return [];
  }
};

// ✅ Fetch chi tiết bài viết (chỉ nếu status = 1)
export const fetchNewsDetail = async (slug: string): Promise<Post | null> => {
  if (!slug) {
    console.error("fetchNewsDetail: Slug bị thiếu");
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/posts/slug/${slug}`
    );
    if (!res.ok)
      throw new Error(`Bài viết không tồn tại! Mã lỗi: ${res.status}`);

    const data: Post = await res.json();
    console.log("Dữ liệu trả về:", data);

    // 🔥 Kiểm tra bài viết có status = 1 hay không
    if (!data || typeof data !== "object" || data.status !== 1) {
      throw new Error("Bài viết không hợp lệ hoặc không được hiển thị");
    }

    return data;
  } catch (error) {
    console.error("Lỗi khi fetch bài viết:", error);
    return null;
  }
};
export const incrementView = async (postId: string): Promise<void> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/posts/${postId}/increment-view`, // 👈 URL cụ thể
      {
        method: "PUT",
      }
    );


    if (!res.ok) {
      const errorBody = await res.text(); // 👈 Lấy nội dung lỗi từ backend
      console.error("Không thể tăng lượt xem. Mã lỗi:", res.status, "Chi tiết:", errorBody);
      return;
    }

    console.log("✅ Lượt xem đã được tăng!");
  } catch (error) {
    console.error("❌ Lỗi khi gọi API tăng lượt xem:", error);
  }
};

