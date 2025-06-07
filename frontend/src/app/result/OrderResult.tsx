"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";

interface PaymentMethod {
  _id: string;
  payment_name: string;
}

interface Order {
  order_code: string;
  id_user: {
    _id: string;
    email?: string;
  };
  address: string;
  phone: string;
  id_payment_method: {
    _id: string;
  };
  _id: string;
  total_payment: number;
  total_amount: number;
  note: string;
  name: string;
  receive_address: string;
  payment_status: string;
  details: {
    _id: string;
    id_product: {
      _id: string;
      name: string;
      variants: { price: number }[];
    };
    price: number;
    quantity: number;
    name: string;
  }[];
}

const OrderResult = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const resultCode = searchParams.get("resultCode");

  useEffect(() => {
    if (!orderId) return;
    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/payments`
        );
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error("Lỗi lấy phương thức thanh toán:", error);
      }
    };
    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/orders/code/${orderId}`
        );
        const data = await response.json();
        
        if (data.success && data.data) {
          const updatedOrder = {
            ...data.data,
            orderDetails: data.data.details || [],
          };

          // 🔥 Kiểm tra callback Momo
          const momoSuccess = await handleMomoCallback(data.data.order_code, Number(resultCode));


          // ✅ Nếu thanh toán thành công, cập nhật lại state
          if (updatedOrder.payment_status === "Completed" || momoSuccess) {
            updatedOrder.payment_status = "Completed";
            await sendConfirmationEmail(updatedOrder);
          }

          // 🛒 Xóa giỏ hàng
          localStorage.removeItem("cart");
          window.dispatchEvent(new Event("cartUpdated"));

          setOrder(updatedOrder);
        }
      } catch (error) {
        console.error("Lỗi kết nối đến API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();fetchPaymentMethods();
  }, [orderId]);
  
  useEffect(() => {
    if (!orderId) return;
  
    const interval = setInterval(async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/orders/code/${orderId}`
        );
        const data = await response.json();
  
        if (data.success && data.data) {
          setOrder(data.data);
  
          // Nếu thanh toán đã thành công, dừng polling
          if (data.data.payment_status === "Completed") {
            clearInterval(interval);
          }
        }
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
      }
    }, 2000); // Kiểm tra lại mỗi 5 giây
  
    return () => clearInterval(interval); // Cleanup interval khi component unmount
  }, [orderId]);
  

  // 🎯 Theo dõi order.payment_status để cập nhật lại UI khi thay đổi
  useEffect(() => {
    if (order?.payment_status === "Completed") {
      setOrder({ ...order });
    }
  }, [order?.payment_status]);




  // 🏦 Gửi yêu cầu callback Momo để cập nhật trạng thái thanh toán
  const handleMomoCallback = async (orderCode: string, resultCode: number) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/payments/momo/callback`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: orderCode, resultCode }),
        }
      );
  
      const data = await response.json();
      console.log("🔄 Kết quả xử lý Momo:", data);
  
      // Nếu người dùng huỷ giao dịch
      if (data.resultCode === 1006) {
        console.warn("❌ Giao dịch bị huỷ bởi người dùng (resultCode 1006)");
        return false;
      }
  
      // Nếu giao dịch thành công
      if (data.success && data.resultCode === 0) {
        setOrder((prevOrder) =>
          prevOrder ? { ...prevOrder, payment_status: "Completed" } : prevOrder
        );
        return true;
      }
  
      return false;
    } catch (error) {
      console.error("❌ Lỗi gửi callback Momo:", error);
      return false;
    }
  };
  

  // 📧 Gửi email xác nhận đơn hàng
  const sendConfirmationEmail = async (orderData: Order) => {
    if (
      !orderData.id_user?.email ||
      !orderData.details ||
      orderData.details.length === 0
    ) {
      console.error("❌ Lỗi: Thiếu email hoặc dữ liệu đơn hàng!", orderData);
      return;
    }

    try {
      console.log("📩 Đang gửi email với dữ liệu:", {
        email: orderData.id_user.email,
        orderDetails: orderData.details.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_URL_IMAGE}/api/email/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: orderData.id_user.email,
            orderDetails: orderData.details.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
          }),
        }
      );

      const data = await response.json();
      console.log("📩 Kết quả gửi email:", data);
    } catch (error) {
      console.error("❌ Lỗi gửi email xác nhận:", error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!order) {
    return <p>Không tìm thấy đơn hàng.</p>;
  }

  // Lấy tên phương thức thanh toán
  const paymentMethod = paymentMethods.find(
    (method) => method._id === order.id_payment_method._id
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-green-600 flex items-center">
            <span className="text-red-500 text-5xl mr-2">MBM</span>
            <span className="text-red-500 ml-1">Food</span>
          </h2>
        </div>

        <div className="mt-6 text-center">
          <div className="text-green-600 text-5xl">✔</div>
          <h2 className="text-xl font-semibold mt-3">Cảm ơn bạn đã đặt hàng</h2>
          {order.id_user.email && order.payment_status === "Completed" && (
            <p className="text-gray-600 text-sm">
              Một email xác nhận đã được gửi tới <b>{order.id_user.email}</b>.
              Xin vui lòng kiểm tra email của bạn.
            </p>
          )}
        </div>

        <div className="mt-6 flex justify-between border p-4 rounded-lg">
          <div>
            <h3 className="font-semibold">THÔNG TIN MUA HÀNG</h3>
            <p>
              <strong>Khách hàng : </strong>
              {order.name}
            </p>
            <p>
              <strong>Email : </strong>
              {order.id_user.email}
            </p>
            <p>
              <strong>Số điện thoại : </strong>
              {order.phone}
            </p>
          </div>
          <div>
            <h3 className="font-semibold">PHƯƠNG THỨC THANH TOÁN</h3>
            <p>
              {paymentMethod
                ? paymentMethod.payment_name === "cash"
                  ? "Tiền Mặt"
                  : paymentMethod.payment_name === "momo"
                  ? "Chuyển khoản Momo"
                  : paymentMethod.payment_name
                : "Không xác định"}
            </p>
          </div>
        </div>

        <div className="mt-6 border p-4 rounded-lg text-center">
          <h3 className="font-semibold">Trạng thái thanh toán</h3>
          <p
            className={`${
              order.payment_status === "Completed"
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {order.payment_status === "Completed" ? "Thành công" : "Thất bại"}
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Tiếp tục mua hàng
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderResult;