"use client";
import { manrope } from "@/utils";
import "@/styles/globals.css";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import ProductNotification from "../../components/layout/ProductNotification";
import Breadcrumb from "@/components/layout/BreadCrumb";
export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={manrope.className}>
      <Header />
      <Breadcrumb
        homeElement={"Home"}
        activeClasses="text-breadcrumb"
        listClasses="hover:text-breadcrumb"
        capitalizeLinks
      />
      <main>{children}</main>
      <ProductNotification />
      <Footer />
    </div>
  );
}
