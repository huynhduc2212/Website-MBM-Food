"use client";

import React, { useEffect, useState } from "react";
import newsService from "../../services/NewsService";
import styles from "../../styles/newsList.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import AddNews from "../../components/addPostNews";
import EditNews from "../../components/editPostNews";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS
import Image from "next/image";
const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;
export default function NewsTable() {
    const [news, setNews] = useState<NewsPost[]>([]);
    const [search, setSearch] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState<string>(""); // Không dùng null
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Số bài viết mỗi trang
    interface NewsPost {
        _id: string;
        title: string;
        author: string;
        create_at: string;
        imageSummary: string;
        status: number;
    }

    useEffect(() => {
        loadNews(page);
    }, [page]);

    const loadNews = async (currentPage: number) => {
        try {
            const { posts, totalPages } = await newsService.getAllNews(currentPage, limit);
            setNews(posts);
            setTotalPages(totalPages);
        } catch (error) {
            console.error("Lỗi khi tải danh sách bài viết:", error);
        }
    };

    const handleDelete = async (id: string) => {
        await newsService.deleteNews(id);
        loadNews(page);
    };
    const handleToggleStatus = async (id: string, status: number) => {
        try {
            console.log("Trạng thái hiện tại:", status); // Kiểm tra giá trị status
            const newStatus = status === 1 ? 2 : 1;
            console.log("Trạng thái mới:", newStatus); // Kiểm tra giá trị mới

            await newsService.activateNews(id, newStatus);
            setNews((prevNews) =>
                prevNews.map((post) =>
                    post._id === id ? { ...post, status: newStatus } : post
                )
            );

            toast.success("Cập nhật trạng thái thành công!", { position: "top-right", autoClose: 3000 });
        } catch (error) {
            console.error("Lỗi khi thay đổi trạng thái bài viết:", error);
            toast.error("Cập nhật trạng thái thất bại!", { position: "top-right", autoClose: 3000 });
        }
    };



    // Hàm tìm kiếm với debounce
    let debounceTimer: NodeJS.Timeout;
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearch(value);

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            if (value.trim() === "") {
                loadNews(page);
            } else {
                try {
                    const data = await newsService.searchNewsByTitle(value);
                    setNews(data);
                } catch (error) {
                    console.error("Lỗi tìm kiếm bài viết:", error);
                }
            }
        }, 300);
    };

    const handleAdd = () => setIsAdding(true);
    const handleEdit = (id: string) => {
        setEditId(id ?? "");
        setIsEditing(true);
    };

    return (
        <div className={`${styles.tableContainer} mt-4`}>
            <div className={styles.mainTitle}>
                <h4 className="fw-bold fs-3 mb-3">Danh sách bài viết</h4>

            </div>

            <div className={styles.headerActions}>
                <button className={styles.addButton} onClick={handleAdd}>
                    <FontAwesomeIcon icon={faPlus} /> Thêm bài viết
                </button>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm tiêu đề..."
                        value={search}
                        onChange={handleInputChange}
                    />
                    
                </div>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Tiêu đề</th>
                        <th>Tác giả</th>
                        <th>Ngày đăng</th>
                        <th>Hình ảnh</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {news.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center text-muted py-3">
                                Không tìm thấy bài viết nào.
                            </td>
                        </tr>
                    ) : (
                        news.map((post, index) => (
                            <tr key={post._id}>
                                <td>{(page - 1) * limit + index + 1}</td>
                                <td>{post.title}</td>
                                <td>{post.author}</td>
                                <td>{new Date(post.create_at).toLocaleDateString()}</td>
                                <td>
                                    <img
                                        alt="Ảnh tóm tắt"
                                        src={
                                            post.imageSummary
                                                ? `${API_URL}/images/${post.imageSummary}`
                                                : "/placeholder.jpg"
                                        }
                                        width={100}
                                        height={100}
                                    />
                                </td>
                                <td>
                                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(post._id)}>
                                        <FontAwesomeIcon icon={faPen} />
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm me-2"
                                        onClick={() => {
                                            const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa bài viết này?");
                                            if (confirmDelete) handleDelete(post._id);
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                    <button
                                        className={`btn btn-sm ${post.status === 1 ? "btn-secondary" : "btn-success"}`}
                                        onClick={() => handleToggleStatus(post._id, post.status)}
                                    >
                                        {post.status === 1 ? "Hủy kích hoạt" : "Kích hoạt"}
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Phân trang */}
            {search.trim() === "" && totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-light border-0 shadow-none mx-1"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                    >
                        ←
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                        const pageNumber = index + 1;

                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= page - 1 && pageNumber <= page + 1)
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    className={`btn mx-1 border-0 shadow-none ${page === pageNumber ? "btn-primary text-white" : "btn-light"
                                        }`}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }

                        if (pageNumber === page - 2 || pageNumber === page + 2) {
                            return <span key={pageNumber} className="mx-2">...</span>;
                        }

                        return null;
                    })}

                    <button
                        className="btn btn-light border-0 shadow-none mx-1"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                    >
                        →
                    </button>
                </div>
            )}


            {/* Modal Thêm Bài Viết */}
            {isAdding && (
                <div className={styles.overlays}>
                    <div className={styles.modals}>
                        <button className={styles.closeButton} onClick={() => setIsAdding(false)}>✖</button>
                        <AddNews onClose={() => setIsAdding(false)} onSuccess={() => loadNews(page)} />
                    </div>
                </div>
            )}

            {/* Modal Chỉnh Sửa Bài Viết */}
            {isEditing && (
                <div className={styles.overlays}>
                    <div className={styles.modals}>
                        <button className={styles.closeButton} onClick={() => setIsEditing(false)}>✖</button>
                        <EditNews id={editId} onClose={() => setIsEditing(false)} onSuccess={() => loadNews(page)} />
                    </div>
                </div>
            )}
        </div>
    );
}
