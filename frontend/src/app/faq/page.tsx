"use client";

import Link from "next/link";
import { useState } from "react";
import "../../styles/new.css";
import "../../styles/faq.css";


export default function faq() {
  // Trạng thái lưu câu hỏi nào đang mở
  const [openIndex, setOpenIndex] = useState();

  //Hàm đóng mở câu hỏi
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  //Dữ liệu câu hỏi và trả lời
  const faqData = [
    {
      category: "Hỏi đáp về tài khoản",
      questions: [
        {
          question: "1. Làm thế nào để tôi trở thành thành viên MBM",
          answer:
            "Quý khách vui lòng nhấn vào nút “Đăng ký” ở thanh menu trên cùng của màn hình (Đối với Desktop) hoặc tại góc trái màn hình, chọn biểu tượng Menu rồi chọn “Đăng ký” (Đối với Mobile).",
        },
        {
          question: "2. Tại sao tôi không thể đăng nhập vào tài khoản của tôi?",
          answer:
            "Quý khách vui lòng kiểm tra kỹ về kiểu gõ hoặc phím Caps Lock/ IN HOA trong quá trình điền thông tin đăng nhập thành viên, trường hợp không thể đăng nhập thành công quý khách vui lòng chọn nút “Quên mật khẩu” ngay dưới ô mật khẩu và nhập email đã đăng ký.",
        },
        {
          question:
            "3. Tôi có thể sử dụng chung tài khoản với người khác được không?",
          answer:
            "Quý khách nên sử dụng tài khoản cá nhân để đảm bảo độ tin cậy cũng như quyền lợi của bản thân khi mua sắm. Việc sử dụng chung tài khoản có thể dẫn đến những sai sót mà người chịu ảnh hưởng trực tiếp chính là quý khách hàng.",
        },
        {
          question: "4. Tại sao tôi nên đăng ký thành viên Dola?",
          answer:
            "Việc đăng ký tài khoản là cơ hội giúp quý khách trở thành một trong những khách hàng thân thiết của Dola, được tiếp cận nhanh nhất các chương trình khuyến mãi, thông tin ưu đãi khi mua sắm.",
        },
        {
          question:
            "5. Dola có chương trình ưu đãi nào hấp dẫn dành cho khách hàng thân thiết?",
          answer:
            "Khi tổng giá trị đơn hàng của quý khách tích lũy đạt đủ điều kiện của từng mức hạng thành viên, quý khách sẽ nhận được ưu đãi giảm giá cho mọi đơn hàng tương, voucher sinh nhật tương ứng của hạng mức thành viên.",
        },
      ],
    },
    {
      category: "Hỏi đáp về đặt hàng",
      questions: [
        {
          question: "1. Tôi có thể đặt hàng bằng những hình thức nào?",
          answer:
            "Đặt hàng trên website, hotline 1900 6750, sàn thương mại điện tử hoặc tại cửa hàng.",
        },
        {
          question: "2. Tôi cần hỗ trợ mua hàng, làm cách nào để liên hệ?",
          answer:
            "Để liên hệ với nhân viên tư vấn, quý khách vui lòng liên hệ qua Hotline 1900 6750 trong thời gian từ 9:00 – 18:00,  T2 – T6 hằng tuần.",
        },
        {
          question: "3. MBM có giới hạn số lượng sản phẩm khi đặt hàng không?",
          answer:
            "Quý khách có thể đặt hàng với số lượng sản phẩm tùy ý. Đối với các sản phẩm có giới hạn về số lượng (trong các dịp flashsale, sale các dịp lễ Tết), hệ thống sẽ cập nhật số lượng được  mua tối đa và chỉ ghi nhận đơn hàng có số lượng đặt mua trong giới hạn.",
        },
        {
          question: "4. Tôi muốn xem lại lịch sử đơn hàng?",
          answer:
            "Quý khách vào trang tài khoản bằng cách bấm vào nút “Tài khoản” ở thanh menu trên cùng của màn hình (Đối với Desktop) hoặc tại góc trái màn hình, chọn biểu tượng Menu rồi chọn “Tài khoản” (Đối với Mobile). Sau đó chọn “Đơn hàng của bạn” để kiểm tra lại các sản phẩm đã đặt mua. Hoặc quý khách có thể kiểm tra lại những email Dola thông báo trạng thái đơn hàng.",
        },
        {
          question: "5. Tôi có thể hủy hoặc thay đổi đơn hàng không?",
          answer:
            "Liên hệ hotline 1900 6750, đơn hàng chỉ hủy được khi chưa giao cho đơn vị vận chuyển.",
        },
        {
          question:
            "6. Tôi muốn khiếu nại/ đổi trả hàng, quy trình thực hiện như thế nào?",
          answer:
            "Dola luôn sẵn lòng đón nhận các ý kiến góp ý và phản hồi của quý khách quý khách vui lòng liên hệ tư vấn viên của Dola Hotline 1900 6750 để được hủy hoặc thay đổi sản phẩm trong đơn hàng.",
        },
      ],
    },
    {
      category: "Hỏi đáp về thanh toán",
      questions: [
        {
          question: "Tôi có thể thanh toán đơn hàng bằng những hình thức nào?",
          answer:
            "COD (thanh toán khi nhận hàng) hoặc chuyển khoản trước vào tài khoản của MBM.",
        },
      ],
    },
    {
      category: "Hỏi đáp về giao hàng",
      questions: [
        {
          question: "1. MBM có giao hàng toàn quốc không?",
          answer: "Có, phí và thời gian giao hàng phụ thuộc vào khu vực.",
        },
        {
          question: "2. Tôi có được hỗ trợ phí vận chuyển không?",
          answer:
            "TP.HCM miễn phí với đơn từ 500,000 VND, toàn quốc miễn phí từ 1,500,000 VND.",
        },
        {
          question: "3. Bao lâu thì tôi nhận được sản phẩm?",
          answer: "TP.HCM: 1-2 ngày, tỉnh khác: 3-5 ngày.",
        },
      ],
    },
  ];
  return (
    <div className="about-container">
      <div className="page page-faq">
        <div className="container">
          <div className="pg_page padding-top-15">
            <div className="row">
              <div className="col-lg-9">
                <div className="content-page">
                  {faqData.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className="faq-title">{section.category}</h3>
                      <div className="product-tab">
                        <div className="panel-group">
                          {section.questions.map((item, index) => {
                            const currentIndex = `${sectionIndex}-${index}`;
                            return (
                              <div key={currentIndex} className="faq">
                                <h4
                                  onClick={() => toggleFAQ(currentIndex)}
                                  className={
                                    openIndex === currentIndex ? "active" : ""
                                  }
                                >
                                  {item.question}
                                </h4>
                                <div
                                  className={`content ${
                                    openIndex === currentIndex ? "open" : ""
                                  }`}
                                >
                                  <p>{item.answer}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-lg-5">
                <div className="contact">
                  <h4>Giải đáp thắc mắc</h4>
                  <span className="content-form">
                    Nếu bạn có thắc mắc gì, có thể gửi yêu cầu cho chúng tôi, và
                    chúng tôi sẽ liên lạc lại với bạn sớm nhất có thể .
                  </span>
                  <div id="pagelogin">
                    <form action="">
                      <div className="group_contact">
                        <input
                          type="text"
                          placeholder="Họ tên"
                          className="form-control"
                        />
                        <input
                          type="email"
                          placeholder="Email"
                          className="form-control"
                        />
                        <input
                          type="number"
                          placeholder="Điện thoại"
                          className="form-control"
                        />
                        <textarea
                          name=""
                          id=""
                          placeholder="Nội dung"
                          className="form-control"
                        ></textarea>
                        <button type="submit" className="btn-lienhe">
                          Gửi thông tin
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
