import Heading from "@/app/admin/components/common/Heading";
import CouponUpdate from "@/app/admin/components/coupon/CouponUpdate";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading className="mt-4">Cập nhật mã giảm giá</Heading>
      <CouponUpdate></CouponUpdate>
    </div>
  );
};

export default page;
