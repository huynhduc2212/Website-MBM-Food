const express = require("express");

const {
  createCoupon,
  getCoupons,
  updateCoupon,
  getCouponById,
  deleteCoupon,
  updateStatusCoupon,
  updateAllCouponStatus,
  applyCoupon
} = require('../controllers/couponController');

const router = express.Router();

router.post('/', createCoupon);

router.get('/', getCoupons);

router.get('/:id', getCouponById);

router.put('/:id', updateCoupon);

router.delete('/:id', deleteCoupon);

router.put('/:id/status', updateStatusCoupon);

router.put('/update-statuses', updateAllCouponStatus);

router.patch('/apply-coupon',applyCoupon);

module.exports = router;