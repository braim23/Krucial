import React from "react";
import { useState, useEffect } from "react";
import productModel from "../../../Interfaces/productModel";
function ProductsList() {
  const [products, setProducts] = useState<productModel[]>([]);
  useEffect(() => {
    fetch("https://localhost:7110/api/Product")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setProducts(data.result);
      });
  }, []);
  return <div>ProductsList</div>;
}

export default ProductsList;
