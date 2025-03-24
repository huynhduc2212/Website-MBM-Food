/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Heading from "../common/Heading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconDelete, IconEdit } from "../icons";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import Pagination from "../pagination/Pagination";
import { commonClassNames } from "../../constants";
import RegisterServices from "../../services/RegisterServices";

interface RegisterData {
  _id: string;
  id_user: {
    _id: string;
    username: string;
  };
  id_table: {
    _id: string;
    name: string;
  };
  start_time: string;
  create_at: string;
  status: "Confirmed" | "Completed" | "Cancelled";
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Confirmed":
      return "text-green-500 border-green-500 bg-green-500";
    case "Cancelled":
      return "text-red-500 border-red-500 bg-red-500";
    case "Completed":
      return "text-[#3A82F6] border-blue-500 bg-blue-500";
    default:
      return "text-gray-500 border-gray-500 bg-gray-500";
  }
};

const RegisterManage = () => {
  const [registers, setRegisters] = useState<RegisterData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const registerData = await RegisterServices.getAllRegisters();
        setRegisters(registerData);
      } catch (error) {
        toast.error("Không thể tải dữ liệu đăng ký, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Lọc danh sách đăng ký theo tên người dùng
  const filteredRegisters = registers.filter((register) =>
    register.id_user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval,
  } = usePagination<RegisterData>({
    items: filteredRegisters,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleToggleStatus = async (register: RegisterData) => {
    if (register.status === "Completed" || register.status === "Cancelled") {
      toast.info("Không thể thay đổi trạng thái của đơn đăng ký này!");
      return;
    }

    if (register.status === "Confirmed") {
      // Hiển thị xác nhận
      const confirmResult = await Swal.fire({
        title: "Bạn có chắc muốn hủy đơn đăng ký này?",
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
          await RegisterServices.updateRegisterStatus(
            register._id,
            "Cancelled"
          );

          setRegisters((prev) =>
            prev.map((item) =>
              item._id === register._id
                ? { ...item, status: "Cancelled" }
                : item
            )
          );

          toast.success("Đã hủy đơn đăng ký!");
        } catch (error) {
          toast.error("Có lỗi xảy ra khi hủy đơn đăng ký!");
        }
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
    <>
      <Link
        href="/admin/manage/register/new"
        className="size-10 rounded-full bg-primary flexCenter text-white fixed right-5 bottom-5 animate-bounce"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
      </Link>
      <div className="flex items-center gap-5 justify-between mb-3 mt-4">
        <Heading>Quản lý khách hàng đặt bàn</Heading>
        <div className="flex gap-3">
          <div className="w-full lg:w-[300px]">
            <Input
              placeholder="Tìm kiếm theo tên khách hàng..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin h-8 w-8 border-4 border-t-primary border-l-primary border-b-primary rounded-full"></div>
        </div>
      ) : (
        <>
          <Table className="table-responsive">
            <TableHeader>
              <TableRow>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Bàn</TableHead>
                <TableHead>Thời gian bắt đầu</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((register) => (
                  <TableRow className="h-10" key={register._id}>
                    <TableCell className="font-medium px-2">
                      {register.id_user.username}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.id_table.name}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.start_time}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {formatDate(register.create_at)}
                    </TableCell>
                    {/* <TableCell className="font-medium px-2">
                      <span
                        className={`${commonClassNames.status} ${getStatusColor(register.status)} bg-opacity-10 cursor-pointer`}
                        onClick={() => handleToggleStatus(register)}
                      >
                        {register.status}
                      </span>
                    </TableCell> */}
                    <TableCell className="font-medium px-2">
                      <span
                        className={`${commonClassNames.status} ${getStatusColor(
                          register.status
                        )} bg-opacity-10 ${
                          register.status === "Confirmed"
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                        onClick={() => handleToggleStatus(register)}
                        title={
                          register.status === "Confirmed"
                            ? "Nhấn để hủy đơn"
                            : "Không thể thay đổi trạng thái"
                        }
                      >
                        {register.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-5 text-gray-500"
                  >
                    Không có đăng ký nào!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </>
  );
};

export default RegisterManage;
