import {BrowserRouter, Routes, Route } from "react-router-dom"; 
import AddProduct from "./components/seller/AddProduct";
import NavBar from "./nav/NavBar";
import Signup from "./components/auth/signup";
import Login from "./components/auth/login";

function App() {
  return (
    <BrowserRouter>
    <div className="min-h-screen bg-gray-100">
      <div >
        <NavBar />
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<div>Products Page</div>} />
          <Route path="/cart" element={<div>Cart Page</div>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/signup" element={<Signup/>} />
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;