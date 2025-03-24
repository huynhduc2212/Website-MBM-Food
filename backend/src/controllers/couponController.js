const couponServices = require("../services/couponServices");

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      discount,
      type,
      start_date,
      end_date,
      quantity,
      description,
    } = req.body;
    const newCoupon = await couponServices.createCoupon({
      code,
      discount,
      type,
      start_date,
      end_date,
      quantity,
      description,
    });
    res.status(201).json({ success: true, data: newCoupon });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi tạo mã giảm giá", error });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await couponServices.getCoupons();
    res.status(200).json({ data: coupons });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy danh sách mã giảm giá", error });
  }
};

exports.getCouponById = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await couponServices.getCouponById(id);
    res.status(200).json({ data: coupon });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy mã giảm giá", error });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      discount,
      type,
      start_date,
      end_date,
      quantity,
      description,
    } = req.body;
    const updatedCoupon = await couponServices.updateCoupon(
      id,
      code,
      discount,
      type,
      start_date,
      end_date,
      quantity,
      description
    );
    res.status(200).json({ success: true, data: updatedCoupon });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật mã giảm giá", error });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    await couponServices.deleteCoupon(id);
    res.status(200).json({ message: "Xóa mã giảm giá thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa mã giảm giá", error });
  }
};

exports.updateStatusCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedStatusCoupon = await couponServices.updateStatusCoupon(
      id,
      status
    );
    res.status(200).json({
      success: true,
      message: "Cập nhật mã giảm giá thành công",
      data: updatedStatusCoupon,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi cập nhật trạng thái mã giảm giá", error });
  }
};

exports.updateAllCouponStatus = async (req, res) => {
  try {
    const result = await couponServices.updateAllCouponStatus();

    res.status(200).json({
      success: true,
      message: "Đã cập nhật trạng thái tất cả mã giảm giá",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái mã giảm giá",
      error: error.message,
    });
  }
};

exports.applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const result = await couponServices.applyCoupon(code);

    if (!result.success) {
      return res
        .status(result.statusCode)
        .json({ success: false, message: result.message });
    }

    res
      .status(200)
      .json({
        success: true,
        message: "Áp dụng mã giảm giá thành công",
        data: result.data,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Lỗi khi áp dụng mã giảm giá",
        error: error.message,
      });
  }
};
