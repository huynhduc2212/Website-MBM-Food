const Register = require("../models/RegisterModel");
const User = require("../models/User");
const Table = require("../models/TableModel");

exports.createRegister = async (registerData) => {
  try {
    const user = await User.findById(registerData.id_user);
    if (!user) {
      throw new Error("User không tồn tại");
    }

    const table = await Table.findById(registerData.id_table);
    if (!table) {
      throw new Error("Bàn không tồn tại");
    }

    if (table.status !== "Available") {
      throw new Error("Bàn này đã được đặt");
    }

    // Kiểm tra nếu bàn đã được đặt vào thời gian này
    const existingRegistration = await Register.findOne({
      id_table: registerData.id_table,
      status: "Confirmed", // Uppercase to match your type definition
    });

    if (existingRegistration) {
      throw new Error("Bàn này đã được đặt và chưa hoàn thành");
    }

    const newRegister = new Register({
      id_user: registerData.id_user,
      id_table: registerData.id_table,
      create_at: new Date(),
      start_time: registerData.start_time,
      status: "Confirmed",
    });

    await newRegister.save();

    const savedRegister = await Table.findByIdAndUpdate(registerData.id_table, {
      status: "Reserved",
    });

    return savedRegister;
  } catch (error) {
    console.error("Error in createRegister service:", error);
    throw error;
  }
};

// Lấy tất cả đơn đăng ký
exports.getAllRegisters = async () => {
  try {
    const registers = await Register.find()
      .populate("id_user", "username email")
      .populate("id_table", "position name status");
    return registers;
  } catch (error) {
    throw error;
  }
};

// Lấy đơn đăng ký theo ID
exports.getRegisterById = async (id) => {
  try {
    const register = await Register.findById(id)
      .populate("id_user", "username email avatar")
      .populate("id_table", "position name img status");

    if (!register) {
      throw new Error("Không tìm thấy đơn đăng ký");
    }

    return register;
  } catch (error) {
    throw error;
  }
};

// Lấy đơn đăng ký theo user ID
exports.getRegistersByUserId = async (userId) => {
  try {
    const registers = await Register.find({ id_user: userId })
      .populate("id_user", "username email avatar")
      .populate("id_table", "position name img status");
    return registers;
  } catch (error) {
    throw error;
  }
};


// Hủy đơn đăng ký
exports.updateRegisterStatus = async (id) => {
  try {
    const register = await Register.findById(id);
    if (!register) {
      throw new Error("Không tìm thấy đơn đăng ký");
    }

    // Cập nhật trạng thái đơn đăng ký
    register.status = "Cancelled";
    await register.save();

    // Cập nhật trạng thái bàn
    await Table.findByIdAndUpdate(register.id_table, { status: "Available" });

    return register;
  } catch (error) {
    throw error;
  }
};
