require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../backend/src/config/db");
const Product = require("../backend/src/models/ProductModel.js");

const updateProductFlags = async () => {
  try {
    await connectDB();

    // Cập nhật tất cả sản phẩm chưa có trường 'flag' hoặc có giá trị khác true
    const result = await Product.updateMany(
      { flag: { $exists: false } }, // Chỉ cập nhật nếu trường flag chưa tồn tại
      { $set: { flag: true } }
    );

    console.log(`✔ Đã cập nhật flag cho ${result.modifiedCount} sản phẩm.`);
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật flag:", error.message);
  } finally {
    mongoose.disconnect();
  }
};

// Chạy script
updateProductFlags();
