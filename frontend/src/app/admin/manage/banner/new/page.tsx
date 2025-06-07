import BannerAddNew from "@/app/admin/components/banner/BannerAddNew";
import Heading from "@/app/admin/components/common/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading>Tạo banner mới</Heading>
      <BannerAddNew></BannerAddNew>
    </div>
  );
};

export default page;
