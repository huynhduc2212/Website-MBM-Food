const tableModel = require("../models/TableModel");
const Register = require("../models/RegisterModel");

exports.getAllTables = async () => {
  const table = await tableModel.find({});
  return table;
};

exports.createTable = async (position, status, name, image) => {
  const table = new tableModel({ position, status, name, image });
  await table.save();
  return table;
};

exports.getByIdTable = async (id) => {
  const table = await tableModel.findById(id);
  return table;
};

exports.updateTable = async (id, position, name, image) => {
  const table = await tableModel.findByIdAndUpdate(id, {
    position,
    name,
    image,
  });
  return table;
};

// exports.updateTableStatus = async (id, status) => {
//   const table = await tableModel.findByIdAndUpdate(id, {
//     status,
//   });
//   return table;
// };

exports.updateTableStatus = async (id, status) => {
  const table = await tableModel.findByIdAndUpdate(
    id,
    {
      status,
    },
    { new: true }
  );

  // Nếu trạng thái thay đổi thành Available, cập nhật đơn đăng ký tương ứng
  if (status === "Available") {
    // Tìm đơn đăng ký đang hoạt động cho bàn này
    const activeRegister = await Register.findOne({
      id_table: id,
      status: "Confirmed",
    });

    // Nếu có đơn đăng ký đang hoạt động, cập nhật thành Completed
    if (activeRegister) {
      activeRegister.status = "Completed";
      await activeRegister.save();
    }
  }

  return table;
};

exports.deleteTable = async (id) => {
  await tableModel.deleteOne({ _id: id });
};
