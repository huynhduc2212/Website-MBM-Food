require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../backend/src/config/db");
const Table = require("../backend/src/models/TableModel"); // Đổi tên model phù hợp nếu khác

const addImageFieldToTables = async () => {
  try {
    await connectDB();

    const result = await Table.updateMany(
      { image: { $exists: false } }, // Chỉ update nếu chưa có trường `image`
      { $set: { image: "" } } // Giá trị mặc định (thay đổi nếu muốn)
    );

    console.log(`✔ Đã thêm trường image cho ${result.modifiedCount} bàn.`);
  } catch (error) {
    console.error("❌ Lỗi khi thêm trường image:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

// Chạy script
addImageFieldToTables();
