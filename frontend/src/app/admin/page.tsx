'use client';

import { useEffect, useState, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import OrderServices from './services/OrderServices';


Chart.register(...registerables);

interface Order {
    order_code: string;
    name: string;
    total_amount: number;
    total_payment: number;
    order_status: string;
    createdAt: string;
    details?: { name: string }[];
}

export default function Dashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [successfulOrders, setSuccessfulOrders] = useState(0);
    const [cancelledOrders, setCancelledOrders] = useState(0);
    const [salesChange, setSalesChange] = useState(0);
    const [ordersChange, setOrdersChange] = useState(0);
    const [successfulChange, setSuccessfulChange] = useState(0);
    const [cancelledChange, setCancelledChange] = useState(0);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

    const salesChartRef = useRef<HTMLCanvasElement>(null);
    const statsChartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await OrderServices.getAllOrders();
                setOrders(data);
                processOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }
        fetchOrders();
    }, [selectedMonth, selectedYear]); // Thêm selectedMonth & selectedYear vào dependency


    function processOrders(orders: Order[]) {
        let totalSales = 0;
        let successful = 0;
        let cancelled = 0;
        let totalCancelledAmount = 0;

        let monthlySales: number[] = new Array(12).fill(0);
        let monthlyOrders: number[] = new Array(12).fill(0);
        let monthlySuccessful: number[] = new Array(12).fill(0);
        let monthlyCancelled: number[] = new Array(12).fill(0);
        let monthlyCancelledAmount: number[] = new Array(12).fill(0);

        // ✅ Dữ liệu chỉ của tháng hiện tại
        let currentMonthSales = 0;
        let currentMonthOrders = 0;
        let currentMonthSuccessful = 0;
        let currentMonthCancelled = 0;

        const currentMonth = selectedMonth;
        const currentYear = selectedYear;

        orders.forEach(order => {
            const orderDate = new Date(order.createdAt);
            const month = orderDate.getMonth();
            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            if (order.order_status === 'Delivered' || order.order_status === 'Canceled') {
                if (orderMonth === selectedMonth && orderYear === currentYear) {
                    if (order.order_status === 'Delivered') {
                        currentMonthSales += order.total_payment || 0;
                        currentMonthOrders++;
                        currentMonthSuccessful++;
                    } else if (order.order_status === 'Canceled') {
                        currentMonthCancelled++;
                    }
                }


                // ✅ Tính tổng số liệu cho 12 tháng (Dùng cho biểu đồ)
                if (order.order_status === 'Delivered') {
                    totalSales += order.total_payment || 0;
                    monthlySales[month] += order.total_payment || 0;
                    monthlyOrders[month]++;
                    monthlySuccessful[month]++;
                } else if (order.order_status === 'Canceled') {
                    cancelled++;
                    totalCancelledAmount += order.total_amount || 0;
                    monthlyCancelled[month]++;
                    monthlyCancelledAmount[month] += order.total_amount || 0;
                }
            }
        });

        const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;

        setSalesChange(calcPercentageChange(monthlySales[previousMonth], monthlySales[currentMonth]));
        setOrdersChange(calcPercentageChange(monthlyOrders[previousMonth], monthlyOrders[currentMonth]));
        setSuccessfulChange(calcPercentageChange(monthlySuccessful[previousMonth], monthlySuccessful[currentMonth]));
        setCancelledChange(calcPercentageChange(monthlyCancelled[previousMonth], monthlyCancelled[currentMonth]));

        // ✅ Cập nhật dữ liệu của tháng hiện tại lên Dashboard
        setTotalSales(currentMonthSales);
        setTotalOrders(currentMonthSuccessful + currentMonthCancelled);
        setSuccessfulOrders(currentMonthSuccessful);
        setCancelledOrders(currentMonthCancelled);

        // ✅ Dữ liệu đầy đủ của 12 tháng vẫn gửi vào biểu đồ
        renderCharts(monthlySales, monthlyCancelled, monthlyCancelledAmount);
    }

    function calcPercentageChange(previous: number, current: number): number {
        if (previous === 0) return current === 0 ? 0 : 100;
        return ((current - previous) / previous) * 100;
    }
    function renderCharts(monthlySales: number[], monthlyCancelled: number[], monthlyCancelledAmount: number[]) {
        const currentMonth = new Date().getMonth(); // Lấy tháng hiện tại (0-11)
        const currentYear = new Date().getFullYear();
        const labels: string[] = [];
        const salesData: number[] = [];
        const cancelledData: number[] = [];
        const cancelledAmountData: number[] = [];




        for (let i = 11; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12; // Tính tháng tương ứng trong 12 tháng qua
            const year = currentYear - (currentMonth - i < 0 ? 1 : 0); // Kiểm tra nếu tháng trước là tháng thuộc năm trước thì trừ đi 1 năm
            labels.push(`${monthIndex + 1}/${year}`); // Định dạng MM/YYYY
        }



        // Dữ liệu cũng phải được sắp xếp tương ứng

        for (let i = 11; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            const year = currentYear - (currentMonth - i < 0 ? 1 : 0); // Lấy năm tương ứng với tháng
            const dataIndex = `${monthIndex + 1}/${year}`; // Tạo chuỗi định dạng MM/YYYY để so sánh

            // Thêm các dữ liệu tương ứng vào mỗi tháng
            salesData.push(monthlySales[monthIndex]);
            cancelledData.push(monthlyCancelled[monthIndex]);
            cancelledAmountData.push(monthlyCancelledAmount[monthIndex]);

            // Optional: Nếu bạn muốn kiểm tra và chỉ thêm dữ liệu khi tháng này thuộc năm hiện tại, có thể thêm điều kiện:
            if (`${monthIndex + 1}/${year}` === `${currentMonth + 1}/${currentYear}`) {
                console.log('Tháng hiện tại:', dataIndex); // Để kiểm tra tháng hiện tại
            }
        }

        if (salesChartRef.current) {
            new Chart(salesChartRef.current, {
                type: 'line',
                data: {
                    labels: labels, // Danh sách tháng theo thứ tự mới
                    datasets: [{
                        label: 'Tổng doanh thu',
                        data: salesData,
                        borderColor: 'blue',
                        fill: false
                    }]
                }
            });
        }

        if (statsChartRef.current) {
            new Chart(statsChartRef.current, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: 'Doanh số hàng tháng',
                            data: salesData,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Đơn đặt hàng bị hủy (Số tiền)',
                            data: cancelledAmountData,
                            backgroundColor: 'rgba(255, 99, 132, 0.5)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        }
                    ]
                }
            });
        }
    }



    return (
        <div className="mt-4 pl-4">
            <div className="row mb-3">
                <div className="col-md-6">
                    <label>Chọn tháng:</label>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}>{`Tháng ${i + 1}`}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-6">
                    <label>Chọn năm:</label>
                    <select
                        className="form-select"
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                        {Array.from({ length: 5 }, (_, i) => {
                            const year = new Date().getFullYear() - i;
                            return (
                                <option key={year} value={year}>{year}</option>
                            );
                        })}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                <DashboardCard title={`Tổng doanh thu tháng ${selectedMonth + 1}/${selectedYear}`} value={`${totalSales.toLocaleString()} VND`} change={salesChange} icon="bi-cash-stack" color="success" />
                <DashboardCard title="Tổng đơn hàng" value={totalOrders} change={ordersChange} icon="bi-cart-fill" color="primary" />
                <DashboardCard title="Đơn hàng thành công" value={successfulOrders} change={successfulChange} icon="bi-check-circle" color="success" />
                <DashboardCard title="Đơn hàng bị hủy" value={cancelledOrders} change={cancelledChange} icon="bi-x-circle" color="danger" />
            </div>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h5 className="card-title">Tổng doanh thu</h5>
                        <canvas ref={salesChartRef}></canvas>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-3 shadow-sm">
                        <h5 className="card-title">Doanh số hàng tháng</h5>
                        <canvas ref={statsChartRef}></canvas>
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12">
                    <div className="card p-3 shadow-sm">
                        <h5 className="card-title">Đơn đặt hàng gần đây</h5>
                        <table className="table table-hover">
                            <thead className="table-success">
                                <tr>
                                    <th>Mã đơn hàng</th>
                                    <th>Khách hàng</th>
                                    <th>Sản phẩm</th>
                                    <th>Thành tiền</th>
                                    <th>Trạng thái </th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders
                                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sắp xếp giảm dần theo thời gian
                                    .slice(0, 5) // Lấy 5 đơn mới nhất
                                    .map((order) => (
                                        <tr key={order.order_code}>
                                            <td>{order.order_code}</td>
                                            <td>{order.name}</td>
                                            <td>{order.details?.map(d => d.name).join(', ') || 'N/A'}</td>
                                            <td>{order.total_payment.toLocaleString()} VND</td>
                                            <td>{order.order_status}</td>
                                        </tr>
                                    ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
function DashboardCard({ title, value, change, icon, color }: { title: string; value: string | number; change: number; icon: string; color: string; }) {
    return (
        <div className="col-md-3">
            <div className="card shadow-sm p-3 text-center">
                <i className={`bi ${icon} text-${color} fs-1`}></i>
                <h5 className="card-title mt-2">{title}</h5>
                <p className="fs-4 fw-bold">{value.toLocaleString()}</p>
                <p className={`fs-6 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                    {change >= 0 ? `▲ ${change.toFixed(2)}%` : `▼ ${Math.abs(change).toFixed(2)}%`}
                </p>
            </div>
        </div>
    );
}