import React from "react";
import { Suspense } from "react";
import SearchPage from "./SearchPage";

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
};

export default page;
