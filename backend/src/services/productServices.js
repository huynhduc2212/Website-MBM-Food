const productModel = require("../models/ProductModel.js");

// Lấy tất cả sản phẩm

exports.getAllProducts = async () => {
  const products = await productModel.find({ status: "Active" });
  return products;
};

exports.getAllProductsForAdmin = async () => {
  const products = await productModel.find();
  return products;
};

// Lấy sản phẩm chi tiết
exports.getByIdProduct = async (id) => {
  const products = await productModel.findById(id);
  return products;
};

// lấy sp theo danh mục
// exports.getByCategory = async (idcate, query) => {
//   let limit = query.limit ? query.limit : 100;
//   delete query.limit;
//   let products = await productModel.find({ idcate: idcate }).limit(limit);
//   return products;
// };

exports.getByCategory = async (idcate, query) => {
  let limit = query.limit ? parseInt(query.limit) : 100;
  let filter = { idcate: idcate, status: "Active" };
  if (query.minPrice || query.maxPrice) {
    let priceFilter = {};
    
    if (query.minPrice && query.maxPrice) {
      filter['variants'] = {
        $elemMatch: {
          price: {
            $gte: parseInt(query.minPrice),
            $lte: parseInt(query.maxPrice)
          }
        }
      };
    } else if (query.minPrice) {
      filter['variants'] = {
        $elemMatch: {
          price: { $gte: parseInt(query.minPrice) }
        }
      };
    } else if (query.maxPrice) {
      filter['variants'] = {
        $elemMatch: {
          price: { $lte: parseInt(query.maxPrice) }
        }
      };
    }
  }
  
  if (query.size) {
    const decodedSize = decodeURIComponent(query.size);
    if (filter['variants']) {
      filter['variants'].$elemMatch.option = { $regex: decodedSize, $options: 'i' };
    } else {
      filter['variants'] = {
        $elemMatch: {
          option: { $regex: query.size, $options: 'i' }
        }
      };
    }
  }
  
  let sortOption = {};
  if (query.sort) {
    switch(query.sort) {
      case 'price-asc':
        sortOption = { 'variants.0.price': 1 };
        break;
      case 'price-desc':
        sortOption = { 'variants.0.price': -1 };
        break;
      case 'name-az':
        sortOption = { name: 1 };
        break;
      case 'name-za':
        sortOption = { name: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 }; 
    }
  } else {
    sortOption = { createdAt: -1 }; 
  }
  const products = await productModel.find(filter).sort(sortOption).limit(limit);
  
  return products;
};

exports.createProduct = async ({
  name,
  idcate,
  description,
  variants,
  hot,
  slug,
}) => {
  try {
    const product = new productModel({
      name,
      idcate,
      description,
      variants: variants.map((variant) => ({
        option: variant.option,
        price: variant.price,
        sale_price: variant.sale_price,
        image: variant.image,
      })),
      hot: hot || 0,
      slug,
    });

    await product.save();
    return product;
  } catch (error) {
    throw error;
  }
};

exports.updateProduct = async (
  id,
  { name, idcate, description, variants, hot, slug }
) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      {
        $set: {
          name,
          idcate,
          description,
          hot,
          slug,
          variants: variants.map((variant) => ({
            option: variant.option || "",
            price: parseFloat(variant.price || "0"),
            sale_price: parseFloat(variant.sale_price || "0"),
            image: variant.image || "",
          })),
        },
      },
      { new: true } 
    );

    if (!updatedProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (id) => {
  await productModel.deleteOne({ _id: id });
};

// lấy api của slug
exports.getBySlugProduct = async (slug) => {
  const product = await productModel.findOne({ slug });
  return product;
};

exports.updateStatusProduct = async (id, status, flag) => {
  try {
    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      { status, flag },
      { new: true }
    );

    if (!updatedProduct) {
      throw new Error("Sản phẩm không tồn tại");
    }

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

exports.updateViewProduct = async (id, view) => {
  try {
    const updateView = await productModel.findByIdAndUpdate(
      id,
      { view },
      { new: true }
    );
    return updateView;
  } catch (error) {
    throw error;
  }
};
