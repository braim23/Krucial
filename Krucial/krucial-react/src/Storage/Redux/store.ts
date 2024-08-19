import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./productSlice";

const store = configureStore({
  reducer: {
    productStore: productReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
