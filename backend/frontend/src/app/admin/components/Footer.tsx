"use client";
import React from "react";
export default function Footer() {
    return (
      <footer className="bg-white text-gray-700 py-6 border-t">
        <div className="container mx-auto text-center">
          <p className="text-sm">© {new Date().getFullYear()} Your Company. All rights reserved.</p>
        </div>
      </footer>
    );
  }
  