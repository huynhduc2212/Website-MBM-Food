const checkToken = (req, res) => {
    res.json({
        valid: true,
        user: req.user, // Trả về thông tin user từ token
    });
};

module.exports = { checkToken };
