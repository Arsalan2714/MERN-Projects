import {BrowserRouter, Routes, Route } from "react-router-dom"; 
import AddProduct from "./components/AddProduct";
import NavBar from "./nav/NavBar";


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
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/signup" element={<div>Sign Page</div>} />
        </Routes>
      </div>
    </div>
    </BrowserRouter>
  );
}

export default App;