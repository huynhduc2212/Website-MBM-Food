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
import { Input } from "@/components/ui/input";
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
    address?: [
      {
        _id: string;
        name: string;
        phone:string;
      }
    ];
  };
  id_table: {
    _id: string;
    name: string;
  };
  start_time: string;
  end_time: string;
  booking_date: string;
  updatedAt: string;
  cancel_reason: string;
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
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [selectedRegister, setSelectedRegister] = useState<RegisterData | null>(
    null
  );
  const [cancelReason, setCancelReason] = useState<string>("");

  const cancelReasons = [
    "Thay đổi kế hoạch đột xuất",
    "Thời tiết xấu hoặc giao thông bất lợi",
    "Tìm được nhà hàng khác phù hợp hơn",
  ];

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
    register.id_user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const openCancelModal = (register: RegisterData) => {
    if (register.status !== "Confirmed") {
      toast.info("Không thể thay đổi trạng thái của đơn đăng ký này!");
      return;
    }

    setSelectedRegister(register);
    setCancelReason(cancelReasons[0]);
    setShowCancelModal(true);
  };

  const handleCancelBooking = async () => {
    if (!selectedRegister || !cancelReason) {
      toast.error("Vui lòng chọn lý do hủy đơn!");
      return;
    }

    try {
      await RegisterServices.updateRegisterStatus(
        selectedRegister._id,
        cancelReason
      );

      setRegisters((prev) =>
        prev.map((item) =>
          item._id === selectedRegister._id
            ? { ...item, status: "Cancelled", cancel_reason: cancelReason }
            : item
        )
      );

      toast.success("Đã hủy đơn đặt bàn thành công!");
      setShowCancelModal(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi hủy đơn đặt bàn!");
    }
  };

  const closeModal = () => {
    setShowCancelModal(false);
    setSelectedRegister(null);
    setCancelReason("");
  };

  const formatCreateDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatEndTime = (dateString: string) => {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return ` ${hours}:${minutes}`;
  };

  const showEndTime = (register: RegisterData) => {
    if (register.status === "Confirmed") {
      return "Chưa rõ";
    } else if (register.status === "Cancelled") {
      return "Không có";
    } else {
      return formatEndTime(register.updatedAt);
    }
  };

  return (
    <>
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
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Bàn</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Thời gian bắt đầu</TableHead>
                <TableHead>Thời gian kết thúc</TableHead>
                <TableHead>Lí do hủy</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((register) => (
                  <TableRow className="h-10" key={register._id}>
                    <TableCell className="font-medium px-2">
                      {register.id_user.address?.[0]?.name}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.id_user.address?.[0]?.phone}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.id_table.name}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {formatCreateDate(register.booking_date)}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.start_time}
                    </TableCell>

                    <TableCell className="font-medium px-2">
                      {showEndTime(register)}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {register.cancel_reason !== "" ? (
                        <span>{register.cancel_reason}</span>
                      ) : (
                        "Không có"
                      )}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      <span
                        className={`${commonClassNames.status} ${getStatusColor(
                          register.status
                        )} bg-opacity-10 ${
                          register.status === "Confirmed"
                            ? "cursor-pointer"
                            : "cursor-not-allowed"
                        }`}
                        onClick={() => openCancelModal(register)}
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

      {/* Modal hủy đơn */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-black mb-4 border-b pb-2">
              Xác nhận hủy đơn đặt bàn
            </h3>
            <p className="text-base text-gray-600 mb-4 font-medium">
              Vui lòng chọn lý do hủy đơn:
            </p>

            <div className="space-y-3 mb-6">
              {cancelReasons.map((reason, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="radio"
                    id={`reason-${index}`}
                    name="cancelReason"
                    value={reason}
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="mr-2"
                  />
                  <label
                    htmlFor={`reason-${index}`}
                    className="text-sm text-gray-800"
                  >
                    {reason}
                  </label>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                onClick={handleCancelBooking}
              >
                Xác nhận hủy
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                onClick={closeModal}
              >
                Giữ nguyên
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterManage;
