const authMiddleware = (req, res, next) => {
    try {
        const userId = req.headers['x-user-id']; // Lấy userId từ request header (do frontend gửi lên)
        if (!userId) return res.status(401).json({ message: 'Unauthorized' });

        req.userId = userId; // Gán userId vào request
        next();
    } catch (error) {
        res.status(500).json({ error: 'Authentication error' });
    }
};

module.exports = authMiddleware;
