"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import "quill/dist/quill.snow.css";
import newsService from "../services/NewsService";

// Định nghĩa interface cho props
interface PostEditorProps {
  onClose?: () => void;
  onSuccess?: () => Promise<void>;
}

// Định nghĩa kiểu dữ liệu bài viết
interface PostData {
  author: string;
  title: string;
  content: string;
  summary: string;
  imageSummary: string;
  view: number;
  hot: number;
  status: number;
}

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

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
      image: function (this: { quill: any }) {
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

const imageOnlyModules = {
  toolbar: {
    container: [["image"]],
    handlers: {
      image: function (this: { quill: any }) {
        const editor = this.quill;
        const imageUrl = prompt("Nhập URL của hình ảnh:");
        if (imageUrl) {
          editor.setContents([{ insert: { image: imageUrl } }]);
        }
      },
    },
  },
};

export default function PostEditor({ onClose, onSuccess }: PostEditorProps) {
  const [post, setPost] = useState<PostData>({
    author: "",
    title: "",
    content: "",
    summary: "",
    imageSummary: "",
    view: 0,
    hot: 0,
    status: 1,
  });

  const handleChange = (field: keyof PostData, value: string | number) => {
    setPost((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await newsService.addNews(post);
      alert("Bài viết đã được đăng!");

      // Gọi callback nếu có
      if (onSuccess) await onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      alert("Có lỗi xảy ra khi đăng bài.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3>Đăng Bài Viết</h3>
          {onClose && (
            <button className="btn btn-danger" onClick={onClose}>
              ✖
            </button>
          )}
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Tên người đăng bài</label>
              <input
                type="text"
                className="form-control"
                value={post.author}
                onChange={(e) => handleChange("author", e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tiêu đề</label>
              <input
                type="text"
                className="form-control"
                value={post.title}
                onChange={(e) => handleChange("title", e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nội dung bài viết</label>
              <ReactQuill
                value={post.content}
                onChange={(value: string) => handleChange("content", value)}
                modules={fullModules}
                className="form-control"
                {...({} as any)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Tóm tắt bài viết</label>
              <ReactQuill
                value={post.summary}
                onChange={(value: string) => handleChange("summary", value)}
                modules={textOnlyModules}
                className="form-control"
                {...({} as any)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Hình ảnh tóm tắt</label>
              <ReactQuill
                value={post.imageSummary}
                onChange={(value: string) => handleChange("imageSummary", value)}
                modules={imageOnlyModules}
                className="form-control"
                {...({} as any)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Số lượt xem</label>
              <input
                type="number"
                className="form-control"
                value={post.view}
                onChange={(e) => handleChange("view", Number(e.target.value))}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nổi bật</label>
              <select
                className="form-select"
                value={post.hot}
                onChange={(e) => handleChange("hot", Number(e.target.value))}
              >
                <option value={0}>Không</option>
                <option value={1}>Có</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Đăng bài
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
