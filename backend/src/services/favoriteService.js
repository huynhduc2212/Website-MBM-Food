const Favorite = require('../models/Favorite');

// Thêm sản phẩm vào danh sách yêu thích
const addFavorite = async (id_user, id_product) => {
    if (!id_product) {
        throw new Error('Thiếu id_product');
    }

    const existingFavorite = await Favorite.findOne({ id_user, id_product });

    if (existingFavorite) {
        throw new Error('Sản phẩm đã có trong danh sách yêu thích');
    }

    const newFavorite = new Favorite({ id_user, id_product });
    await newFavorite.save();
    return newFavorite;
};

// Lấy danh sách yêu thích của user
const getFavorites = async (id_user) => {
    return await Favorite.find({ id_user }).populate('id_product');
};

// Xóa sản phẩm khỏi danh sách yêu thích
const removeFavorite = async (id_user, id_product) => {
    return await Favorite.findOneAndDelete({ id_user, id_product });
};
// check favorite 
const checkFavorite = async (id_user, id_product) => {
    try {
        // Kiểm tra nếu sản phẩm đã có trong danh sách yêu thích
        const favorite = await Favorite.findOne({ id_user, id_product });

        if (favorite) {
            return { isFavorite: true };
        } else {
            return { isFavorite: false };
        }
    } catch (error) {
        return { error: true, message: 'Lỗi server' };
    }
};

module.exports = { addFavorite, getFavorites, removeFavorite ,checkFavorite };
