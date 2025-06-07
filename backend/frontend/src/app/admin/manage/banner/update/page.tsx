import BannerUpdate from "@/app/admin/components/banner/BannerUpdate";
import Heading from "@/app/admin/components/common/Heading";
import React from "react";

const page = () => {
  return (
    <div>
      <Heading className="mt-4">Cập nhật banner</Heading>
      <BannerUpdate></BannerUpdate>
    </div>
  );
};

export default page;
