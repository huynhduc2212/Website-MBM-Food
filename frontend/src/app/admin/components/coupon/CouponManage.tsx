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
import { commonClassNames } from "../../constants";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import Pagination from "../pagination/Pagination";
import CouponServices from "../../services/CouponServices";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  type: "Amount" | "Shipping";
  start_date: Date;
  end_date: Date;
  status: "Active" | "Expired" | "Used_up";
  quantity: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "text-green-500 border-green-500 bg-green-500";
    case "Expired":
      return "text-red-500 border-red-500 bg-red-500";
    case "Used_up":
      return "text-orange-500 border-orange-500 bg-orange-500";
    default:
      return "";
  }
};

const CouponManage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const couponData = await CouponServices.getAllCoupons();
        setCoupons(couponData);
      } catch (error) {
        toast.error("Không thể tải dữ liệu mã giảm giá, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sử dụng hook tìm kiếm
  const {
    searchTerm,
    filteredItems: filteredCoupons,
    handleSearchChange,
  } = useSearch<Coupon>({
    items: coupons,
    searchProperty: "code",
  });

  // Sử dụng hook phân trang
  const {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval,
  } = usePagination<Coupon>({
    items: filteredCoupons,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleDeleteCoupon = async (id: string) => {
    Swal.fire({
      title: "Bạn có chắc xóa mã này không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa ngay!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await CouponServices.deleteCoupon(id);

          setCoupons((prev) => {
            const updated = prev.filter((item) => item._id !== id);
            return updated;
          });

          handleItemRemoval(filteredCoupons.length - 1);
          toast.success("Xóa mã giảm giá thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    });
  };

  const handleToggleStatus = async (coupon: Coupon) => {
    Swal.fire({
      title: "Bạn có chắc muốn đổi trạng thái?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Chỉ cho phép chuyển đổi giữa Active và Expired
          // Không cho phép thay đổi nếu đã Used_up (hết số lượng)
          if (coupon.status === "Used_up") {
            toast.error(
              "Không thể thay đổi trạng thái mã đã hết lượt sử dụng!"
            );
            return;
          }

          const newStatus = coupon.status === "Active" ? "Expired" : "Active";

          // Gọi API để cập nhật trạng thái
          await CouponServices.updatedStatusCoupon(coupon._id, newStatus);

          setCoupons((prev) => {
            return prev.map((item) => {
              if (item._id === coupon._id) {
                return {
                  ...item,
                  status: newStatus,
                };
              }
              return item;
            });
          });
          toast.success(`Đã cập nhật trạng thái thành công`);
        } catch (error) {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái mã giảm giá!");
        }
      }
    });
  };

  // Hàm format tiền tệ
  const formatCurrency = (value: number) => {
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  return (
    <>
      <Link
        href="/admin/manage/coupon/new"
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
        <Heading>Quản lý mã giảm giá</Heading>
        <div className="flex gap-3">
          <div className="w-full lg:w-[300px]">
            <Input
              placeholder="Tìm kiếm mã giảm giá..."
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
                <TableHead>Mã giảm giá</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead>Ngày kết thúc</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((coupon) => (
                  <TableRow className="h-10" key={coupon._id}>
                    <TableCell className="font-medium px-2">
                      {coupon.code}
                    </TableCell>
                    <TableCell className="font-medium px-2 ">
                      {formatCurrency(coupon.discount)}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {coupon.type === "Amount"
                        ? "Giảm theo số tiền"
                        : "Giảm phí vận chuyển"}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {new Date(coupon.start_date).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      {new Date(coupon.end_date).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      <span
                        className={`${commonClassNames.status} ${getStatusColor(
                          coupon.status
                        )} bg-opacity-10 cursor-pointer`}
                        onClick={() => handleToggleStatus(coupon)}
                      >
                        {coupon.status === "Active"
                          ? "Active"
                          : coupon.status === "Expired"
                          ? "Expired"
                          : "Used_up"}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/manage/coupon/update?id=${coupon._id}`}
                          className={commonClassNames.action}
                        >
                          <IconEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteCoupon(coupon._id)}
                          className={commonClassNames.action}
                        >
                          <IconDelete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10">
                    Không tìm thấy mã giảm giá nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </>
  );
};

export default CouponManage;
