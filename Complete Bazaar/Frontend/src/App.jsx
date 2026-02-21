import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddProduct from "./components/seller/AddProduct";
import EditProduct from "./components/seller/EditProduct";
import NavBar from "./nav/NavBar";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";
import { useSelector } from "react-redux";
import CustomerHome from "./components/customer/CustomerHome";
import SellerHome from "./components/seller/SellerHome";

function App() {
  const { userType } = useSelector((state) => state.auth);
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <div >
          <NavBar />
          <Routes>
            <Route path="/" element={userType === "seller" ? <SellerHome /> : <CustomerHome />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/products" element={<div>Products Page</div>} />
            <Route path="/cart" element={<div>Cart Page</div>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;