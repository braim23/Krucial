import React from "react";
import { ProductList } from "../Components/Page/Home";
import { Banner } from "../Components/Page/Common";

function Home() {
  return (
    <div>
      <Banner />
      <div className="container p-2">
        <ProductList />
      </div>
    </div>
  );
}

export default Home;
