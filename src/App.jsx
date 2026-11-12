
import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";

import Home from "./pages/HomePage";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AuthRoute from "./routes/AuthRoute";
import ShopByAnime from "./pages/ShopByAnime";

function App() {
  return (
  <Routes>
    <Route element={<MainLayout />}>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:id" element={<ProductDetails />} />
    <Route path="/shop-by-anime" element={<ShopByAnime />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/wishlist" element={<Wishlist />} />
    <Route path="/checkout" element={<AuthRoute> <Checkout /></AuthRoute>}/>
    <Route path="/orders" element={<AuthRoute><Orders /></AuthRoute>}/>
    <Route path="/account" element={<AuthRoute><Account /></AuthRoute>}/></Route>
    <Route path="/login" element={<AuthRoute guestOnly><Login /></AuthRoute>}/>
    <Route path="/register" element={<AuthRoute guestOnly><Register /></AuthRoute>}/>
    </Routes>
  );
}

export default App;
