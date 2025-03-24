const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const { 
    register, 
    login, 
    logout, 
    updatePassword, 
    addAddress, 
    getAllUsers, 
    deleteUser, 
    updateUser, 
    findUserByName, 
    findUserById,
    updateAddress,
    toggleActiveStatus,
    forgotPassword,
    resetPassword,
    addAddressFromBooking
} = require('../controllers/userController');

const router = express.Router();
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
// Đăng ký
router.post('/register', register);

// Đăng nhập
router.post('/login', login);

// Đăng xuất
router.post('/logout', logout);

// Các API yêu cầu xác thực người dùng
router.put('/update-password', authMiddleware, updatePassword);
router.post('/add-address', authMiddleware, addAddress);
router.post('/address/booking', authMiddleware, addAddressFromBooking);

// Cập nhật địa chỉ
router.put("/:userId/address/:addressId", authMiddleware, updateAddress);
// kich hoat!
router.patch("/toggle-active/:id", toggleActiveStatus);
// Lấy tất cả người dùng (có phân trang)
router.get('/', getAllUsers);

// Tìm kiếm người dùng theo tên
router.get('/search', findUserByName);


// Cập nhật người dùng theo ID
router.put('/:id', updateUser);

// Xóa người dùng theo ID
router.delete('/:id', deleteUser);

// Lấy thông tin người dùng theo ID
router.get('/:id', findUserById);

module.exports = router;
