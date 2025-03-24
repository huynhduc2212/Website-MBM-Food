"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import newsService from "../services/NewsService";
import slugify from "slugify";

// Import ReactQuill với dynamic import để tránh lỗi Next.js SSR
const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
}) as unknown as React.FC<{
  value: string;
  onChange: (value: string) => void;
  modules?: Record<string, any>;
  className?: string;
}>;

// Interface dữ liệu bài viết
interface PostData {
  id?: string;
  author: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageSummary: string;
  status: boolean;
  hot: boolean; // 🔥 Thêm trạng thái bài viết hot
}

// Interface props cho component EditPost
interface EditPostProps {
  id: string;
  onClose: () => void;
  onSuccess: () => void;
}

// 📝 Quill modules cho nội dung bài viết
const fullModules: Record<string, any> = {
  toolbar: {
    container: [
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote"],
      [{ align: [] }],
      [{ header: "1" }, { header: "2" }, { font: [] }],
    ],
    handlers: {
      image: function (this: any) {
        const editor = this.quill;
        const imageUrl = prompt("Nhập URL của hình ảnh:");
        if (imageUrl) {
          const range = editor.getSelection();
          editor.insertEmbed(range.index, "image", imageUrl);
        }
      },
    },
  },
};

// 📝 Quill modules cho tóm tắt bài viết
const textOnlyModules: Record<string, any> = {
  toolbar: [["bold", "italic", "underline"], ["blockquote"]],
};

// 🖼️ Quill modules cho hình ảnh tóm tắt
const imageOnlyModules: Record<string, any> = {
  toolbar: {
    container: [["image"]],
    handlers: {
      image: function (this: any) {
        const editor = this.quill;
        const imageUrl = prompt("Nhập URL của hình ảnh:");
        if (imageUrl) {
          editor.setContents([{ insert: { image: imageUrl } }]); // Chỉ chèn hình ảnh
        }
      },
    },
  },
};

export default function EditPost({ id, onClose, onSuccess }: EditPostProps) {
  const [post, setPost] = useState<PostData>({
    author: "",
    title: "",
    slug: "",
    content: "",
    summary: "",
    imageSummary: "",
    status: false,
    hot: false, // 🔥 Mặc định không phải bài viết hot
  });

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      try {
        const postData = await newsService.getNewsById(id);
        setPost({
          author: postData.author,
          title: postData.title,
          slug: postData.slug,
          content: postData.content,
          summary: postData.summary,
          imageSummary: postData.imageSummary,
          status: Boolean(postData.status), // Ép kiểu về boolean
          hot: Boolean(postData.hot), // 🔥 Ép kiểu hot về boolean
        });

      } catch (error) {
        console.error("Lỗi tải bài viết", error);
      }
    }
    fetchPost();
  }, [id]);

  const handleChange = (key: keyof PostData, value: string | boolean) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await newsService.updateNews(id, {
        ...post,
        status: post.status ? 1 : 0, // ✅ Chuyển đổi thành 1/0 để lưu vào DB
        hot: post.hot ? 1 : 0, // 🔥 Chuyển đổi hot thành 1/0
      });
      
      alert("Bài viết đã được cập nhật!");
      onSuccess();
      onClose();
    } catch (error) {
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-white shadow rounded">
      <h1 className="text-center text-2xl font-bold mb-4">Chỉnh Sửa Bài Viết</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên người đăng bài"
          className="w-full p-2 border rounded mb-3"
          value={post.author}
          onChange={(e) => handleChange("author", e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tiêu đề"
          className="w-full p-2 border rounded mb-3"
          value={post.title}
          onChange={(e) => {
            handleChange("title", e.target.value);
            handleChange("slug", slugify(e.target.value, { lower: true }));
          }}
          required
        />
        <input
          type="text"
          placeholder="Slug URL"
          className="w-full p-2 border rounded mb-3"
          value={post.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          required
        />

        <label className="block font-bold mb-2">Nội dung bài viết:</label>
        <ReactQuill
          value={post.content}
          onChange={(val: string) => handleChange("content", val)}
          modules={fullModules}
          className="mb-4"
        />

        <label className="block font-bold mb-2">Tóm tắt bài viết:</label>
        <ReactQuill
          value={post.summary}
          onChange={(val: string) => handleChange("summary", val)}
          modules={textOnlyModules}
          className="mb-4"
        />

        <label className="block font-bold mb-2">Hình ảnh tóm tắt:</label>
        <ReactQuill
          value={post.imageSummary}
          onChange={(val: string) => handleChange("imageSummary", val)}
          modules={imageOnlyModules}
          className="mb-4"
        />

        <label className="block font-bold mb-2 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={post.status}
            onChange={(e) => handleChange("status", e.target.checked)}
          />
          Kích hoạt bài viết
        </label>

        <label className="block font-bold mb-2 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={post.hot}
            onChange={(e) => handleChange("hot", e.target.checked)}
          />
          🔥 Đánh dấu bài viết hot
        </label>

        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Cập Nhật
        </button>
      </form>
    </div>
  );
}
