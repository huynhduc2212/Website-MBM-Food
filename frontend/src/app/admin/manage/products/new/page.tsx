import Heading from "@/app/admin/components/common/Heading";
import ProductAdddNew from "@/app/admin/components/product/ProductAdddNew";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Thêm sản phẩm</Heading>
      <ProductAdddNew></ProductAdddNew>
    </div>
  );
};

export default page;
