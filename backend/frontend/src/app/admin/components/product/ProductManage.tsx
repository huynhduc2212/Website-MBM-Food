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
import { toast } from "react-toastify";
import ProductServices from "../../services/ProductServices";
import CategoryServices from "../../services/CategoryServices";
import { commonClassNames } from "../../constants";
import useSearch from "../../hooks/useSearch";
import usePagination from "../../hooks/usePagination";
import Pagination from "../pagination/Pagination";

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

interface Product {
  name: string;
  _id: string;
  createdAt: string;
  description: string;
  variants: {
    option: string;
    image: string;
    price: number;
    sale_price: number;
  }[];
  slug: string;
  status: string;
  idcate: string;
  flag: boolean;
}

const ProductManage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const ITEMS_PER_PAGE = 12; // Số sản phẩm trên mỗi trang

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const productData = await ProductServices.getAllProductsForAdmin();
        console.log("🚀 ~ fetchData ~ productData:", productData)
        setProducts(productData);

        const categoryData = await CategoryServices.getAllCategories();
        setCategories(categoryData);
      } catch (error) {
        toast.error("Không thể tải dữ liệu, vui lòng thử lại sau!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sử dụng hook tìm kiếm
  const {
    searchTerm,
    filteredItems: filteredProducts,
    handleSearchChange,
  } = useSearch<Product>({
    items: products,
    searchProperty: "name",
  });

  // Sử dụng hook phân trang
  const {
    currentPage,
    totalPages,
    getCurrentPageData,
    handlePageChange,
    handleItemRemoval,
  } = usePagination<Product>({
    items: filteredProducts,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const handleDeleteProduct = async (id: string) => {
    Swal.fire({
      title: "Bạn có chắc chắn xóa không?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Xóa ngay!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await ProductServices.deleteProduct(id);

          setProducts((prev) => {
            const updated = prev.filter((item) => item._id !== id);
            return updated;
          });

          // Xử lý phân trang sau khi xóa sản phẩm
          handleItemRemoval(filteredProducts.length - 1);

          toast.success("Xóa sản phẩm thành công!");
        } catch (error) {
          toast.error("Có lỗi xảy ra, vui lòng thử lại!");
        }
      }
    });
  };

  const handleToggleStatus = async (product: Product) => {
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
          const newStatus = product.status === "Active" ? "Unactive" : "Active";
          const newFlag = newStatus === "Active";

          await ProductServices.updateStatusProduct(
            product._id,
            newStatus,
            newFlag
          );

          // Cập nhật state sau khi thay đổi trạng thái
          setProducts((prev) => {
            return prev.map((item) => {
              if (item._id === product._id) {
                return {
                  ...item,
                  status: newStatus,
                  flag: newFlag,
                };
              }
              return item;
            });
          });
          toast.success(`Đã cập nhật trạng thái thành công`);
        } catch (error) {
          toast.error("Có lỗi xảy ra khi cập nhật trạng thái sản phẩm!");
        }
      }
    });
  };

  return (
    <>
      <Link
        href="/admin/manage/products/new"
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
        <Heading className="">Quản lý sản phẩm</Heading>
        <div className="flex gap-3">
          <div className="w-full lg:w-[300px]">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
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
                <TableHead>Thông tin</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getCurrentPageData().length > 0 ? (
                getCurrentPageData().map((product) => {
                  return (
                    <TableRow key={product.slug}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            alt=""
                            src={
                              product.variants?.[0]?.image
                                ? `${API_URL}/images/${product.variants[0].image}`
                                : "/placeholder.jpg" // Ảnh mặc định nếu không có ảnh
                            }
                            width={100}
                            height={100}
                            className="flex-shrink-0 size-14 rounded-lg object-contain"
                          />
                          <div className="flex flex-col gap-1">
                            <h3 className="font-bold text-sm whitespace-nowrap">
                              {product.name}
                            </h3>
                            <h4 className="text-xs text-slate-500">
                              {new Date(product.createdAt).toLocaleDateString(
                                "vi-VI"
                              )}
                            </h4>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {product.variants?.[0]?.price
                          ? `${product.variants[0].price.toLocaleString(
                              "vi"
                            )} VNĐ`
                          : "Chưa có giá"}
                      </TableCell>
                      <TableCell className="px-3">
                        {categories.find((cate) => cate._id === product.idcate)
                          ?.name || "Không xác định"}
                      </TableCell>
                      {/* <TableCell className="pl-4">
                        <span className={commonClassNames.status}>
                          {product.status}
                        </span>
                      </TableCell> */}
                      <TableCell className="pl-4">
                        <span
                          className={`${commonClassNames.status} ${
                            product.status === "Active"
                              ? "text-green-500 border-green-500 bg-green-500"
                              : "text-red-500 border-red-500 bg-red-500"
                          } bg-opacity-10 cursor-pointer`}
                          onClick={() => handleToggleStatus(product)}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-3">
                        <div className="flex gap-3 ">
                          <Link
                            href={`/admin/manage/products/update?slug=${product.slug}`}
                            className={commonClassNames.action}
                          >
                            <IconEdit />
                          </Link>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}
                            className={commonClassNames.action}
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">
                    Không tìm thấy sản phẩm nào
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

export default ProductManage;
