
const registerService = require('../services/registerServices');

// Tạo đơn đăng ký đặt bàn mới
exports.createRegister = async (req, res) => {
  try {
    const registerData = req.body;
    
    const newRegister = await registerService.createRegister(registerData);
    
    return res.status(201).json({
      success: true,
      message: 'Đăng ký đặt bàn thành công',
      data: newRegister
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy tất cả đơn đăng ký
exports.getAllRegisters = async (req, res) => {
  try {
    const registers = await registerService.getAllRegisters();
    
    return res.status(200).json({
      success: true,
      count: registers.length,
      data: registers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đăng ký',
      error: error.message
    });
  }
};

// Lấy đơn đăng ký theo ID
exports.getRegisterById = async (req, res) => {
  try {
    const register = await registerService.getRegisterById(req.params.id);
    
    return res.status(200).json({
      success: true,
      data: register
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message
    });
  }
};

// Lấy đơn đăng ký theo user ID
exports.getRegistersByUser = async (req, res) => {
  try {
    // Sử dụng ID từ params hoặc từ user đã xác thực
    const userId = req.params.userId || (req.user && req.user.id);
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Không có ID người dùng'
      });
    }
    
    const registers = await registerService.getRegistersByUserId(userId);
    
    return res.status(200).json({
      success: true,
      count: registers.length,
      data: registers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Không thể lấy danh sách đăng ký',
      error: error.message
    });
  }
};

// Hủy đơn đăng ký
exports.updateRegisterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cancelledRegister = await registerService.updateRegisterStatus(id);
    
    return res.status(200).json({
      success: true,
      message: 'Hủy đăng ký thành công',
      data: cancelledRegister
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
