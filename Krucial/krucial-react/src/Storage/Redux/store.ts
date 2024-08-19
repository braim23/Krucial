import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productSlice";
import { productApi } from "../../Apis";

const store = configureStore({
  reducer: {
    productStore: productReducer,
    [productApi.reducerPath]: productApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
