"use client";
import { manrope } from "@/utils";
import ClientLayout from "@/app/layout/ClientLayout";
import AdminLayout from "@/app/layout/AdminLayout";
import { usePathname } from "next/navigation";
import "./globals.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { log } from "console";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");
  useEffect(() => {
    if (!pathname) return;
    let formattedTitle = "Mbmfood";
    if (pathname !== "/") {
      const parts = pathname
        .split("/")
        .filter((part) => part)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
      formattedTitle = `Mbmfood | ${parts.join(" | ")}`;
    }
    document.title = formattedTitle;
  }, [pathname]);

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          sizes="120x120"
          href="/apple-icon-120x120.png"
        ></link>
      </head>
      <body className={manrope.className}>
        <ToastContainer position="top-right" autoClose={1500} />
        {isAdmin ? (
          <AdminLayout>{children}</AdminLayout>
        ) : (
          <ClientLayout>{children}</ClientLayout>
        )}
      </body>
    </html>
  );
}
