import Image from "next/image";
import "../../styles/about.css";
import "../../styles/new.css";
import "../../styles/id.css";


export default function About() {
  return (
    <div className="about-container">
      <section className="section_about_1">
        <div className="container">
          <div className="thumb-module">
            <div className="row">
              <div className="col-md-6 col-lg-5">
                <div className="image-effect">
                  <Image src={"/images/about-page.png"} alt={""} width={500} height={200}></Image>
                </div>
              </div>
              <div className="col-md-6 col-lg-7">
                <span className="title-smail">Về chúng tôi</span>
                <span className="title">MBM</span>
                <span className="content">
						      Chào mừng bạn đến với MBM - điểm đến lý tưởng cho những người yêu thưởng thức pizza tại thành phố! MBM tự hào là địa chỉ pizza hàng đầu, 
                  nổi tiếng với chất lượng món ăn tuyệt vời, dịch vụ tận tâm và mức độ hài lòng cao từ phía khách hàng.
                </span>
                <ul>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Chất lượng hàng đầu
                  </li>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Dịch vụ chăm sóc khách hàng xuất sắc
                  </li>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Menu đa dạng phong phú
                  </li>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Chất lượng nguyên liệu cao cấp
                  </li>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Không gian thoải mái và ấm cúng
                  </li>
                  <li>
                  <svg fill="#000000" width="16" height="16" viewBox="0 0 24 24" version="1.2" baseProfile="tiny" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.972 6.251c-.967-.538-2.185-.188-2.72.777l-3.713 6.682-2.125-2.125c-.781-.781-2.047-.781-2.828 0-.781.781-.781 2.047 0 2.828l4 4c.378.379.888.587 1.414.587l.277-.02c.621-.087 1.166-.46 1.471-1.009l5-9c.537-.966.189-2.183-.776-2.72z"/></svg>
                  Ưu đãi và khuyến mãi hấp dẫn
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section_about_2">
        <div className="container">
          <div className="thumb-module">
            <div className="row">
              <div className="col-xl-4">
                <span className="title-smail">Tại sao chọn</span>
                <span className="title">MBM</span>
                <span className="content">                 
						      Đến với MBM, bạn sẽ không chỉ là khách hàng mà còn là thành viên của một cộng đồng yêu thực phẩm ngon. 
                  Hãy để chúng tôi đưa bạn vào hành trình khám phá hương vị tuyệt vời của pizza và ẩm thực đa dạng tại MBM!				
                </span>
              </div>
              <div className="col-xl-8">
                <div className="row">
                  <div className="col-md-4">
                    <div className="item">
                      <Image src={"/images/icon1_about2.png"} alt={"Tốc độ nhanh"} width={60} height={50}></Image>
                      <span className="title-item">Tốc độ nhanh</span>
                      <span className="content-item">Thời gian chế biến nhanh nhưng vẫn đảm bảo chất lượng</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="item">
                      <Image src={"/images/icon2_about2.png"} alt={"Không gian thoải mái"} width={60} height={100}></Image>
                      <span className="title-item">Không gian thoải mái</span>
                      <span className="content-item">Không gian luôn đảm bảo tiêu chí gọn gàn, sạch sẽ, thoáng mát</span>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="item">
                      <Image src={"/images/icon3_about2.png"} alt={"Đặt hàng nhanh chóng"} width={60} height={100}></Image>
                      <span className="title-item">Đặt hàng nhanh chóng</span>
                      <span className="content-item">Dịch vụ giao hàng giúp bạn ngồi ở nhà vẫn được thưởng thức món ăn ngon</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="section_about_3">
        <div className="container">
          <h3 className="title-index">
            <b>Đầu bếp</b>
            <span className="title-name">Người tạo ra những món ăn chất lượng</span>
          </h3>
          <div className="swiper-container">
            <div className="swiper-wrapper">
              <div className="swiper-slide item swiper-slide-active">
                <div className="image">
                  <Image src={"/images/image1_about3.png"} alt={""} width={500} height={100}></Image>
                </div>
                <div className="thumb-content">
                  <div className="title">Bếp trưởng</div>
                  <div className="content">
                    <span>David Latham</span>                    
							        Người đưa ra nhiều công thức cho tất cả món ăn
                  </div>
                </div>
              </div>
              <div className="swiper-slide item swiper-slide-active">
                <div className="image">
                  <Image src={"/images/image2_about3.png"} alt={""} width={500} height={100}></Image>
                </div>
                <div className="thumb-content">
                  <div className="title">Bếp phó</div>
                  <div className="content">
                    <span>Marry Jenica</span>                    
							        Quản lý chất lượng món ăn
                  </div>
                </div>
              </div>
              <div className="swiper-slide item swiper-slide-active">
                <div className="image">
                  <Image src={"/images/image3_about3.png"} alt={""} width={500} height={100}></Image>
                </div>
                <div className="thumb-content">
                  <div className="title">Phụ bếp</div>
                  <div className="content">
                    <span>Joseph Carter</span>                    
							        Người lam ra các món ăn
                  </div>
                </div>
              </div>
              <div className="swiper-slide item swiper-slide-active">
                <div className="image">
                  <Image src={"/images/image4_about3.png"} alt={""} width={500} height={100}></Image>
                </div>
                <div className="thumb-content">
                  <div className="title">Phụ bếp</div>
                  <div className="content">
                    <span>Njelina Rose</span>                    
							        Người làm ra các món ăn
                  </div>
                </div>
              </div>
              <div className="swiper-slide item swiper-slide-active">
                <div className="image">
                  <Image src={"/images/image5_about3.png"} alt={""} width={500} height={100}></Image>
                </div>
                <div className="thumb-content">
                  <div className="title">Phụ bếp</div>
                  <div className="content">
                    <span>Rubina Jenny</span>                    
							        Người làm ra các món ăn
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
