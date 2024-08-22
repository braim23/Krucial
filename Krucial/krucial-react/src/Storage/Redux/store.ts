import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productSlice";
import { authApi, paymentApi, productApi, shoppingCartApi } from "../../Apis";
import { shoppingCartReducer } from "./shoppingCartSlice";
import { authReducer } from "./authSlice";

const store = configureStore({
  reducer: {
    productStore: productReducer,
    shoppingCartStore: shoppingCartReducer,
    authStore: authReducer,
    [productApi.reducerPath]: productApi.reducer,
    [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authApi.middleware)
      .concat(paymentApi.middleware)
      .concat(shoppingCartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
