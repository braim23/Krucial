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
      const tempProductArray = handleFilters(selectedCategory, searchValue);
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

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;
    buttons.forEach((buttons, index) => {
      if (index === i) {
        buttons.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }
        setSelectedCategory(localCategory);
        const tempArray = handleFilters(localCategory, searchValue);
        setProducts(tempArray);
      } else {
        buttons.classList.remove("active");
      }
    });
  };

  const handleFilters = (category: string, search: string) => {
    let tempArray =
      category === "All"
        ? [...data.result]
        : data.result.filter(
            (item: productModel) =>
              item.category.toUpperCase() === category.toUpperCase()
          );

    if (search) {
      const tempSearchProducts = [...tempArray];
      tempArray = tempSearchProducts.filter((item: productModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }
    return tempArray;
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
                onClick={() => handleCategoryClick(index)}
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
