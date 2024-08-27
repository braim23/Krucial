import React from "react";
import { useState, useEffect } from "react";
import productModel from "../../../Interfaces/productModel";
import ProductCard from "./ProductCard";
import { useGetProductsQuery } from "../../../Apis/productApi";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../../Storage/Redux/productSlice";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/Redux/store";
import { SD_SortTypes } from "../../../Utilitiy/SD";

function ProductList() {
  const [products, setProducts] = useState<productModel[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [categoryList, setCategoryList] = useState([""]);
  const dispatch = useDispatch();
  const [sortName, setSortName] = useState(SD_SortTypes.NAME_A_Z);
  const sortOptions: Array<SD_SortTypes> = [
    SD_SortTypes.PRICE_LOW_TO_HIGH,
    SD_SortTypes.PRICE_HIGH_TO_LOW,
    SD_SortTypes.NAME_A_Z,
    SD_SortTypes.NAME_Z_A,
  ];
  const { data, isLoading } = useGetProductsQuery(null);

  const searchValue = useSelector(
    (state: RootState) => state.productStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempProductArray = handleFilters(
        sortName,
        selectedCategory,
        searchValue
      );
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

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategory,
      searchValue
    );
    setProducts(tempArray);
  };

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
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setProducts(tempArray);
      } else {
        buttons.classList.remove("active");
      }
    });
  };

  const handleFilters = (
    sortType: SD_SortTypes,
    category: string,
    search: string
  ) => {
    let tempArray =
      category === "All"
        ? [...data.result]
        : data.result.filter(
            (item: productModel) =>
              item.category.toUpperCase() === category.toUpperCase()
          );

    //search functionality here
    if (search) {
      const tempSearchProducts = [...tempArray];
      tempArray = tempSearchProducts.filter((item: productModel) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    // sort functionality here
    if (sortType === SD_SortTypes.PRICE_LOW_TO_HIGH) {
      tempArray.sort((a: productModel, b: productModel) => a.price - b.price);
    }
    if (sortType === SD_SortTypes.PRICE_HIGH_TO_LOW) {
      tempArray.sort((a: productModel, b: productModel) => b.price - a.price);
    }
    if (sortType === SD_SortTypes.NAME_A_Z) {
      tempArray.sort(
        (a: productModel, b: productModel) =>
          a.name.toUpperCase().charCodeAt(0) -
          b.name.toUpperCase().charCodeAt(0)
      );
    }
    if (sortType === SD_SortTypes.NAME_Z_A) {
      tempArray.sort(
        (a: productModel, b: productModel) =>
          b.name.toUpperCase().charCodeAt(0) -
          a.name.toUpperCase().charCodeAt(0)
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
            <li
              className="nav-item"
              key={index}
            >
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
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSortClick(index)}
                >
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
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
