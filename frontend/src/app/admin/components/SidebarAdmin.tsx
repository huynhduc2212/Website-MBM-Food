"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Lấy đường dẫn hiện tại
import styles from "../styles/Sidebar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faLayerGroup,
  faUserFriends,
  faBox,
  faHeart,
  faShoppingCart,
  faSignOutAlt,
  faNewspaper,
  faTicket,
  faComments, // Thêm icon bình luận
  faTable,
  faCashRegister
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function SidebarAdmin() {
  const pathname = usePathname(); // Lấy đường dẫn trang hiện tại

  const menuItems = [
    { name: "Trang chủ", icon: faHome, path: "/admin" },
    { name: "Quản lý danh mục", icon: faLayerGroup, path: "/admin/manage/category" },
    { name: "Quản lý khách hàng", icon: faUserFriends, path: "/admin/manage/custumerList" },
    { name: "Quản lý sản phẩm", icon: faBox, path: "/admin/manage/products" },
    { name: "Quản lý banner", icon: faHeart, path: "/admin/manage/banner" },
    { name: "Quản lý đơn hàng", icon: faShoppingCart, path: "/admin/manage/orders" },
    { name: "Quản lý bài viết", icon: faNewspaper, path: "/admin/manage/newsList" },
    { name: "Quản lý bàn", icon: faTable, path: "/admin/manage/table" },
    { name: "Quản lý đặt bàn", icon: faCashRegister, path: "/admin/manage/register" },
    { name: "Quản lý mã giảm", icon: faTicket, path: "/admin/manage/coupon" },
    { name: "Quản lý bình luận", icon: faComments, path: "/admin/manage/comment" }, // Thêm mục bình luận
    { name: "Đăng xuất", icon: faSignOutAlt, path: "/login" },
  ];

  return (
    <div className={styles.sidebar}>
      <div className="flex items-center justify-center w-full">
        <Link href="/" className="">
          <Image
            src="/images/logo.png"
            alt="Dola Food"
            width={250}
            height={210}
            className="w-[200px] h-[200px] object-fill bg-transparent"
            priority
          />

        </Link>
      </div>
      <ul className={styles.sidebarMenu}>
        {menuItems.map((item, i) => {
          const isActive = item.path === "/admin" ? pathname === "/admin" : pathname.startsWith(item.path);

          return (
            <li
              key={i}
              className={`${styles.sidebarItem} ${isActive ? styles.sidebarItemActive : ""}`} // Áp dụng class active
            >
              <Link href={item.path} className={styles.link}>
                <FontAwesomeIcon icon={item.icon} className={styles.icon} />
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
