const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const addressSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    zip: { type: String, required: true },
    default: { type: Boolean, default: false } 
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    avatar: { type: String, default: '' },
    role: { type: String, default: 'user', enum: ['user', 'admin'] },
    address: { type: [addressSchema], default: [],required: false },
    defaultAddress: { type: mongoose.Schema.Types.ObjectId, default: null, }, // Lưu ObjectId của địa chỉ mặc định
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

// Mã hóa mật khẩu trước khi lưu
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Middleware: Cập nhật `defaultAddress` nếu có địa chỉ mặc định
userSchema.pre('save', function (next) {
    const defaultAddr = this.address.find(addr => addr.default);
    this.defaultAddress = defaultAddr ? defaultAddr._id : null;
    next();
});

module.exports = mongoose.model('User', userSchema);
