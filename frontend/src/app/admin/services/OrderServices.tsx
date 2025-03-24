const API_URL = "http://localhost:3001/api/orders";

const getOrdersByUserId = async (userId:any) => {
    try {
        const response = await fetch(`${API_URL}/user/${userId}`);
        if (!response.ok) throw new Error("Lỗi khi lấy đơn hàng");
        return await response.json();
    } catch (error) {
        console.error(error);
        return { orders: [], orderDetails: [] };
    }
};

const getAllOrders = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`Lỗi khi lấy danh sách đơn hàng: ${response.statusText}`);
        }
        
        const data = await response.json(); // Chỉ gọi json() một lần
        console.log("Fetched Orders:", data); // Kiểm tra dữ liệu nhận được
        return data;
    } catch (error) {
        console.error("Lỗi:", error);
        return [];
    }
};
const updateOrderStatus = async (orderId: string, data: { order_status: string }) => {
    try {
        const response = await fetch(`http://localhost:3001/api/orders/${orderId}/status`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`Lỗi cập nhật trạng thái: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái đơn hàng:", error);
        return null; // Tránh quăng lỗi không kiểm soát
    }
};

  

  
export default { getOrdersByUserId, getAllOrders,updateOrderStatus };
