const cron = require("node-cron");
const couponServices = require("./src/services/couponServices");

// Chạy mỗi ngày vào lúc 00:01 AM
cron.schedule("1 0 * * *", async () => {
  try {
    const result = await couponServices.updateAllCouponStatus();
    console.log(
      `Đã cập nhật trạng thái mã giảm giá: ${result.expiredCount} mã hết hạn, ${result.usedUpCount} mã hết số lượng.`
    );
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái mã giảm giá: ${error.message}`);
  }
});
