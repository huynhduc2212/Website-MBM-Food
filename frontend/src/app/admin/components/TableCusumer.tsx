"use client";
import React, { useEffect, useState } from "react";
import userService from "../services/UserService";
import styles from "../styles/Table.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
interface UserType {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  avatar?: string;
  address?: string; // Thêm vào đây
}


interface UserResponse {
  users: UserType[];
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

interface EditData {
  username: string;
  email: string;
  role: string;
  address?: string;

}

export default function Table() {
  // States cho danh sách người dùng và phân trang
  const [users, setUsers] = useState<UserType[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // Số bản ghi mỗi trang

  // States cho edit
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    username: "",
    email: "",
    role: "",
    address: ""
  });

  // Load users khi component mount và khi page thay đổi (nếu không search)
  useEffect(() => {
    if (search.trim() === "") {
      loadUsers(page);
    }
  }, [page, search]);

  // Load toàn bộ người dùng có phân trang
  const loadUsers = async (pageNumber = 1) => {
    const data = await userService.getAllUsers(pageNumber, limit);
    // Giả sử API trả về { users, currentPage, totalPages, totalUsers }
    setUsers(data.users);
    setTotalPages(data.totalPages);
  };

  const handleToggleActive = async (id: any, isActive: any) => {
    const updatedUser = await userService.toggleUserStatus(id);

    if (updatedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isActive: updatedUser.isActive } : user
        )
      );

      // Nếu không có tìm kiếm, tải lại danh sách
      if (search.trim() === "") {
        loadUsers(page);
      } else {
        const user = await userService.findUserByName(search);
        setUsers(user ? [user] : []);
      }
    } else {
      console.error("Failed to update user status.");
    }
  };


  // Xử lý tìm kiếm có debounce
  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (search.trim() === "") {
        loadUsers(page);
      } else {
        const user = await userService.findUserByName(search);
        setUsers(user ? [user] : []);
        // Khi tìm kiếm, ta có thể reset phân trang (nếu API hỗ trợ nhiều kết quả, có thể cần sửa lại)
        setTotalPages(1);
        setPage(1);
      }
    }, 500);
    return () => clearTimeout(delaySearch);
  }, [search]);

  // Xử lý chỉnh sửa người dùng
  const handleEdit = (user: any) => {
    setEditingUser(user._id);
    setEditData({
      username: user.username,
      email: user.email,
      role: user.role,
      address: user.address
    });
  };

  const handleUpdate = async () => {
    await userService.updateUser(editingUser, editData);
    setEditingUser(null);
    // Reload dữ liệu ở trang hiện tại
    if (search.trim() === "") {
      loadUsers(page);
    } else {
      const user = await userService.findUserByName(search);
      setUsers(user ? [user] : []);
    }
  };

  return (
    <div className={`${styles.tableContainer} mt-4`}>
      <h4 className="fw-bold fs-3 mb-3">Danh sách người dùng</h4>


      <div className={styles.headerActions}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Tìm kiếm username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => loadUsers(page)}>🔍</button>
        </div>
      </div>

      <table className="table table-hover">
        <thead>
          <tr>

            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Join On</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>

                <td>
                  <div className={styles.avatarContainer}>
                    <Link href={`custumerList/${user._id}`}>
                      <span className={styles.name}>{user.username}</span>
                    </Link>
                  </div>
                </td>
                <td>{user.email}</td>

                <td>
                  <span className={styles.role}>{user.role}</span>
                </td>
                <td>
                  <span
                    className={user.isActive ? styles.active : styles.inactive}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => handleEdit(user)}
                  >
                    <FontAwesomeIcon icon={faPen} />
                  </button>
                  <button
                    className={`btn btn-sm ${user.isActive ? "btn-warning" : "btn-primary"
                      }`}
                    onClick={() => handleToggleActive(user._id, user.isActive)}
                  >
                    <FontAwesomeIcon
                      icon={user.isActive ? faToggleOff : faToggleOn}
                    />
                    {user.isActive ? " Deactivate" : " Activate"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} style={{ textAlign: "center", padding: "20px" }}>
                No users found.
              </td>
            </tr>
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


      {/* Modal chỉnh sửa */}
      {editingUser && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h4>Edit User</h4>
            <label>Username:</label>
            <input
              type="text"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
            />
            <label>Email:</label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) =>
                setEditData({ ...editData, email: e.target.value })
              }
            />


            <label>Role:</label>
            <select
              value={editData.role}
              onChange={(e) =>
                setEditData({ ...editData, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>

            </select>
            <div className={styles.modalButtons}>
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setEditingUser(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
