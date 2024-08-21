import React from "react";
import productModel from "../../../Interfaces/productModel";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useUpdateShoppingCartMutation } from "../../../Apis/shoppingCartApi";
import { MiniLoader } from "../Common";
import { apiResponse } from "../../../Apis";
import toastNotify from "../../../Helper/toastNofity";

interface Props {
  product: productModel;
}
function ProductCard(props: Props) {
  const [updateShoppingCart] = useUpdateShoppingCartMutation();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const handleAddToCart = async (productId: number) => {
    setIsAddingToCart(true);
    const respone: apiResponse = await updateShoppingCart({
      productId: productId,
      updateQuantityBy: 1,
      userId: "3fd00f67-ff8f-4f01-9ca1-145952b61875",
    });

    if (respone.data && respone.data.isSuccess) {
      toastNotify("Item added to cart successfully!");
    }

    setIsAddingToCart(false);
  };

  return (
    <div className="col-md-4 col-12 p-4">
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`/productDetails/${props.product.id}`}>
              <img
                src={props.product.image}
                style={{ borderRadius: "50%" }}
                alt=""
                className="w-100 mt-5 image-box"
              />
            </Link>
          </div>
          {props.product.specialTag && props.product.specialTag.length > 0 && (
            <i
              className="bi bi-star btn btn-success"
              style={{
                position: "absolute",
                top: "15px",
                left: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
            >
              &nbsp; {props.product.specialTag}
            </i>
          )}
          {isAddingToCart ? (
            <div style={{ position: "absolute", top: "15px", right: "15px" }}>
              <MiniLoader />
            </div>
          ) : (
            <i
              className="bi bi-cart-plus btn btn-outline-danger"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
              onClick={() => handleAddToCart(props.product.id)}
            ></i>
          )}

          <div className="text-center">
            <p className="card-title m-0 text-success fs-3">
              <Link
                className="text-decoration-none"
                style={{ color: "green" }}
                to={`/productDetails/${props.product.id}`}
              >
                {props.product.name}
              </Link>
            </p>
            <p className="badge bg-secondary" style={{ fontSize: "12px" }}>
              {props.product.category}
            </p>
          </div>
          <p className="card-text" style={{ textAlign: "center" }}>
            {props.product.description}
          </p>
          <div className="row text-center">
            <h4>${props.product.price}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
