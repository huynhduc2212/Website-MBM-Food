import React from "react";
import { Suspense } from "react";
import SuccessPage from "./SuccessPage";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPage />
    </Suspense>
  );
};

export default page;
