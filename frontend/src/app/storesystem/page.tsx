"use client";
import Link from "next/link";
import "../../styles/new.css";
import "../../styles/Storesystem.css";
import { useState } from "react";

export default function Storesystem(){
    const [selectedCity, setSelectedCity] = useState("ALL");
    const [mapUrl, setMapUrl] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    
    // Danh sách cửa hàng mẫu
    const storeList = [
        { name: "MBM Sài Gòn", address: "số 184, đường Lê Đại Hành, phường 15, Quận 11, TP. Hồ Chí Minh", city: "Hồ Chí Minh", phone: "19005236" },
        { name: "MBM Lý Thường Kiệt", address: "153 Lý Thường Kiệt, phường 7, Quận 11, TP. Hồ Chí Minh", city: "Hồ Chí Minh", phone: "19005236" },
        { name: "MBM Hoàng Hoa Thám", address: "189 Hoàng Hoa Thám, Phường 6, Quận Bình Thạnh, TP. Hồ Chí Minh", city: "Hồ Chí Minh", phone: "19005236" },
        { name: "MBM Lê Văn Sỹ", address: "72 Lê Văn Sỹ, Phường 14, Quận 3, TP. Hồ Chí Minh", city: "Hồ Chí Minh", phone: "19005236" }
    ];

    //Lọc danh sách cửa hàng và tỉnh thành
    const filteredStores = storeList.filter(store => 
        (selectedCity === "ALL" || store.city === selectedCity) &&
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
    );    
    
    const handleShowMap = (e, location) => {
        e.preventDefault();

        if (!location) {
            console.error("Địa chỉ không hợp lệ.");
            return;
        }

        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;  
        if (!API_KEY) {
            console.error("API Key chưa được cấu hình.");
            return;
        }

        // Cập nhật URL để React render lại iframe
        const newMapUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodeURIComponent(location)}`;
        setMapUrl(newMapUrl);
    };

    return(
        <div className="about-container">
            <div className="page page-he-thong">
                <div className="container">
                    <div className="block-background">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="option-chos option-chos1">
                                    <div className="group-option">
                                        <div className="group-city">
                                            <span className="title">Tỉnh / Thành</span>
                                            <select name="" id="city" className="select" onChange={(e) => setSelectedCity(e.target.value)}>
                                                <option value="ALL" selected>Chọn tỉnh thành</option>
                                                <option value="Hồ Chí Minh" selected>Hồ Chí Minh</option>
                                            </select>
                                        </div>
                                        <div className="group-city">
                                            <span className="title">Nhập tên cửa hàng</span>
                                            <input 
                                                type="text" 
                                                id="myName" 
                                                placeholder="Nhập tên cửa hàng" 
                                                className="form-control" 
                                                value={searchTerm} 
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="option-chos" id="option-chos">
                                    <div className="info-store" id="info-store">
                                        {filteredStores.map((store,index)=>(
                                            <div key={index} className="store-list">
                                            <span className="name-cuahang">{store.name}</span>
                                            <span className="store-name">
                                                <b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                                        <path d="M11.0008 0C6.60743 0 3.0332 3.57423 3.0332 7.96752C3.0332 13.4197 10.1634 21.4239 10.467 21.762C10.7521 22.0796 11.2499 22.079 11.5346 21.762C11.8381 21.4239 18.9683 13.4197 18.9683 7.96752C18.9683 3.57423 15.3941 0 11.0008 0ZM11.0008 11.9762C8.79037 11.9762 6.99213 10.1779 6.99213 7.96752C6.99213 5.75712 8.79041 3.95888 11.0008 3.95888C13.2111 3.95888 15.0094 5.75717 15.0094 7.96757C15.0094 10.178 13.2111 11.9762 11.0008 11.9762Z" fill="#949494"> 
                                                        </path>
                                                    </svg>
                                                </b>
                                                {store.address}
                                            </span>
                                            <span className="store-phone">
                                                <b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                        <path d="M18.0945 14.616C16.8259 13.531 15.5385 12.8737 14.2854 13.9571L13.5372 14.6119C12.9898 15.0872 11.972 17.3081 8.03667 12.7811C4.10219 8.25986 6.44354 7.5559 6.99179 7.08468L7.7441 6.42907C8.99058 5.34322 8.52018 3.97627 7.62117 2.56917L7.07866 1.71688C6.17556 0.313051 5.19214 -0.6089 3.94238 0.475314L3.26711 1.06536C2.71475 1.46774 1.17079 2.77569 0.796277 5.26045C0.345545 8.24183 1.7674 11.6559
                                                                5.02496 15.4019C8.27842 19.1495 11.4639 21.032 14.4813 20.9992C16.989 20.9721 18.5035 
                                                                19.6265 18.9772 19.1372L19.6549 18.5464C20.9014 17.463 20.1269 16.3599 18.8575 15.2724L18.0945 14.616Z" fill="#949494">
                                                        </path>
                                                    </svg>
                                                </b>
                                                <a href="" className="phone-url" title="19005236">{store.phone}</a>
                                            </span>
                                            <a href="" className="store-url" onClick={(e) => handleShowMap(e, store.address)} >
                                                <b>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 19 19" fill="none">
                                                        <path d="M11.102 17L9.68591 9.31409L2 7.89796L18 1L11.102 17Z" stroke="black" stroke-miterlimit="10">
                                                        </path>
                                                    </svg>
                                                </b>
                                                Chỉ đường
                                            </a>
                                        </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-10">
                                <div className="wrapcontact">
                                    <div className="iFrameMap">
                                        <div id="map_contact" className="map">
                                            {mapUrl && <iframe src={mapUrl} width="600" height="450" style={{ border: 0 }} loading="lazy"></iframe>}                                        
                                            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3919.5692504136196!2d106.696811!3d10.767643!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f1573f5d56f%3A0x300ecbf0d5ab5050!2zMTAgVHLhu4tuaCBWxINuIEPhuqVuLCBQaMaw4budbmcgQ-G6p3Ugw5RuZyBMw6NuaCwgUXXhuq1uIDEsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2sus!4v1741080943749!5m2!1svi!2sus" width="600" height="450" style={{border:0}} loading="lazy"></iframe>
                                        </div>
                                    </div>
                                </div>     
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}