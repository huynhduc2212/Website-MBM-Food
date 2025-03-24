const couponModel = require("../models/CouponModel");

exports.createCoupon = async ({
  code,
  discount,
  type,
  start_date,
  end_date,
  quantity,
  description,
}) => {
  const coupon = new couponModel({
    code,
    discount,
    type,
    start_date,
    end_date,
    quantity,
    description,
  });

  await coupon.save();
  return coupon;
};

exports.getCoupons = async () => {
  const coupon = await couponModel.find({});
  return coupon;
};

exports.getCouponById = async (id) => {
  return await couponModel.findById(id);
};

exports.updateCoupon = async (
  id,
  code,
  discount,
  type,
  start_date,
  end_date,
  quantity,
  description
) => {
  const coupon = await couponModel.findByIdAndUpdate(
    id,
    { code, discount, type, start_date, end_date, quantity, description },
    { new: true }
  );
  return coupon;
};

exports.updateStatusCoupon = async (id, status) => {
  const coupon = await couponModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  );
  return coupon;
};

exports.deleteCoupon = async (id) => {
  const coupon = await couponModel.findByIdAndDelete(id);
  return coupon;
};

exports.updateAllCouponStatus = async () => {
  const currentDate = new Date();

  const expiredCoupons = await couponModel.updateMany(
    {
      end_date: { $lt: currentDate },
      status: "Active",
    },
    {
      status: "Expired",
    }
  );

  const usedUpCoupons = await couponModel.updateMany(
    {
      quantity: { $lte: 0 },
      status: "Active",
    },
    {
      status: "Used_up",
    }
  );

  return {
    expiredCount: expiredCoupons.modifiedCount,
    usedUpCount: usedUpCoupons.modifiedCount,
  };
};

exports.applyCoupon = async (code) => {
  try {
    const coupon = await couponModel.findOne({ code, status: "Active" });

    if (!coupon) {
      return {
        success: false,
        statusCode: 404,
        message: "Mã không tồn tại hoặc đã hết hạn",
      };
    }

    const currentDate = new Date();
    if (currentDate > new Date(coupon.end_date)) {
      coupon.status = "Expired";
      await coupon.save();
      return {
        success: false,
        statusCode: 400,
        message: "Mã giảm giá đã hết hạn",
      };
    }

    if (coupon.quantity <= 0) {
      coupon.status = "Used_up";
      await coupon.save();
      return {
        success: false,
        statusCode: 400,
        message: "Mã giảm giá đã hết lượt sử dụng",
      };
    }

    // Giảm số lượng
    coupon.quantity -= 1;
    if (coupon.quantity === 0) coupon.status = "Used_up";
    await coupon.save();

    return {
      success: true,
      data: { discount: coupon.discount, type: coupon.type },
    };
  } catch (error) {
    throw new Error("Lỗi khi áp dụng mã giảm giá");
  }
};
