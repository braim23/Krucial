import React from "react";
import { Footer, Header } from "../Components/Layout";
import {
  AccessDenied,
  AllOrders,
  AuthenticationTest,
  AuthenticationTestAdmin,
  Home,
  Login,
  MyOrder,
  NotFound,
  OrderConfirmed,
  OrderDetails,
  Payment,
  ProductDetails,
  ProductList,
  Register,
  ShoppingCart,
} from "../Pages";
import { ProductUpsert } from "../Pages";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetShoppingCartQuery } from "../Apis/shoppingCartApi";
import { setShoppingCart } from "../Storage/Redux/shoppingCartSlice";
import { userModel } from "../Interfaces/Index";
import jwt_decode from "jwt-decode";
import { setLoggedInUser } from "../Storage/Redux/authSlice";
import { RootState } from "../Storage/Redux/store";
function App() {
  const dispatch = useDispatch();
  const userData: userModel = useSelector(
    (state: RootState) => state.authStore
  );
  const { data, isLoading } = useGetShoppingCartQuery(userData.id);

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: userModel = jwt_decode(localToken);
      dispatch(
        setLoggedInUser({
          fullName,
          id,
          email,
          role,
        })
      );
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data]);

  return (
    <div>
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route
            path="/productDetails/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="/shoppingCart" element={<ShoppingCart />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route
            path="/authentication"
            element={<AuthenticationTest />}
          ></Route>
          <Route
            path="/authorization"
            element={<AuthenticationTestAdmin />}
          ></Route>
          <Route path="/accessDenied" element={<AccessDenied />}></Route>

          <Route path="/payment" element={<Payment />}></Route>

          <Route
            path="order/orderConfirmed/:id"
            element={<OrderConfirmed />}
          ></Route>
          <Route path="/order/myOrders" element={<MyOrder />}></Route>
          <Route
            path="/order/orderDetails/:id"
            element={<OrderDetails />}
          ></Route>
          <Route path="/order/allOrders" element={<AllOrders />}></Route>
          <Route path="/product/productList" element={<ProductList />}></Route>
          <Route
            path="/product/productUpsert/:id"
            element={<ProductUpsert />}
          ></Route>
           <Route
            path="/product/productUpsert"
            element={<ProductUpsert />}
          ></Route>

          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
