import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  search: "",
};

export const productsSlice = createSlice({
  name: "Product",
  initialState: initialState,
  reducers: {
    setProduct: (state, action) => {
      state.products = action.payload;
    },
    setSearchProduct: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setProduct, setSearchProduct } = productsSlice.actions;
export const productReducer = productsSlice.reducer;
