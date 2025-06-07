import React from "react";
import { Suspense } from "react";
import OrderResult from "./OrderResult";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderResult />
    </Suspense>
  );
};

export default page;
