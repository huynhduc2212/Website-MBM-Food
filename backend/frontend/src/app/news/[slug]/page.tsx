"use client";

import { useEffect, useState,useRef  } from "react";
// import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchFeaturedNews, fetchNewsDetail, Post,incrementView } from "../../../services/post";
import "../../../styles/id.css";
import "../../../styles/new.css";
import CommentSection from "@/app/comments/CommentSection";
import Image from "next/image";

export default function NewsDetail() {
  const { slug } = useParams();
  console.log("Slug từ useParams:", slug);

  const [post, setPost] = useState<Post | null>(null);
  const [tintucNoibat, setTintucNoibat] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasViewed = useRef(false); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) {
          setError("Không tìm thấy slug bài viết");
          setLoading(false);
          return;
        }
  
        // 🔥 Tách riêng fetch chi tiết bài viết
        const data = await fetchNewsDetail(slug as string);
        if (!data) throw new Error("Bài viết không tồn tại.");
  
        // 🔥 Sau khi chắc chắn có _id thì mới gọi tăng view
        if (!hasViewed.current) {
          await incrementView(data._id);
          hasViewed.current = true;  // Đánh dấu là đã tăng lượt xem
        }
  
        const featuredNews = await fetchFeaturedNews();
        if (!featuredNews.length) throw new Error("Không có tin nổi bật.");
  
        // ✅ Lưu vào state
        setPost(data);
        setTintucNoibat(featuredNews);
        setError(null);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [slug]);
  

  if (loading) return <p>Đang tải bài viết...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return null;

  // Trích xuất URL ảnh từ chuỗi HTML (nếu có)
  // const extractImageSrc = (htmlString: string | undefined): string | null => {
  //   if (!htmlString) return null;
  //   const match = htmlString.match(/<img[^>]+src="([^">]+)"/);
  //   return match ? match[1] : null;
  // };

