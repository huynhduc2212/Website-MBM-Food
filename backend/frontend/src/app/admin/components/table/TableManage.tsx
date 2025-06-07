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
import TableServices from "../../services/TableServices"; // Đổi từ CouponServices sang TableServices
import { commonClassNames } from "../../constants";

interface TableData {
  _id: string;
  name: string;
  position: string;
  status: "Available" | "Reserved";
}

const getStatusColor = (status: string) => {
  return status === "Available" ? "text-green-500 border-green-500 bg-green-500" : "text-orange-500 border-orange-500 bg-orange-500";
};

const TableManage = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tableData = await TableServices.getAllTables();
        setTables(tableData);
      } catch (error) {
        toast.error("Không thể tải dữ liệu bàn, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Hook tìm kiếm
  const {
    searchTerm,
    filteredItems: filteredTables,
    handleSearchChange,
  } = useSearch<TableData>({
    items: tables,
    searchProperty: "name",
  });

  // Hook phân trang
  const {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval,
  } = usePagination<TableData>({
    items: filteredTables,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleDeleteTable = async (id: string) => {
    Swal.fire({
      title: "Bạn có chắc muốn xóa bàn này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa ngay!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await TableServices.deleteTable(id);

          setTables((prev) => prev.filter((item) => item._id !== id));

          handleItemRemoval(filteredTables.length - 1);
          toast.success("Xóa bàn thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    });
  };

  const handleToggleStatus = async (table: TableData) => {
    Swal.fire({
      title: "Bạn có chắc muốn đổi trạng thái bàn?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cập nhật",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const newStatus = table.status === "Available" ? "Reserved" : "Available";

          await TableServices.updateTableStatus(table._id, newStatus);

          setTables((prev) =>
            prev.map((item) =>
              item._id === table._id ? { ...item, status: newStatus } : item
            )
          );

          toast.success("Đã cập nhật trạng thái bàn!");
        } catch (error) {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái!");
        }
      }
    });
  };

  return (
    <>
      <Link
        href="/admin/manage/table/new"
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
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </Link>
      <div className="flex items-center gap-5 justify-between mb-3 mt-4">
        <Heading>Quản lý bàn</Heading>
        <div className="flex gap-3">
          <div className="w-full lg:w-[300px]">
            <Input placeholder="Tìm kiếm bàn..." value={searchTerm} onChange={handleSearchChange} />
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
                <TableHead>Tên bàn</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((table) => (
                  <TableRow className="h-10" key={table._id}>
                    <TableCell className="font-medium px-2">{table.name}</TableCell>
                    <TableCell className="font-medium px-2">{table.position}</TableCell>
                    <TableCell className="font-medium px-2">
                      <span
                        className={`${commonClassNames.status} ${getStatusColor(table.status)} bg-opacity-10 cursor-pointer`}
                        onClick={() => handleToggleStatus(table)}
                      >
                        {table.status}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium px-2">
                      <div className="flex gap-3">
                        <Link href={`/admin/manage/table/update?id=${table._id}`}  className={commonClassNames.action}>
                          <IconEdit />
                        </Link>
                        <button onClick={() => handleDeleteTable(table._id)}  className={commonClassNames.action}>
                          <IconDelete />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-5 text-gray-500">
                    Không có bàn nào!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />}
        </>
      )}
    </>
  );
};

export default TableManage;
