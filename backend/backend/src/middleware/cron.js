const cron = require("node-cron");
const couponServices = require("../services/couponServices");

cron.schedule("* * * * *", async () => {
  try {
   await couponServices.updateAllCouponStatus();
  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái mã giảm giá: ${error.message}`);
  }
});
