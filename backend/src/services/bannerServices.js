const bannerModel = require("../models/BannerModel");

exports.getAllBanners = async () => {
  const banners = await bannerModel.find({});
  return banners;
};

exports.createBanner = async (title, image, description) => {
  const model = new bannerModel({ title, image, description });
  await model.save();
  return model;
};

exports.getByIdBanner = async (id) => {
  const banners = await bannerModel.findById(id);
  return banners;
};

exports.updateBanner = async (id, title, image,description) => {
  const model = await bannerModel.findByIdAndUpdate(id, {
    title,
    image,
    description,
  });
  return model;
};

exports.deleteBanner = async (id) => {
  await bannerModel.deleteOne({ _id: id });
};
