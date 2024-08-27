import React from "react";
import { useState, useEffect } from "react";
import productModel from "../../../Interfaces/productModel";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "../../../Apis/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../../Storage/Redux/productSlice";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/Redux/store";

function ProductList() {
  const [products, setProducts] = useState<productModel[]>([]);
  const dispatch = useDispatch();
  const { data, isLoading } = useGetProductsQuery(null);

  const searchValue = useSelector(
    (state: RootState) => state.productStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempProductArray = handleFilters(searchValue);
      setProducts(tempProductArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setProduct(data.result));
      setProducts(data.result);
    }
  }, [isLoading]);

  const handleFilters = (search: string) => {
    let tempProducts = [...data.result];

    if (search) {
      const tempSearchProducts = [...tempProducts];
      tempProducts = tempSearchProducts.filter((item: productModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }
    return tempProducts;
  };

  if (isLoading) {
    return <MainLoader />;
  }
  return (
    <div className="container row ">
      {products.length > 0 &&
        products.map((product: productModel, index: number) => (
          <ProductCard product={product} key={index} />
        ))}
    </div>
  );
}

export default ProductList;
