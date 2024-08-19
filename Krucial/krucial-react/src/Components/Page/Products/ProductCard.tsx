import React from "react";
import productModel from "../../../Interfaces/productModel";
interface Props{
    product: productModel;
}
function ProductCard(props:Props) {
  return <div>{props.product.name}</div>; 
}

export default ProductCard;
