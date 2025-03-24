"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
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

const SuccessPage = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get("_id");
  console.log("Dữ liệu orderId",orderId);
  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`);
        const data = await response.json();
        console.log("Dữ liệu data trả về khi fetch",data);
        if (data._id) {
          setOrder(data);
        } else {
          console.error("Lỗi lấy dữ liệu đơn hàng:", data.message);
        }
      } catch (error) {
        console.error("Lỗi kết nối đến API:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentMethods = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/payments");
        const data = await response.json();
        setPaymentMethods(data);
      } catch (error) {
        console.error("Lỗi lấy phương thức thanh toán:", error);
      }
    };

    fetchOrder();
    fetchPaymentMethods();
  }, [orderId]);

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
        {/* Logo */}
        <div className="flex justify-center">
          <h2 className="text-3xl font-bold text-green-600 flex items-center">
            <span className="text-red-500 text-5xl mr-2">MBM</span>
            <span className="text-red-500 ml-1">Food</span>
          </h2>
        </div>

        {/* Thông báo */}
        <div className="mt-6 text-center">
          <div className="text-green-600 text-5xl">✔</div>
          <h2 className="text-xl font-semibold mt-3">Cảm ơn bạn đã đặt hàng</h2>
          {order.id_user.email && (
            <p className="text-gray-600 text-sm">
              Một email xác nhận đã được gửi tới <b>{order.id_user.email}</b>. Xin vui lòng kiểm tra email của bạn.
            </p>
          )}
        </div>

        {/* Thông tin khách hàng */}
        <div className="mt-6 flex justify-between border p-4 rounded-lg">
          <div>
            <h3 className="font-semibold">THÔNG TIN MUA HÀNG</h3>
            <p><strong>Khách hàng : </strong>{order.name}</p>
            <p><strong>Email : </strong>{order.id_user.email}</p>
            <p><strong>Số điện thoại : </strong>{order.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">PHƯƠNG THỨC THANH TOÁN</h3>
            <p>{paymentMethod ? paymentMethod.payment_name : "Không xác định"}</p>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="mt-6 border p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Mã đơn #{order.order_code}</h3>
          {order.details.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b py-2">
              <div>
                <p className="font-semibold">{item.id_product.name}</p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <p className="font-semibold">{item.price.toLocaleString()}đ</p>
            </div>
          ))}

          <div className="flex justify-between font-semibold mt-3">
            <p>TỔNG TIỀN THANH TOÁN</p>
            <p className="text-blue-600">{order.total_payment.toLocaleString()}đ</p>
          </div>
        </div>

        {/* Nút tiếp tục mua hàng */}
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

export default SuccessPage;
