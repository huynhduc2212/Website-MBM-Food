const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Thiếu hoặc sai định dạng token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecret");

        req.user = { userId: decoded.userId, role: decoded.role };
        next();
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

module.exports = authMiddleware;
