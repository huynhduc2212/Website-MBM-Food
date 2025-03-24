"use client";
import React, { useState, useEffect } from "react";
import styles from "../styles/Header.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBell } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <div className={styles.header}>
            <div className={styles.searchBox}>
                <input type="text" placeholder="Search..." />
                {isLoaded && <FontAwesomeIcon icon={faSearch} className={styles.icon} />}
            </div>
            <div className={styles.userInfo}>
                {isLoaded && <FontAwesomeIcon icon={faBell} />}
                <img src="https://via.placeholder.com/40" alt="User" className={styles.avatar} />
                <span>Anthony (USA)</span>
            </div>
        </div>
    );
}
