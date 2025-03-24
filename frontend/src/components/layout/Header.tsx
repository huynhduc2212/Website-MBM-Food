"use client";
import styles from "@/styles/Header.module.css";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getFavorites } from "@/services/Favorite";
import { useRouter } from "next/navigation";
import countCart from "../../app/hooks/countCart";

export default function Header(): JSX.Element {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [showProductMenu, setShowProductMenu] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  //Tìm kiếm
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<{
    products: any[];
    news: any[];
  }>({
    products: [],
    news: [],
  });
  const [showResults, setShowResults] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.trim() === "") {
        setShowResults(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3001/api/search?query=${searchTerm}`
        );
        const data = await response.json();

        setSearchResults({
          products: data.products || [],
          news: data.news || [],
        });
        setShowResults(true);
      } catch (error) {
        console.error("Lỗi tìm kiếm:", error);
      }
    };

    const debounceTimeout = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  //Chuyển sang sản phẩm
  const handleViewMore = () => {
    router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setShowResults(false);
  };

  //Chuyển trang tin tức
  const handleViewMoreNews = () => {
    router.push(`/news?query=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setShowResults(false);
  };

  const cartCount = countCart();
  const menuItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/product", label: "Sản phẩm", isDropdown: true },
    { href: "/about", label: "Giới thiệu" },
    { href: "/news", label: "Tin tức" },
    { href: "/contact", label: "Liên hệ" },
    { href: "/faq", label: "Câu hỏi thường gặp" },
    { href: "/storesystem", label: "Hệ thống cửa hàng" },
    { href: "/booking", label: "Đặt bàn" },
  ];

  const productCategories = [
    { href: "/product/pizza", label: "Pizza" },
    { href: "/product/khai-vi", label: "Khai Vị" },
    { href: "/product/my-y", label: "Mỳ Ý" },
    { href: "/product/salad", label: "Salad" },
    { href: "/product/nuoc-uong", label: "Nước Uống" },
  ];

  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    checkAuth(); // Kiểm tra ngay khi component render
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const data = await getFavorites(token);
          if (Array.isArray(data)) {
            setFavoriteCount(data.length);
          }
        } catch (error) {
          console.error("Lỗi khi lấy danh sách yêu thích:", error);
        }
      }
    };

    fetchFavorites(); // Gọi ngay khi component mount

    const interval = setInterval(fetchFavorites, 5000); // Cập nhật mỗi 5 giây

    // Lắng nghe sự thay đổi trong localStorage
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "favoritesUpdated") {
        fetchFavorites();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval); // Dọn dẹp interval khi unmount
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Xử lí dăng xuất !
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Xóa userId
    localStorage.removeItem("user"); // Xóa thông tin đăng nhập
    localStorage.removeItem("token"); // Xóa token nếu có
    setIsLoggedIn(false);
    window.location.reload();
  };
  return (
    <header>
      <div className={styles.headerTop}>Nhiều ưu đãi dành cho bạn</div>
      <div className={styles.headerMain}>
        {/* <div
          className={styles.menuToggle}
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Image
            src="/images/menu-icon.png"
            alt="Menu"
            width={30}
            height={30}
          />
        </div> */}

        <Link href="/" className={styles.logo}>
          <Image
            src="/images/logo.png"
            alt="Dola Food"
            width={150}
            height={75}
            priority
          />
        </Link>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Bạn muốn tìm gì?"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={styles.searchIcon}>
            <Image
              src="/images/search-icon.png"
              alt="Search"
              width={20}
              height={20}
            />
          </div>
          {showResults && (
            <div className={styles.searchResults}>
              {searchResults.products.length > 0 && (
                <div className={styles.resultCategory}>
                  <div>
                    <h4 className={styles.categoryTitle}>Sản phẩm</h4>
                    {searchResults.products.slice(0, 4).map((item, index) => (
                      <Link
                        key={index}
                        href={`/product/${item.slug}`}
                        className={styles.resultItem}
                      >
                        {item.image && (
                          <Image
                            src={`/images/${item.image}`}
                            alt={item.name}
                            width={50}
                            height={50}
                          />
                        )}
                        <div className={styles.resultInfo}>
                          <p className={styles.resultName}>{item.name}</p>
                          {item.price && (
                            <p className={styles.resultPrice}>{item.price}đ</p>
                          )}
                        </div>
                      </Link>
                    ))}
                    {searchResults.products.length > 4 && (
                      <button
                        className={styles.viewMoreBtn}
                        onClick={handleViewMore}
                      >
                        Xem thêm {searchResults.products.length - 4} sản phẩm
                      </button>
                    )}
                  </div>
                </div>
              )}

              {searchResults.news.length > 0 && (
                <div className={styles.resultCategory}>
                  <div>
                    <h4 className={styles.categoryTitle}>Tin tức</h4>
                    {searchResults.news.slice(0, 4).map((item, index) => (
                      <Link
                        key={index}
                        href={`/news/${item.slug}`}
                        className={styles.resultItem}
                      >
                        {item.image && (
                          <Image
                            src={`/images/${item.image}`}
                            alt={item.title}
                            width={50}
                            height={50}
                          />
                        )}
                        <div className={styles.resultInfo}>
                          <p className={styles.resultName}>{item.title}</p>
                        </div>
                      </Link>
                    ))}
                    {searchResults.news.length > 2 && (
                      <button
                        className={styles.viewMoreBtn}
                        onClick={handleViewMoreNews}
                      >
                        Xem thêm {searchResults.news.length - 2} tin tức
                      </button>
                    )}
                  </div>
                </div>
              )}

              {searchResults.products.length === 0 &&
                searchResults.news.length === 0 && (
                  <p>Không tìm thấy kết quả nào</p>
                )}
            </div>
          )}
        </div>

        <div className={styles.delivery}>
          <Image
            src="/images/delivery-icon.png"
            alt="Delivery"
            width={40}
            height={40}
          />
          <span>
            Giao hàng tận nơi
            <br />
            <strong>1900 6750</strong>
          </span>
        </div>
        <div className={styles.userCart}>
          <div
            className={styles.userIcon}
            onMouseEnter={() => setShowUserMenu(true)}
            onMouseLeave={() => setShowUserMenu(false)}
          >
            <Image
              src="/images/user-icon.png"
              alt="User"
              width={30}
              height={30}
            />
            {showUserMenu && (
              <div className={styles.dropdownMenu}>
                {isLoggedIn ? (
                  <>
                    <Link href="/account" className={styles.menuItem}>
                      <Image
                        src="/images/user-icon.png"
                        alt="Account"
                        width={20}
                        height={20}
                      />{" "}
                      Tài khoản
                    </Link>
                    <button onClick={handleLogout} className={styles.menuItem}>
                      <Image
                        src="/images/register-icon.png"
                        alt="Logout"
                        width={20}
                        height={20}
                      />{" "}
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className={styles.menuItem}>
                      <Image
                        src="/images/register-icon.png"
                        alt="Login"
                        width={20}
                        height={20}
                      />{" "}
                      Đăng nhập
                    </Link>
                    <Link href="/register" className={styles.menuItem}>
                      <Image
                        src="/images/register-icon.png"
                        alt="Register"
                        width={20}
                        height={20}
                      />{" "}
                      Đăng ký
                    </Link>
                  </>
                )}
                <Link href="/favorite" className={styles.menuItem}>
                  <Image
                    src="/images/heart-icon.png"
                    alt="Wishlist"
                    width={20}
                    height={20}
                  />
                  Danh sách yêu thích
                  {favoriteCount > 0 && (
                    <span className={styles.favoriteBadge}>
                      {favoriteCount}
                    </span>
                  )}
                </Link>
              </div>
            )}
          </div>
          <Link href="/cart" className={styles.cartIcon}>
            <Image
              src="/images/cart-icon.png"
              alt="Cart"
              width={30}
              height={30}
            />
            <span className={styles.cartBadge}>{cartCount}</span>
          </Link>
        </div>
        <div className={styles.icons}>
          <Link href="/product">
            <button>Đặt món online</button>
          </Link>
          <Link href="/booking">
            <button>Đặt bàn</button>
          </Link>
        </div>
      </div>
      <div className={styles.navbar}>
        {menuItems.map(({ href, label, isDropdown }) =>
          isDropdown ? (
            <div
              key={href}
              className={styles.productMenuContainer}
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              <Link href={href}>{label}</Link>
              {showProductMenu && (
                <div className={styles.dropdownMenu}>
                  {productCategories.map(({ href, label }) => (
                    <Link key={href} href={href} className={styles.menuItem}>
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link key={href} href={href}>
              {label}
            </Link>
          )
        )}
      </div>
  
    </header>
  );
  
}
