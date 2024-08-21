import { createSlice } from "@reduxjs/toolkit";
import {userModel} from "../../Interfaces/Index";

const initialState: userModel = {
  fullName: "",
  id: "",
  email: "",
  role: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoggedInUser: (state, action) => {
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
  },
});

export const { setLoggedInUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
