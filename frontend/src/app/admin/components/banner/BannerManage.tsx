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
import Image from "next/image";
import { IconDelete, IconEdit } from "../icons";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import BannerServices from "../../services/BannerServices";
import { toast } from "react-toastify";
import { commonClassNames } from "../../constants";
import useSearch from "../../hooks/useSearch";
import Pagination from "../pagination/Pagination";
import usePagination from "../../hooks/usePagination";

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

interface Banner {
  _id: string;
  image: string;
  createdAt: string;
  description?: string;
  title: string;
}

const BannerManage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchBanners = async () => {
      setLoading(true);
      try {
        const data = await BannerServices.getAllBanners();
        setBanners(data);
      } catch (error) {
        toast.error("Không thể tải banner, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const {
    searchTerm,
    filteredItems: filteredBanners,
    handleSearchChange,
  } = useSearch<Banner>({
    items: banners,
    searchProperty: "title",
  });

  const {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval,
  } = usePagination<Banner>({
    items: filteredBanners,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleDeleteBanner = async (id: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa ngay!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await BannerServices.deleteBanner(id);
          setBanners((prev) => {
            const updated = prev.filter((item) => item._id !== id);
            return updated;
          });

          handleItemRemoval(filteredBanners.length - 1);
          toast.success("Xóa banner thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    });
  };

  return (
    <>
      <Link
        href="/admin/manage/banner/new"
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
        <Heading className="">Quản lý Banner</Heading>
        <div className="flex gap-3">
          <div className="w-full lg:w-[300px]">
            <Input
              placeholder="Tìm kiếm banner..."
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
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((banner) => (
                  <TableRow key={banner._id}>
                    <TableCell className="pr-20">
                      <div className="flex items-center gap-3">
                        <Image
                          alt=""
                          src={`${API_URL}/images/${banner.image}`}
                          width={100}
                          height={100}
                          className="flex-shrink-0 size-14 rounded-lg object-contain w-[120px]"
                        />
                        <div className="flex flex-col gap-1">
                          <h3 className="font-bold text-sm lg:text-base whitespace-nowrap">
                            {banner.title}
                          </h3>
                          <h4 className="text-xs lg:text-sm text-slate-500">
                            {new Date(banner.createdAt).toLocaleDateString(
                              "vi-VI"
                            )}
                          </h4>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="line-clamp-1">
                        {banner.description || "Không có mô tả"}
                      </p>
                    </TableCell>
                    <TableCell className="pl-2">
                      <div className="flex gap-3">
                        <Link
                          href={`/admin/manage/banner/update?id=${banner._id}`}
                          className={commonClassNames.action}
                        >
                          <IconEdit />
                        </Link>
                        <button
                          onClick={() => handleDeleteBanner(banner._id)}
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
                  <TableCell colSpan={3} className="text-center py-10">
                    Không tìm thấy banner nào
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

export default BannerManage;
