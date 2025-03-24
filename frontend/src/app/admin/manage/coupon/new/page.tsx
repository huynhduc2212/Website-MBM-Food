import Heading from "@/app/admin/components/common/Heading";
import CouponAddNew from "@/app/admin/components/coupon/CouponAddNew";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Tạo mã giảm mới</Heading>
      <CouponAddNew></CouponAddNew>
    </div>
  );
};

export default page;