//   const truncateHTML = (html: string) => {
//     const tempDiv = document.createElement("div");
//     tempDiv.innerHTML = html;
//     return tempDiv.innerHTML; 
// };


  return (
    <div className="about-container">
      <div className="article-container">
        <article className="article-main">
          <div className="row">
            <div className="right-content col-lg-8 col-12">
              <div className="article-detail clearfix">
                <h1 className="article-title">{post.title}</h1>
                <div className="posts">
                  <div className="time-post f">
                  <svg aria-hidden="true" focusable="false" data-prefix="fal" data-icon="clock" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="svg-inline--fa fa-clock fa-w-16"><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216zm-148.9 88.3l-81.2-59c-3.1-2.3-4.9-5.9-4.9-9.7V116c0-6.6 5.4-12 12-12h14c6.6 0 12 5.4 12 12v146.3l70.5 51.3c5.4 3.9 6.5 11.4 2.6 16.8l-8.2 11.3c-3.9 5.3-11.4 6.5-16.8 2.6z" className=""></path></svg>                    {new Date(post.create_at).toLocaleDateString()}
                  </div>
                  <div className="time-post">
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="user" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="svg-inline--fa fa-user fa-w-14"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z" className=""></path></svg>
                    <span>{post.author}</span>
                  </div>
                  <div className="goto-warpper ftoc-head">
                    <a href="title-goto-wrapper" style={{fontWeight: "bold", paddingBottom:"10px"}}>Nội dung chính</a>
                  <div className="dola-toc">
                    <ol className="toc-list" dangerouslySetInnerHTML={{ __html: post.summary || "" }} />
                  </div>
                  </div>
                </div>
                <div className="content" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
              </div>
            </div>
          </div>
        </article>

        {/* Sidebar */}
        <div className="col-xl-4">
          <div className="aside-section">
            <h2 className="aside-title">Danh mục tin tức</h2>
            <ul className="aside-list">
              <li><Link href="/">Trang chủ</Link></li>
              <li><Link href="/about">Giới thiệu</Link></li>
              <li className="menu-item">
                <Link href="/product">Sản phẩm</Link>
                <button className="toggle-button" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? "−" : "+"}
                </button>
              </li>
              {isOpen && (
                <ul className="submenu">
                  <li><Link href="/pizza">Pizza</Link></li>
                  <li><Link href="/khai-vi">Khai vị</Link></li>
                  <li><Link href="/my-y">Mỳ Ý</Link></li>
                  <li><Link href="/salad">Salad</Link></li>
                  <li><Link href="/thuc-uong">Thức uống</Link></li>
                </ul>
              )}
              <li><Link className="font-bold" href="/news">Tin tức</Link></li>
              <li><Link href="/contact">Liên hệ</Link></li>
              <li><Link href="/faq">Câu hỏi thường gặp</Link></li>
              <li><Link href="/booking">Đặt bàn</Link></li>
            </ul>
          </div>

          <div className="aside-section">
            <h2 className="aside-title">Tin tức nổi bật</h2>
            <div className="item-blog-small">
              <ul className="aside-list">
                {tintucNoibat.map((ttnoibat, i) => (
                  <li className="aside-news-item" key={i}>
                    <div className="block-thumb">
                      <Link href={`/news/${ttnoibat.slug}`}>
                        <img
                          src={
                            ttnoibat.imageSummary
                                ? `${process.env.NEXT_PUBLIC_URL_IMAGE}/images/${ttnoibat.imageSummary}`
                                : "/placeholder.jpg"
                        }
                          alt={ttnoibat.title}
                          width={120}
                          height={120}
                        />
                      </Link>
                    </div>
                    <div className="block-content">
                      <Link href={`/news/${ttnoibat.slug}`}>
                        {ttnoibat.title}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/*Comment*/}
        <CommentSection postId={post._id} />
          {/* <div className="col-12 order-lg-3">
            <div className="thump-comment">
              <form action="" method="post" id="article_comments">
                <input name="" type="hidden" value="article_comment" />
                <input name="utf8" type="hidden" value="true" />
                <div className="form-comment">
                  <div className="margin-top-0 margin-bottom-30 w-100">
                    <div className="title-page">
                      <span>Viết bình luận của bạn</span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <fieldset className="form-group padding 0">
                        <input type="text" placeholder="Họ tên" className="form-control form-control-lg" 
                        id="full-name" />
                      </fieldset>
                    </div>
                    <div className="col-md-6">
                      <fieldset className="form-group padding 0">
                        <input type="email" placeholder="Email" className="form-control form-control-lg" 
                         name="Email" required/>
                      </fieldset>
                    </div>
                    <fieldset className="form-group col-lg-12 col-md-12 col-sm-12 col-xs-12">
                      <textarea placeholder="Nội dung" name="Body" id="comment" rows={6} 
                      className="form-control form-control-lg" required></textarea>
                    </fieldset>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary button_45">Gửi thông tin</button>
                    </div>
                  </div>
                </div>
              </form>
              <div id="article-comments">
                <h5 className="title-form-coment margin-bottom-25">Bình luận (3)</h5>
                <div className="article-comment clearfix">
                  <figure className="article-comment-user-image">
                    <img src="" alt="binh-luan" className="block" />
                  </figure>
                  <div className="article-comment-user-comment">
                    <p className="user-name-comment">
                      <strong>Hoàng Tèo</strong>
                      <a href="" className="btn-link pull-xs-right d-none">Trả lời</a>
                    </p>
                    <span className="article-comment-date-bull">14/01/2025</span>
                    <p className="cm">dada</p>
                  </div>         
                </div>
                <div className="article-comment clearfix">
                  <figure className="article-comment-user-image">
                    <img src="" alt="binh-luan" className="block" />
                  </figure>
                  <div className="article-comment-user-comment">
                    <p className="user-name-comment">
                      <strong>Hoàng Tèo</strong>
                      <a href="" className="btn-link pull-xs-right d-none">Trả lời</a>
                    </p>
                    <span className="article-comment-date-bull">14/01/2025</span>
                    <p className="cm">dada</p>
                  </div>         
                </div>
                <div className="article-comment clearfix">
                  <figure className="article-comment-user-image">
                    <img src="" alt="binh-luan" className="block" />
                  </figure>
                  <div className="article-comment-user-comment">
                    <p className="user-name-comment">
                      <strong>Hoàng Tèo</strong>
                      <a href="" className="btn-link pull-xs-right d-none">Trả lời</a>
                    </p>
                    <span className="article-comment-date-bull">14/01/2025</span>
                    <p className="cm">dada</p>
                  </div>         
                </div>
              </div>
            </div>
          </div> */}
      </div>
    </div>
  );
}
