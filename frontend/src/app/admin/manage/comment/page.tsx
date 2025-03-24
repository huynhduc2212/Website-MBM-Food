"use client";
import { useState, useEffect } from "react";
import { getAllComments, hideComment } from "../../services/cmtServices";
import { Table, Button, Pagination } from "react-bootstrap";

export default function CommentsPage() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10; // Số bình luận trên mỗi trang
    interface User {
        _id: string;
        username: string;
    }

    interface Post {
        _id: string;
        title: string;
    }

    interface Comment {
        _id: string;
        id_user: User | null;
        id_post: Post | null;
        create_at: string; // ISO date string
        comment: string;
        hidden: boolean;
    }

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        try {
            const data = await getAllComments();
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        }
    };

    const handleToggleVisibility = async (commentId: any) => {
        try {
            await hideComment(commentId);
            fetchComments(); // Cập nhật lại danh sách
        } catch (error) {
            console.error("Error toggling comment visibility:", error);
        }
    };

    // Tính toán số trang
    const totalPages = Math.ceil(comments.length / commentsPerPage);
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    return (
        <div className="mt-4">
            <h3 className="mb-4 fs-3 fw-bold">Danh sách Bình luận</h3>

            <Table striped bordered hover responsive>
                <thead className="bg-primary text-white text-center">
                    <tr>
                        <th>Người bình luận</th>
                        <th>Bài viết</th>
                        <th>Thời điểm</th>
                        <th>Nội dung</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentComments.map((cmt) => (
                        <tr key={cmt._id} className="text-center">
                            <td>{cmt.id_user?.username || "Ẩn danh"}</td>
                            <td>{cmt.id_post?.title || "Không xác định"}</td>
                            <td>{new Date(cmt.create_at).toLocaleString()}</td>
                            <td>{cmt.hidden ? "(Bình luận đã ẩn)" : cmt.comment}</td>
                            <td>
                                <Button
                                    variant={cmt.hidden ? "success" : "warning"}
                                    size="sm"
                                    onClick={() => handleToggleVisibility(cmt._id)}
                                >
                                    {cmt.hidden ? "Hiện" : "Ẩn"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                    <button
                        className="btn btn-light mx-1"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ←
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNumber = i + 1;

                        if (
                            pageNumber === 1 ||
                            pageNumber === totalPages ||
                            (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    className={`btn mx-1 ${currentPage === pageNumber ? "btn-primary text-white" : "btn-light"}`}
                                    onClick={() => setCurrentPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        }

                        if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                            return <span key={pageNumber} className="mx-2">...</span>;
                        }

                        return null;
                    })}

                    <button
                        className="btn btn-light mx-1"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        →
                    </button>
                </div>
            )}


        </div>
    );
}