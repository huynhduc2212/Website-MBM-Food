const productServices = require("../services/productServices");

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res, next) => {
  try {
    const result = await productServices.getAllProducts();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getAllProductsForAdmin = async (req, res, next) => {
  try {
    const result = await productServices.getAllProductsForAdmin();
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

// Lấy chi tiết một sản phẩm
exports.getByIdProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    const result = await productServices.getByIdProduct(id);
    res.status(200).json({ data: result });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

exports.getByCategory = async (req, res) => {
  try {
    const { idcate } = req.params;
  
    const query = {
      limit: req.query.limit,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      size: req.query.size,
      sort: req.query.sort
    };
    
    const result = await productServices.getByCategory(idcate, query);
    
    res.status(200).json({ 
      success: true,
      count: result.length,
      data: result 
    });
  } catch (error) {
    console.error("Error in getByCategory:", error.message);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, idcate, description, hot, slug, variants } = req.body;

    const parsedVariants = Array.isArray(variants)
      ? variants
      : JSON.parse(variants || "[]");

    const formattedVariants = parsedVariants.map((variant, index) => ({
      option: variant.option || "",
      price: parseFloat(variant.price || "0"),
      sale_price: parseFloat(variant.sale_price || "0"),
      image: req.files?.[`variants[${index}][image]`]?.[0]?.filename || "", // Kiểm tra ảnh upload
    }));

    const result = await productServices.createProduct({
      name,
      idcate,
      description,
      variants: formattedVariants,
      hot: parseInt(hot) || 0,
      slug,
    });

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, idcate, description, hot, slug, variants } = req.body;

    const parsedVariants = Array.isArray(variants)
      ? variants
      : JSON.parse(variants || "[]");

    const formattedVariants = parsedVariants.map((variant, index) => ({
      option: variant.option || "",
      price: parseFloat(variant.price || "0"),
      sale_price: parseFloat(variant.sale_price || "0"),
      image:
        req.files?.[`variants[${index}][image]`]?.[0]?.filename ||
        variant.image ||
        "",
    }));

    const updatedProduct = await productServices.updateProduct(id, {
      name,
      idcate,
      description,
      variants: formattedVariants,
      hot: parseInt(hot) || 0,
      slug,
    });

    res.status(200).json({ success: true, data: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res, next) => {
  try {
    let { id } = req.params;
    await productServices.deleteProduct(id);
    res.status(200).json({ status: true });
  } catch (error) {
    res.status(404).json({ status: false });
  }
};

// lấy API của slug
exports.getBySlugProduct = async (req, res, next) => {
  try {
    let { slug } = req.params;
    const result = await productServices.getBySlugProduct(slug);

    if (!result) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStatusProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, flag } = req.body;

    // Cập nhật sản phẩm
    const updatedProduct = await productServices.updateStatusProduct(
      id,
      status,
      flag
    );

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật trạng thái sản phẩm thành ${status}`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái sản phẩm:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật trạng thái sản phẩm",
      error: error.message,
    });
  }
};

exports.updateViewProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { view } = req.body;

    const updateView = await productServices.updateViewProduct(id, view);
    res.status(200).json({ success: true, data: updateView });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
