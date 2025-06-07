"use client";
import React from "react";
import styles from "@/styles/Home.module.css";
import Banner from "./banner/banner";
import FeaturedCategories from "../components/common/FeaturedCategories";
import About from "../components/common/About";
import FeaturedDishes from "../components/common/FeaturedDishes";
import FeaturedPrograms from "../components/common/FeaturedPrograms";
import DiscountedProductsTop from "../components/common/DiscountedProductsTop";
import DiscountedProductsBot from "../components/common/DiscountedProductsBot";
import TopSellingProducts from "../components/common/TopSellingProducts";
import SpecialBanner from "../components/common/SpecialBanner";
import Menu from "../components/common/Menu";
import News from "../components/common/News";
import Assess from "../components/common/Assess";
import Reason from "../components/common/Reason";
import Subscribe from "../components/common/Subscribe";

export default function Home(): JSX.Element {
  return (
    <main className={styles.home}>
      {/* Banner */}
      <section className={styles.banner}>
        <Banner></Banner>
      </section>
      {/* Danh mục nổi bật */}
      <section className={styles.section}>
        <FeaturedCategories></FeaturedCategories>
      </section>
      {/* Giới thiệu */}
      <section className={styles.about}>
        <About></About>
      </section>
      {/* Món ăn nổi bật */}
      <section className={styles.section}>
        <FeaturedDishes></FeaturedDishes>
      </section>
      {/* Chương trình khuyến mãi */}
      <section className={styles.section}>
       <FeaturedPrograms></FeaturedPrograms>
      </section>
      {/* Món ăn đang giảm giá */}
      <section className={styles.discountSection}>
        <DiscountedProductsTop></DiscountedProductsTop>
      </section>
      <section className={styles.discountproductSection}>
        <DiscountedProductsBot></DiscountedProductsBot>
      </section>
      {/* Danh sách bán chạy */}
      <section className={styles.bestSelling}>
        <TopSellingProducts></TopSellingProducts>
      </section>
      <section className="styles.specialBanner">
        <SpecialBanner></SpecialBanner>
      </section>
      {/* Menu */}
      <section className={styles.menufoodContainer}>
        <Menu></Menu>
      </section>
      <section className={styles.newsSection}>
        <News></News>
      </section>
      <section className={styles.danhgiaSection}>
        <Assess></Assess>
      </section>
      <section className={styles["lydo-section"]}>
        <Reason></Reason>
      </section>
      {/* Đăng ký nhận tin */}
      <section className={styles.subscribe}>
        <Subscribe></Subscribe>
      </section>
    </main>
  );
}