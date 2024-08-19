import React from "react";
import { useState, useEffect } from "react";
import productModel from "../../../Interfaces/productModel";
import ProductCard from "./ProductCard";
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
  return (<div className="container row ">
    {products.length > 0 && products.map((product, index) => (
      <ProductCard product={product} key={index} />
    ))}
  </div>);
}

export default ProductsList;
