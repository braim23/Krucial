import React from "react";
import { orderSummaryProps } from "./orderSummaryProps";
import cartItemModel from "../../../Interfaces/cartItemModel";

function OrderSummary({ data, userInput }: orderSummaryProps) {
  return (
    <div>
      {" "}
      <h3 className="text-success">Order Summary</h3>
      <div className="mt-3">
        <div className="border py-3 px-2">Name : {userInput.name} </div>
        <div className="border py-3 px-2">Email : {userInput.email} </div>
        <div className="border py-3 px-2">Phone : {userInput.phoneNumber} </div>
        <div className="border py-3 px-2">
          <h4 className="text-success">Products</h4>
          <div className="p-3">
            {data.cartItems.map((cartitem: cartItemModel, index: number) => {
              return (
                <div className="d-flex" key={index}>
                  <div className="d-flex w-100 justify-content-between">
                    <p>{cartitem.product?.name}</p>
                    <p>
                      ${cartitem.product?.price} x {cartitem.quantity} =
                    </p>
                  </div>
                  <p style={{ width: "70px", textAlign: "right" }}>
                    ${(cartitem.product?.price ?? 0) * (cartitem.quantity ?? 0)}
                  </p>
                </div>
              );
            })}

            <hr />
            <h4 className="text-danger" style={{ textAlign: "right" }}>
              ${data.cartTotal.toFixed(2)}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
