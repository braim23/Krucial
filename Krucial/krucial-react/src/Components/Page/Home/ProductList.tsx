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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);
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
      const tempCategoryList = ["All"];
      data.result.forEach((item: productModel) => {
        if (tempCategoryList.indexOf(item.category) === -1) {
          tempCategoryList.push(item.category);
        }
      });
      setCategoryList(tempCategoryList);
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
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          {categoryList.map((categoryName, index) => (
            <li className="nav-item" key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
              >
                {categoryName}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {products.length > 0 &&
        products.map((product: productModel, index: number) => (
          <ProductCard product={product} key={index} />
        ))}
    </div>
  );
}

export default ProductList;
