"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { addAddress, getUserById, updateAddress } from "@/services/user";
import styles from "@/styles/Address.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Edit3 } from "lucide-react";
export default function Address() {
    const [showModal, setShowModal] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [districts, setDistricts] = useState<District[]>([]);
    const [wards, setWards] = useState<{ code: string; name: string }[]>([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState<User | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [error, setError] = useState<string | null>(null);
    


    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        company: "",
        address: "",
        city: "",
        district: "",
        ward: "",
        zip: "",
        default: false,
    });
    interface Address {
        _id?: string;
        name: string;
        phone: string;
        company?: string;
        address: string;
        city: string;
        district: string;
        ward: string;
        zip: string;
        default: boolean;
    }

    interface User {
        _id: string;
        username: string;
        address: Address[];
    }
    interface District {
        code: string;
        name: string;
        wards: { code: string; name: string }[];
    }
    
    interface City {
        code: string;
        name: string;
        districts: District[];
    }
    useEffect(() => {
        async function fetchUser() {
            const userId = localStorage.getItem("userId");
            if (userId) {
                try {
                    const response = await getUserById(userId);
                    if (response && !response.error) {
                        setUser(response);
                    }
                } catch (error) {
                    console.error("Lỗi lấy thông tin người dùng:", error);
                }
            }
        }
        fetchUser();
    }, []);

    useEffect(() => {
        axios.get("https://provinces.open-api.vn/api/?depth=3")
            .then(res => {
                const data = res.data;
                const hcmCity = data.find((city: any) => city.name === "Thành phố Hồ Chí Minh"); // Tìm TP.HCM

                if (hcmCity) {
                    setCities([hcmCity]); // Chỉ lưu TP.HCM
                    setDistricts(hcmCity.districts); // Cập nhật danh sách quận/huyện

                    // Chọn quận mặc định (ví dụ: Quận 1)
                    const defaultDistrict = hcmCity.districts[0]; // Quận đầu tiên trong danh sách
                    setWards(defaultDistrict?.wards || []);

                    setFormData(prev => ({
                        ...prev,
                        city: hcmCity.name,
                        district: defaultDistrict?.name || "",
                        ward: "",
                        zip: ""
                    }));
                }
            })
            .catch(err => console.error("Lỗi tải tỉnh/thành:", err));
    }, []);


    useEffect(() => {
        if (formData.city) {
            const selectedCity = cities.find(city => city.name === formData.city);
            setDistricts(selectedCity?.districts || []);
            setWards([]); // Reset phường/xã
        }
    }, [formData.city, cities]); // Theo dõi formData.city

    // const handleCityChange = () => {
    //     setCities(cities.find(city => city.name === "Thành phố Hồ Chí Minh")?.districts || []);
    //     setWards([]);
    //     setFormData(prev => ({
    //         ...prev,
    //         city: "Thành phố Hồ Chí Minh",
    //         district: "",
    //         ward: "",
    //         zip: ""
    //     }));
    // };


    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const districtName = e.target.value;
        const selectedDistrict = districts.find(d => d.name === districtName);
        setWards(selectedDistrict?.wards || []);
        setFormData(prev => ({
            ...prev,
            district: districtName,
            ward: "",
            zip: ""
        }));
    };
    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wardName = e.target.value;
        const selectedWard = wards.find(w => w.name === wardName);
        setFormData(prev => ({
            ...prev,
            ward: wardName,
            zip: selectedWard?.code.toString() || ""
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = e.target instanceof HTMLInputElement ? e.target.checked : false;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const validateForm = () => {
        if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.ward) {
            setError("Vui lòng nhập đầy đủ thông tin.");
            return false;
        }
        setError("");
        return true;
    };
    const handleAddAddress = async () => {
        if (!validateForm()) {
            console.log("Validation failed:", error); // ✅ Kiểm tra xem lỗi có được ghi nhận không
            return;
        }
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (!userId || !token) {
            setMessage("Bạn chưa đăng nhập!");
            return;
        }

        try {
            await addAddress(userId, [formData], token);

            setMessage("Thêm địa chỉ thành công!");
            setShowModal(false);
            setFormData({
                name: "", phone: "", company: "", address: "", city: "", district: "", ward: "", zip: "", default: false
            });
            window.location.reload();
        } catch (error: any) {
            setError("Lỗi: " + error.message);
            console.log([formData])
        }
    };
    const handleEditAddress = (address: Address) => {
        setSelectedAddress(address);
        setFormData({
            name: address.name,
            phone: address.phone,
            company: address.company ?? "",
            address: address.address,
            city: address.city,
            district: address.district,
            ward: address.ward,
            zip: address.zip,
            default: address.default
        });
        setShowUpdateModal(true);
    };
    
    const handleUpdateAddress = async () => {
        const token = localStorage.getItem("token");
    
        if (!selectedAddress || !selectedAddress._id || !user?._id || !token) {
            setMessage("Lỗi: Thiếu thông tin user, địa chỉ hoặc token.");
            return;
        }
    
        try {
            await updateAddress(user._id, selectedAddress._id, formData, token);
            setMessage("Cập nhật địa chỉ thành công!");
            setShowUpdateModal(false);
            window.location.reload();
        } catch (error: any) {
            setMessage("Lỗi: " + error.message);
        }
    };
    


    return (
        <div className={styles.container}>
            <button className={styles.addButton} onClick={() => setShowModal(true)}>
                + Thêm địa chỉ
            </button>
            {user && (
                <div>
                    {user && (
                        <div className="container mt-3">
                            <h5 className="fw-bold">Xin chào, {user.username}</h5>

                            {user.address && user.address.length > 0 ? (
                                <div>
                                   

                                    <h6 className="mt-3 mb-3">📌 Danh sách địa chỉ của bạn:</h6>
                                    <div className="row">
                                        {user.address.map((addr) => (
                                            <div key={addr._id} className="col-md-6">
                                                 
                                                <div className="card shadow-sm mb-3">
                                                    <div className="card-body" style={{
                                                        backgroundColor: "#e6f4ea",
                                                        border: "1px solid #a3d9a5",
                                                        borderRadius: "8px",

                                                    }}>
                                                        <button className="btn btn-sm float-right" onClick={() => handleEditAddress(addr)}>
                                                            <Edit3 size={14} />
                                                        </button>

                                                        <h6 className="card-title fw-bold">{addr.name}</h6>
                                                        <p className="card-text">
                                                            📞 <strong>{addr.phone}</strong> <br />
                                                            📍 {addr.address}, {addr.ward}, {addr.district}, {addr.city} <br />
                                                            🏢 Công ty: {addr.company || "Không có"} <br />
                                                            📮 Zip: {addr.zip}
                                                        </p>
                                                        {addr.default && (
                                                            <span className="badge bg-danger">Mặc định</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted mt-3">Bạn chưa có địa chỉ nào.</p>
                            )}
                        </div>
                    )}

                </div>
            )}
            {showUpdateModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h5>CẬP NHẬT ĐỊA CHỈ</h5>
                            <button className={styles.closeButton} onClick={() => setShowUpdateModal(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <input type="text" name="name" placeholder="Họ tên" className="form-control" onChange={handleChange} value={formData.name} />
                            <input type="text" name="phone" placeholder="Số điện thoại" className="form-control" onChange={handleChange} value={formData.phone} />
                            <input type="text" name="company" placeholder="Công ty (tùy chọn)" className="form-control" onChange={handleChange} value={formData.company} />
                            <input type="text" name="address" placeholder="Địa chỉ" className="form-control" onChange={handleChange} value={formData.address} />
                            <div className={styles.selectGroup}>
                                <input type="text" name="city" value="Thành phố Hồ Chí Minh" disabled className={styles.input} />



                                <select name="district" className="form-control" onChange={handleDistrictChange} value={formData.district} disabled={!formData.city}>
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map(district => <option key={district.code} value={district.name}>{district.name}</option>)}
                                </select>

                                <select name="ward" className="form-control" onChange={handleWardChange} value={formData.ward} disabled={!formData.district}>
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map(ward => <option key={ward.code} value={ward.name}>{ward.name}</option>)}
                                </select>

                            </div>
                            <input type="text" name="zip" placeholder="Mã Zip" className="form-control" value={formData.zip} readOnly />
                            <div className={styles.checkboxContainer}>
                                <input type="checkbox" name="default" onChange={handleChange} />
                                <label>Đặt là địa chỉ mặc định?</label>
                            </div>
                            <button className={styles.confirmButton} onClick={handleUpdateAddress}>Cập nhật địa chỉ</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h5>THÊM ĐỊA CHỈ MỚI</h5>
                            {error && <p className="text-danger">{error}</p>}
                            <button className={styles.closeButton} onClick={() => setShowModal(false)}>×</button>
                        </div>
                        <div className={styles.modalBody}>
                            <input type="text" name="name" placeholder="Họ tên" className="form-control" onChange={handleChange} />
                            <input type="text" name="phone" placeholder="Số điện thoại" className="form-control" onChange={handleChange} />
                            <input type="text" name="company" placeholder="Công ty (tùy chọn)" className="form-control" onChange={handleChange} />
                            <input type="text" name="address" placeholder="Địa chỉ" className="form-control" onChange={handleChange} />
                            <div className={styles.selectGroup}>
                                <input type="text" name="city" value="Thành phố Hồ Chí Minh" disabled className={styles.input} />


                                <select name="district" className="form-control" onChange={handleDistrictChange} value={formData.district} disabled={!formData.city}>
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map(district => <option key={district.code} value={district.name}>{district.name}</option>)}
                                </select>

                                <select name="ward" className="form-control" onChange={handleWardChange} value={formData.ward} disabled={!formData.district}>
                                    <option value="">Chọn phường/xã</option>
                                    {wards.map(ward => <option key={ward.code} value={ward.name}>{ward.name}</option>)}
                                </select>

                            </div>
                            <input type="text" name="zip" placeholder="Mã Zip" className="form-control" value={formData.zip} readOnly />
                            <div className={styles.checkboxContainer}>
                                <input type="checkbox" name="default" onChange={handleChange} />
                                <label>Đặt là địa chỉ mặc định?</label>
                            </div>
                        </div>
                        <div className={styles.modalFooter}>
                            <button className={styles.cancelButton} onClick={() => setShowModal(false)}>Hủy</button>
                            <button className={styles.confirmButton} onClick={handleAddAddress}>Thêm địa chỉ</button>
                        </div>
                    </div>
                </div>
            )}
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}
