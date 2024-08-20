import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productSlice";
import { productApi, shoppingCartApi } from "../../Apis";
import { shoppingCartReducer } from "./shoppingCartSlice";

const store = configureStore({
  reducer: {
    productStore: productReducer,
    shoppingCartStore: shoppingCartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(shoppingCartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
