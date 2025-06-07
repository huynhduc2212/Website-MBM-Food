const categoryModel = require("../models/CategoryModel");

exports.getAllCategories = async () => {
  const categories = await categoryModel.find({});
  return categories;
};

exports.createCategory = async (name, description, slug,image) => {
  const model = new categoryModel({ name, description, slug,image });
  await model.save();
  return model;
};

exports.getByIdCategory = async (id) => {
  const categories = await categoryModel.findById(id);
  return categories;
};

exports.updateCategory = async (id, name, description,slug,image) => {
  const model = await categoryModel.findByIdAndUpdate(id, {
    name,
    description,
    slug,
    image
  });
  return model;
};

exports.getBySlugCategory = async (slug) => {
  const category = await categoryModel.findOne({ slug }); 
  return category;
};

exports.deleteCategory = async (id) => {
  await categoryModel.deleteOne({ _id: id });
};

