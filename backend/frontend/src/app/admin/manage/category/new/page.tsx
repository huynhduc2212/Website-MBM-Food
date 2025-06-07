import CategoryAddNew from "@/app/admin/components/category/CategoryAddNew";
import Heading from "@/app/admin/components/common/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading className="mt-3">Tạo danh mục mới</Heading>
      <CategoryAddNew></CategoryAddNew>
    </div>
  );
};

export default page;
