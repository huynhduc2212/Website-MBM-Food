const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// Đăng ký người dùng
const register = async (userData) => {
  const user = new User(userData);
  await user.save();
  return { message: "Đăng ký thành công!" };
};

// Đăng nhập
const login = async (email, password) => {
  const user = await User.findOne({ email });
  // console.log("User từ DB:", user); // ✅ Kiểm tra user có tồn tại không
  if (!user) throw new Error("Người dùng không tồn tại");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Mật khẩu không đúng");
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "12h" }
  );
  return { token, user }; // ✅ Trả về cả user
};

// Lấy tất cả người dùng và phân trang
const getAllUsers = async (page = 1, limit = 10) => {
  try {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const skip = (page - 1) * limit;

    const users = await User.find().skip(skip).limit(limit);
    const totalUsers = await User.countDocuments();

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Database query error:", error);
    throw new Error("Không thể truy vấn danh sách người dùng");
  }
};

// Xóa người dùng theo ID
const deleteUser = async (userId) => {
  const user = await User.findByIdAndDelete(userId);
  if (!user) throw new Error("Người dùng không tồn tại");
  return { message: "Xóa người dùng thành công" };
};

// Cập nhật người dùng theo ID
const updateUser = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, { new: true });
  if (!user) throw new Error("Người dùng không tồn tại");
  return { message: "Cập nhật thành công", user };
};

const updatePassword = async (userId, oldPassword, newPassword) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Người dùng không tồn tại");

  // Kiểm tra mật khẩu cũ
  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) throw new Error("Mật khẩu cũ không chính xác");

  user.password = newPassword;

  await user.save();

  return { message: "Cập nhật mật khẩu thành công" };
};

// Tìm người dùng theo username
const findUserByName = async (username) => {
  const user = await User.findOne({ username });
  if (!user) throw new Error("Không tìm thấy người dùng");
  return user;
};
const findUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("Người dùng không tồn tại");
  return user;
};
// Thêm địa chỉ mới
const addAddress = async (req, res) => {
  try {
    const { userId } = req.user;
    const { address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Kiểm tra và chuyển đổi address thành mảng nếu cần
    if (!Array.isArray(user.address)) {
      user.address = [];
    }

    user.address.push(address);
    await user.save();

    res
      .status(200)
      .json({ message: "Đã thêm địa chỉ mới", addresses: user.address });
  } catch (error) {
    console.error("Lỗi server:", error);
    res.status(500).json({ message: error.message });
  }
};
// Update địa chỉ
const updateAddress = async (userId, addressId, updatedAddress) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("Người dùng không tồn tại");
  }

  // Tìm địa chỉ theo `addressId`
  const addressIndex = user.address.findIndex(
    (addr) => addr._id.toString() === addressId
  );
  if (addressIndex === -1) {
    throw new Error("Địa chỉ không tồn tại");
  }

  // Cập nhật thông tin địa chỉ
  user.address[addressIndex] = {
    ...user.address[addressIndex],
    ...updatedAddress,
  };

  // Nếu có địa chỉ mặc định, đặt lại tất cả trước khi cập nhật
  if (updatedAddress.default) {
    user.address.forEach((addr) => (addr.default = false));
    user.address[addressIndex].default = true;
  }

  await user.save();
  return user.address;
};

const toggleUserStatus = async (userId) => {
  try {
    console.log("🔍 Checking user ID:", userId);

    const user = await User.findById(userId);
    if (!user) {
      console.log("⚠️ User not found!");
      return null;
    }

    // Chỉ cập nhật trường `isActive`, không ảnh hưởng đến `address`
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: !user.isActive } },
      { new: true } // Trả về dữ liệu sau khi cập nhật
    );

    console.log("✅ User updated successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("🔥 Error in toggleUserStatus:", error);
    throw new Error(error.message);
  }
};
const sendResetPasswordEmail = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw { status: 404, message: "Email không tồn tại!" };
  console.log("JWT_SECRET khi tạo token:", process.env.JWT_SECRET);
  // Tạo token JWT có hiệu lực 15 phút
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  const resetLink = `https://mbmfood.store/reset-password/${token}`;

  // Cấu hình gửi email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Đặt lại mật khẩu",
    text: `Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để tiếp tục: ${resetLink}. Link có hiệu lực trong 5 phút.`,
    html: `<p>Bạn đã yêu cầu đặt lại mật khẩu. Nhấn vào link sau để tiếp tục:</p>
             <a href="${resetLink}">Đặt lại mật khẩu</a>
             <p>Link có hiệu lực trong 5 phút.</p>`,
  });

  return "Email đặt lại mật khẩu đã được gửi!";
};

// Hàm đặt lại mật khẩu
const resetPassword = async (token, newPassword) => {
  try {
    console.log("JWT_SECRET khi verify token:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    console.log(user);

    if (!user) throw { status: 404, message: "Người dùng không tồn tại!" };
    console.log(newPassword);
    // Hash mật khẩu mới
    const hashedPassword = newPassword;

    user.password = hashedPassword;
    await user.save();

    return "Mật khẩu đã được cập nhật thành công!";
  } catch (error) {
    throw { status: 400, message: "Token không hợp lệ hoặc đã hết hạn!" };
  }
};

const addAddressFromBooking = async (userId, name, phone) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("Bạn chưa đăng nhập");
    }

    if (!Array.isArray(user.address)) {
      user.address = [];
    }

    const bookingAddress = {
      name: name,
      phone: phone,
      company: "Không có",
      address: "Chưa cập nhật",
      city: "Chưa cập nhật",
      district: "Chưa cập nhật",
      ward: "Chưa cập nhật",
      zip: "000000",
      default: false,
      default: false,
    };

    user.address.push(bookingAddress);
    await user.save();

    return {
      message: "Đã thêm thông tin liên hệ từ đặt bàn",
      address: bookingAddress,
    };
  } catch (error) {
    console.error("Lỗi service:", error);
    throw error;
  }
};
const deleteAddress = async (userId, addressId) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const addressIndex = user.address.findIndex(addr => addr._id.toString() === addressId);
  if (addressIndex === -1) throw new Error('Address not found');

  // Nếu địa chỉ bị xóa là địa chỉ mặc định
  const isDefault = user.address[addressIndex].default;

  user.address.splice(addressIndex, 1);

  // Cập nhật lại defaultAddress nếu cần
  if (isDefault) {
      const newDefault = user.address.find(addr => addr.default);
      user.defaultAddress = newDefault ? newDefault._id : null;
  }

  await user.save();
  return user;
};
module.exports = {
  deleteAddress,
  sendResetPasswordEmail,
  resetPassword,
  toggleUserStatus,
  addAddress,
  updatePassword,
  getAllUsers,
  deleteUser,
  updateUser,
  findUserByName,
  register,
  login,
  findUserById,
  updateAddress,
  addAddressFromBooking,
};
