const favoriteService = require('../services/favoriteService');

// Thêm sản phẩm vào danh sách yêu thích
const addFavorite = async (req, res) => {
    try {

        const { id_product } = req.body;
        if (!req.user || !req.user.userId) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập" });
        }

        const id_user = req.user.userId; // Lấy userId thay vì id
        console.log("ID người dùng:", id_user); // Debug

        const favorite = await favoriteService.addFavorite(id_user, id_product);
        res.status(201).json({ message: "Đã thêm vào danh sách yêu thích", favorite });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


const getFavorites = async (req, res) => {
    try {

        const id_user = req.user.userId;
        if (!id_user) throw new Error("Không lấy được ID user từ token");


        const favorites = await favoriteService.getFavorites(id_user);

        res.json(favorites);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách yêu thích:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};


// Xóa sản phẩm khỏi danh sách yêu thích
const removeFavorite = async (req, res) => {
    try {
        const id_user = req.user.userId;
        const { id_product } = req.params;

        await favoriteService.removeFavorite(id_user, id_product);
        res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
const checkFavorite = async (req, res) => {
    try {
        const id_user = req.user.userId;
        const { id_product } = req.params;

        const result = await favoriteService.checkFavorite(id_user, id_product);

        if (result.error) {
            return res.status(500).json({ message: result.message });
        }

        res.json({ isFavorite: result.isFavorite });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
module.exports = { addFavorite, getFavorites, removeFavorite,checkFavorite };
