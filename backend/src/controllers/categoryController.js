const categoryServices = require("../services/categoryServices");

// get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const result = await categoryServices.getAllCategories();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    let { name, description, slug } = req.body;
    let image = req.file ? `${req.file.filename}` : null;

    // Gọi service để thêm vào database
    const result = await categoryServices.createCategory(name, description, slug, image);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// lay 1 cate detail
exports.getByIdCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    const result = await categoryServices.getByIdCategory(id);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    let { name, description, slug } = req.body;
    const existingCategory = await categoryServices.getByIdCategory(id);
    if (!existingCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    let image = req.file ? `${req.file.filename}` : existingCategory.image;
    const result = await categoryServices.updateCategory(
      id,
      name,
      description,
      slug,
      image
    );
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getBySlugCategory = async (req, res, next) => {
  try {
    let { slug } = req.params;
    const result = await categoryServices.getBySlugCategory(slug);

    if (!result) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    let { id } = req.params;
    await categoryServices.deleteCategory(id);
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(404).json({ status: false });
  }
};
