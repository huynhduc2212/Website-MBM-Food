import axios from "axios";

const API_URL = `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/cmt`; // Cập nhật đúng endpoint của backend

export const createComment = async (postId: string, comment: string) => {
  const response = await axios.post(
    `${API_URL}/create`,
    { postId, comment },
    { withCredentials: true }
  );
  return response.data;
};

export const getAllComments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getCommentsByUser = async (userId: string) => {
  const response = await axios.get(`${API_URL}/user/${userId}`);
  return response.data;
};

export const deleteComment = async (commentId: string) => {
  const response = await axios.delete(`${API_URL}/${commentId}`, {
    withCredentials: true,
  });
  return response.data;
};
export const hideComment = async (commentId: string) => {
  const response = await fetch(`${API_URL}/${commentId}/hide`, {
    method: "PUT",
  });
  return response.json();
};
