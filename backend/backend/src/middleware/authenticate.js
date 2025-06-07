const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = decoded; // Gán user vào req.user
        next();
    } catch (error) {
        res.status(403).json({ message: "Token không hợp lệ" });
    }
};

module.exports = authMiddleware;
