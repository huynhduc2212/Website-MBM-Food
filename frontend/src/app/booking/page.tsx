"use client";
import { jwtDecode } from "jwt-decode";
import BookingServices from "@/services/Booking";
import { TCreateRegisterParams } from "@/types/enum";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";

const API_URL = process.env.NEXT_PUBLIC_URL_IMAGE;

interface Table {
  _id: string;
  name: string;
  position: string;
  status: "Available" | "Reserved";
  image: string;
}

interface Address {
  name: string;
  phone: string;
}

interface User {
  _id: string;
  email: string;
  address: Address[];
}

const Booking = () => {
  const router = useRouter();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dataTable, setDataTable] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bookingDate: "",
    bookingTime: "",
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tables = await BookingServices.getAllTables();
        setDataTable(tables);

        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = (decodedToken as { userId: string })?.userId;

          if (userId) {
            const user = await BookingServices.getUserById(userId);
            setUserData(user);

            if (user.address && user.address.length > 0) {
              setFormData((prev) => ({
                ...prev,
                name: user.address[0].name || "",
                email: user.email || "",
                phone: user.address[0].phone || "",
              }));
            } else {
              setFormData((prev) => ({
                ...prev,
                email: user.email || "",
              }));
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTableSelection = (tableId: string) => {
    const table = dataTable.find((table) => table._id === tableId);
    if (table?.status === "Reserved") {
      return;
    }
    setSelectedTable(tableId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData && (!userData.address || userData.address.length === 0)) {
      try {
        // Gọi API để thêm địa chỉ từ thông tin đặt bàn
        await BookingServices.addAddressFromBooking({
          name: formData.name,
          phone: formData.phone,
        });

        // Không cần đợi kết quả vì chúng ta tiếp tục xử lý đặt bàn
      } catch (error) {
        console.error("Error updating user address:", error);
        // Vẫn tiếp tục đặt bàn ngay cả khi cập nhật địa chỉ thất bại
      }
    }

    if (!selectedTable) {
      toast.error("Vui lòng chọn bàn");
      return;
    }

    if (!formData.bookingDate || !formData.bookingTime) {
      toast.error("Vui lòng chọn ngày và giờ đặt bàn");
      return;
    }

    if (!userData?._id) {
      toast.error("Không thể xác định thông tin người dùng");
      return;
    }

    try {
      setLoading(true);

      const bookingDate = formData.bookingDate;
      const startTime = formData.bookingTime;

      const registerData: TCreateRegisterParams = {
        id_user: userData._id,
        id_table: selectedTable,
        start_time: startTime,
        booking_date: bookingDate,
        status: "Confirmed",
      };

      await BookingServices.createRegister(registerData);

      // Cập nhật lại trạng thái bàn trong danh sách
      const updatedTables = dataTable.map((table) => {
        if (table._id === selectedTable) {
          return { ...table, status: "Reserved" as const };
        }
        return table;
      });

      setDataTable(updatedTables);
      setSelectedTable(null);

      // Reset form
      setFormData((prev) => ({
        ...prev,
        bookingDate: "",
        bookingTime: "",
      }));

      toast.success("Đặt bàn thành công!");
    } catch (error) {
      console.error("Error booking table:", error);
      toast.error("Đặt bàn thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  // Format ngày hiện tại để đặt min cho input date
  const today = new Date().toISOString().split("T")[0];

  return (
    <section className="w-full">
      <div className="heading max-w-[1300px] mx-auto py-3 text-center">
        <h2 className="text-[36px] font-semibold text-[#006a31] mb-[40px] mt-2">
          Đặt bàn
        </h2>
      </div>
      <div className="content bg-[url(https://bizweb.dktcdn.net/100/510/571/themes/941527/assets/datlich.png?1727255430829)] bg-cover py-[100px]">
        <div className="flex row-item 2xl:flex-row xl:flex-row lg:flex-row 2xl:max-w-[1300px] xl:max-w-[1140px] md:flex-col flex-col sm:flex-col lg:max-w-[960px] md:max-w-[720px] sm:max-w-[540px] max-w-[540px] mx-auto gap-x-8 xmall:flex-col xmall:px-4">
          <div className="2xl:flex-[0_0_50%] md:w-full w-full sm:w-full 2xl:mt-0 xl:mt-0 lg:mt-0 xl:flex-[0_0_50%] lg:flex-[0_0_50%]">
            <div className="thumb-time rounded-lg bg-[#fff] p-4 h-full">
              <div className="font-[lobster] text-[30px] text-[#e31837] pb-[10px] text-center mb-[20px] border-b-2 border-b-[#e31837]">
                Thời gian mở cửa
              </div>
              <ul className="list-time ">
                <li className="flex items-center justify-between py-[10px] border-b-2 border-b-[#d4cece] font-semibold">
                  <span>Thứ 2 - Thứ 6</span>
                  <span>08:00 - 21:30</span>
                </li>
                <li className="flex items-center justify-between py-[10px] border-b-2 border-b-[#d4cece] font-semibold">
                  <span>Thứ 7 - Chủ nhật</span>
                  <span>09:00 - 22:30</span>
                </li>
                <li className="flex items-center justify-between py-[10px] border-b-2 border-b-[#d4cece] font-semibold">
                  <span>Ngày lễ</span>
                  <span>09:00 - 22:30</span>
                </li>
              </ul>
              <div className="font-[lobster] text-[30px] text-[#e31837] pb-[10px] text-center mb-[20px] border-b-2 border-b-[#e31837]">
                Gọi ngay
              </div>
              <div className="text-center  text-[#006a31] text-[36px] font-semibold">
                1900 6750
              </div>
            </div>
          </div>
          {previewImage && (
            <div className="fixed bottom-[280px] sm:left-[320px] left-0 z-50 rounded-lg sm:w-[600px] sm:h-[350px] p-3 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Preview Table"
                className="w-full h-full object-cover rounded-2xl border-[6px] border-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
              />
            </div>
          )}

          <div className="2xl:flex-[0_1_50%] md:w-full w-full sm:w-full 2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-5 sm:mt-5 xl:flex-[0_1_50%] lg:flex-[0_1_50%] xmall:mt-5">
            <div className="thumb-time rounded-lg bg-[#006a31] p-4 h-full">
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-1">
                      Họ và tên:
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Họ và tên..."
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md bg-white text-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-1">
                      Email:
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md bg-white text-black outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-semibold mb-1">
                      Số điện thoại:
                    </label>
                    <input
                      type="text"
                      name="phone"
                      placeholder="Số điện thoại..."
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full p-2 rounded-md bg-white text-black outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-semibold mb-1">
                      Chọn ngày:
                    </label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={formData.bookingDate}
                      onChange={handleInputChange}
                      min={today}
                      className="w-full p-2 rounded-md bg-white text-black outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white font-semibold mb-1">
                    Chọn giờ:
                  </label>
                  <input
                    type="time"
                    name="bookingTime"
                    value={formData.bookingTime}
                    onChange={handleInputChange}
                    className="w-full p-2 rounded-md bg-white text-black outline-none"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4 justify-center mt-4">
                  {dataTable.map((table, index) => {
                    const isReserved = table.status === "Reserved";
                    const isSelected = selectedTable === table._id;
                    const isHovered = hoveredIndex === index;

                    const imgPath = `${API_URL}/images/${table.image}`;

                    return (
                      <div
                        key={table._id}
                        className="relative flex flex-col items-center"
                      >
                        <button
                          type="button"
                          className={`relative sm:w-32 sm:h-32 w-16 h-16 rounded-xl flex items-center justify-center font-bold transition-all duration-300 ${
                            isReserved
                              ? "bg-gray-400 cursor-not-allowed"
                              : isSelected
                              ? "bg-red-600 text-white"
                              : "text-white text-lg font-extrabold drop-shadow-[0_0_4px_#ffffff] hover:bg-red-600"
                          }`}
                          onClick={() => handleTableSelection(table._id)}
                          onMouseEnter={() => {
                            setHoveredIndex(index);
                            setPreviewImage(imgPath);
                            setPreviewIndex(index);
                          }}
                          onMouseLeave={() => {
                            setHoveredIndex(null);
                            setPreviewImage(null);
                            setPreviewIndex(null);
                          }}
                          disabled={isReserved}
                        >
                          {!isReserved && !isSelected && (
                            <Image
                              src="/images/tablebg.png"
                              fill
                              alt="Ảnh bàn"
                              className=""
                            />
                          )}
                          {isReserved
                            ? "Đã đặt"
                            : isHovered
                            ? "Đặt bàn"
                            : table.name}
                        </button>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center mt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#e31837] text-white font-bold py-2 px-6 rounded-md hover:bg-red-700 transition-all"
                  >
                    {loading ? "Đang xử lý..." : "Xác nhận đặt bàn"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Booking;
