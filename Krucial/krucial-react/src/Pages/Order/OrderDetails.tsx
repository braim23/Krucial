import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../Apis/orderApi";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);

  let userInput, orderDetails;
  if (!isLoading && data?.result) {
    console.log(data.result);
  }

  return <div>OrderDetails</div>;
}

export default OrderDetails;
