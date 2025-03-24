import Heading from "@/app/admin/components/common/Heading";
import TableAddNew from "@/app/admin/components/table/TableAddNew";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Tạo mã giảm mới</Heading>
      <TableAddNew></TableAddNew>
    </div>
  );
};

export default page;
