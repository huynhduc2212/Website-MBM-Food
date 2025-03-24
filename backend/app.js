const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const userRoutes = require('./src/routes/users');
//Bổ sung search
const searchRoutes = require("./src/routes/search");
const categoryRoutes = require('./src/routes/category');
const productRoutes = require('./src/routes/product');
const postRoutes = require('./src/routes/post')
const favoriteRoutes = require('./src/routes/favorite');
const postCommentRoutes = require('./src/routes/postComment');
const orderRoutes = require('./src/routes/order');
const paymentMethodRoutes = require('./src/routes/paymentMethods');
const bannerRoutes = require('./src/routes/banner');
const couponRoutes = require('./src/routes/coupon');
const emailRouter = require('./src/routes/emailRoutes')
const tableRoutes = require('./src/routes/table');
const registerRoutes = require('./src/routes/register');
const authRoutes = require("./src/routes/authRoutes");

const cors = require("cors");
// const { applyTimestamps } = require('./src/models/CouponModel');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());
app.use('/images', express.static('public/images'));
app.use(express.json({ type: "application/json", charset: "utf-8" }));




// Kết nối DB
connectDB();

// Định tuyến
app.use('/api/user', userRoutes);
//Bổ sung search
app.use("/api", searchRoutes);
app.use('/api', postRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/cmt', postCommentRoutes);
app.use('/api/email',emailRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentMethodRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/registers', registerRoutes);
app.use("/api/auth", authRoutes);
app.listen(PORT, () => {
    console.log(`🚀 Server chạy tại: http://localhost:${PORT}`);

});




