import React from "react";
import { Suspense } from "react";
import ShowHistoryBooking from "./ShowHistoryBooking";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ShowHistoryBooking />
    </Suspense>
  );
};

export default page;
