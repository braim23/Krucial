import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { toastNotify } from "../../../Helper";
import { orderSummaryProps } from "../Order/orderSummaryProps";
import cartItemModel from "../../../Interfaces/cartItemModel";
import { useCreateOrderMutation } from "../../../Apis/orderApi";
import { apiResponse } from "../../../Apis";
import { SD_Status } from "../../../Utilitiy/SD";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ data, userInput }: orderSummaryProps) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [createOrder] = useCreateOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }
    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      // Show error to your customer (for example, payment details incomplete)
      toastNotify("An unexpected error occured.", "error");
      setIsProcessing(false);
    } else {
      // {
      //   "pickupName": "string",
      //   "pickupPhoneNumber": "string",
      //   "pickupEmail": "string",
      //   "applicationUserId": "string",
      //   "orderTotal": 0,
      //   "stripePaymentIntentID": "string",
      //   "status": "string",
      //   "totalItems": 0,
      //   "orderDetailsDTO": [
      //     {
      //       "productId": 0,
      //       "quantity": 0,
      //       "itemName": "string",
      //       "price": 0
      //     }
      //   ]
      // }

      let grandTotal = 0;
      let totalItems = 0;

      const orderDetailsDTO: any = [];
      data.cartItems?.forEach((item: cartItemModel) => {
        const tempOrderDetail: any = {};
        tempOrderDetail["productId"] = item.product?.id;
        tempOrderDetail["quantity"] = item.quantity;
        tempOrderDetail["ItemName"] = item.product?.name;
        tempOrderDetail["price"] = item.product?.price;
        orderDetailsDTO.push(tempOrderDetail);
        grandTotal += item.quantity! * item.product?.price!;
        totalItems += item.quantity!;
      });

      const respone: apiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        totalItems: totalItems,
        orderTotal: grandTotal,
        orderDetailsDTO: orderDetailsDTO,
        stripePaymentIntentID: data.stripePaymentIntentId,
        applicationUserId: data.userId,
        status:
          result.paymentIntent.status === "succeeded"
            ? SD_Status.COMPLETED
            : SD_Status.PENDING,
      });


      if (respone) {
        if (respone.data?.result.status === SD_Status.COMPLETED) {
          navigate(
            `/order/orderConfirmed/${respone.data.result.orderHeaderId}`
          );
        } else {
          navigate("/failed");
        }
      }

      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
    setIsProcessing(false);
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        disabled={!stripe || isProcessing}
        className="btn btn-success mt-5 w-100"
      >
        <span id="button-text">
          {isProcessing ? "Processing ..." : "Submit Order"}
        </span>
      </button>
    </form>
  );
};

export default PaymentForm;
