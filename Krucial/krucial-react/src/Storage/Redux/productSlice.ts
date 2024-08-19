import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
};

export const productsSlice = createSlice({
  name: "Product",
  initialState: initialState,
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
  },
});

export const {setProduct} = productsSlice.actions;
export const productReducer = productsSlice.reducer;
