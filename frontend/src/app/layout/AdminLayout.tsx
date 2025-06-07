"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import SidebarAdmin from "../admin/components/SidebarAdmin";
// import Header from "../admin/components/Header";
import styles from "../admin/styles/costumerList.module.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex">
      <SidebarAdmin />
      <div className={styles.content}>
        {/* <Header /> */}
        <main className="mb-4">{children}</main>
      </div>
    </div>
  );
}
