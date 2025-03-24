/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import styles from "../../../styles/Booking.module.css";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import BookingServices from "@/services/Booking";
import { jwtDecode } from "jwt-decode";

interface Register {
  _id: string;
  id_user: {
    _id: string;
    username: string;
    email: string;
    phone: string;
  };
  id_table: {
    _id: string;
    name: string;
    position: string;
  };
  start_time: string;
  create_at: string;
  status: "Confirmed" | "Completed" | "Cancelled";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return styles.confirmed;
    case "Cancelled":
      return styles.cancelled;
    case "Completed":
      return styles.completed;
    default:
      return "";
  }
};

const ShowHistoryBooking = () => {
  const [registers, setRegisters] = useState<Register[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = (decodedToken as { userId: string })?.userId;

          const data = await BookingServices.getRegistersByUser(userId);
          setRegisters(data);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu đặt bàn, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCancelBooking = async (register: Register) => {
    if (register.status !== "Confirmed") {
      toast.info("Chỉ có thể hủy đơn đặt bàn ở trạng thái Confirmed!");
      return;
    }

    const confirmResult = await Swal.fire({
      title: "Bạn có chắc muốn hủy đơn đặt bàn này?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Giữ nguyên",
    });

    if (confirmResult.isConfirmed) {
      try {
        await BookingServices.updateRegisterStatus(register._id, "Cancelled");

        setRegisters((prev) =>
          prev.map((item) =>
            item._id === register._id ? { ...item, status: "Cancelled" } : item
          )
        );

        toast.success("Đã hủy đơn đặt bàn thành công!");
      } catch (error) {
        toast.error("Có lỗi xảy ra khi hủy đơn đặt bàn!");
      }
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Đơn đặt bàn của bạn</h2>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
        </div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Bàn</th>
              <th>Thời gian bắt đầu</th>
              <th>Ngày đặt</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {registers.length > 0 ? (
              registers.map((register) => (
                <tr key={register._id}>
                  <td>{register.id_table.name}</td>
                  <td>{register.start_time}</td>
                  <td>{formatDate(register.create_at)}</td>
                  <td>
                    <span
                      className={`${styles.status} ${getStatusColor(
                        register.status
                      )}`}
                    >
                      {register.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`${styles.cancelButton} ${
                        register.status !== "Confirmed" ? styles.disabled : ""
                      }`}
                      onClick={() => handleCancelBooking(register)}
                      disabled={register.status !== "Confirmed"}
                      title={
                        register.status !== "Confirmed"
                          ? "Không thể hủy đơn này"
                          : "Nhấn để hủy đơn"
                      }
                    >
                      Hủy
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className={styles.emptyMessage}>
                  Không có đơn đặt bàn nào!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ShowHistoryBooking;
