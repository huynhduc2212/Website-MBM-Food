import Heading from "@/app/admin/components/common/Heading";
import TableUpdate from "@/app/admin/components/table/TableUpdate";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading className="mt-4">Cập nhật bàn</Heading>
      <TableUpdate></TableUpdate>
    </div>
  );
};

export default page;
