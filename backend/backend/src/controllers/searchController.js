const Product = require("../models/ProductModel.js"); 
const News = require("../models/Post.js"); 
const User = require("../models/User.js"); 

exports.searchAll = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
    }

    const productResults = await Product.find({ name: { $regex: query, $options: "i" } }).populate("variants");
    const newsResults = await News.find({ title: { $regex: query, $options: "i" } });
    const userResults = await User.find({ username: { $regex: query, $options: "i" } });

    res.json({ products: productResults, news: newsResults, users: userResults });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};
