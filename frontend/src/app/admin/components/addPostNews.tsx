"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import newsService from "../services/NewsService";
import slugify from "slugify";

// Dynamic import ReactQuill
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false }) as unknown as React.FC<{
  value: string;
  onChange: (value: string) => void;
  modules?: Record<string, any>;
  className?: string;
}>;

// Modules
const fullModules = {
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

const textOnlyModules = {
  toolbar: [["bold", "italic", "underline"], ["blockquote"]],
};

// Kiểu dữ liệu
interface PostData {
  author: string;
  title: string;
  slug: string;
  content: string;
  summary: string;
  imageSummary: string;
  status: boolean;
  hot: boolean;
}

interface PostEditorProps {
  onClose?: () => void;
  onSuccess?: () => Promise<void>;
}

export default function PostEditor({ onClose, onSuccess }: PostEditorProps) {
  const [post, setPost] = useState<PostData>({
    author: "",
    title: "",
    slug: "",
    content: "",
    summary: "",
    imageSummary: "",
    status: true,
    hot: false,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleChange = (key: keyof PostData, value: string | boolean) => {
    setPost((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("author", post.author);
    formData.append("title", post.title);
    formData.append("slug", post.slug);
    formData.append("content", post.content);
    formData.append("summary", post.summary);
    formData.append("status", post.status ? "1" : "0");
    formData.append("hot", post.hot ? "1" : "0");

    if (imageFile) {
      formData.append("variants[0][image]", imageFile);

    }

    try {
      const res = await newsService.addNews(formData);

      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      alert("Bài viết đã được đăng!");

      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert("Có lỗi xảy ra khi đăng bài.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl bg-white shadow rounded">
      <h1 className="text-center text-2xl font-bold mb-4">Đăng Bài Viết</h1>
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
            const val = e.target.value;
            handleChange("title", val);
            handleChange("slug", slugify(val, { lower: true }));
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
          onChange={(val) => handleChange("content", val)}
          modules={fullModules}
          className="mb-4"
        />

        <label className="block font-bold mb-2">Tóm tắt bài viết:</label>
        <ReactQuill
          value={post.summary}
          onChange={(val) => handleChange("summary", val)}
          modules={textOnlyModules}
          className="mb-4"
        />

        <label className="block font-bold mb-2">Hình ảnh tóm tắt:</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setImageFile(file);
              handleChange("imageSummary", file.name);
            }
          }}
          className="mb-2"
        />

        {imageFile && (
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="mb-4 max-h-48 rounded"
          />
        )}

        <label className="block font-bold mb-2 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={post.status}
            onChange={(e) => handleChange("status", e.target.checked)}
          />
          Kích hoạt bài viết
        </label>

        <label className="block font-bold mb-4 flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={post.hot}
            onChange={(e) => handleChange("hot", e.target.checked)}
          />
          🔥 Đánh dấu bài viết hot
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Đăng bài
        </button>
      </form>
    </div>
  );
}
