import React from "react";
import { useState, useEffect } from "react";
import productModel from "../../../Interfaces/productModel";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "../../../Apis/productApi";
import { useDispatch } from "react-redux";
import { setProduct } from "../../../Storage/Redux/productSlice";

function ProductList() {
  // const [products, setProducts] = useState<productModel[]>([]);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProductsQuery(null);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setProduct(data.result));
    }
  }, [isLoading]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="container row ">
      {data.result.length > 0 &&
        data.result.map((product: productModel, index: number) => (
          <ProductCard product={product} key={index} />
        ))}
    </div>
  );
}

export default ProductList;
