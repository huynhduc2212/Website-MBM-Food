const tableServices = require("../services/tableServices");

// get all tables
exports.getAllTables = async (req, res, next) => {
  try {
    const result = await tableServices.getAllTables();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createTable = async (req, res) => {
  try {
    let { position, status, name } = req.body;
    const result = await tableServices.createTable(position, status, name);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// lay 1 table detail
exports.getByIdTable = async (req, res, next) => {
  try {
    let { id } = req.params;
    const result = await tableServices.getByIdTable(id);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateTable = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { position, status, name } = req.body;
    const existingTable = await tableServices.getByIdTable(id);
    if (!existingTable) {
      return res.status(404).json({ error: "Table not found" });
    }
    const result = await tableServices.updateTable(id, position, status, name);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateTableStatus = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { status } = req.body;
    const existingTable = await tableServices.getByIdTable(id);
    if (!existingTable) {
      return res.status(404).json({ error: "Table not found" });
    }
    const result = await tableServices.updateTableStatus(id, status);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    let { id } = req.params;
    await tableServices.deleteTable(id);
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(404).json({ status: false });
  }
};
