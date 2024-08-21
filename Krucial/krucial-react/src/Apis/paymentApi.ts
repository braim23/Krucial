import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://localhost:7110/api/",
  }),
  endpoints: (builder) => ({
    initialPayment: builder.mutation({
      query: (userId) => ({
        url: "payment",
        method: "POST",
        params: {
          userId: userId,
        },
      }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery } = paymentApi;
export default paymentApi;
