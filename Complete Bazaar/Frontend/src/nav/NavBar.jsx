import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { login } from "../store/slices/authSlice";      
import { useNavigate } from "react-router-dom";
const NavBar = () => {
    const { isLoggedIn, userType } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };
    return (
        <nav className="bg-gradient-to-r from-slate-900 to-slate-800 shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Left section: Brand + Nav Links */}
                <div className="flex items-center gap-8">
                    <Link
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent tracking-tight hover:from-indigo-300 hover:to-purple-300 transition-all duration-300"
                    >
                        Complete Bazaar
                    </Link>

                    <div className="flex items-center gap-1">
                        {isLoggedIn && userType === "seller" &&
                            <Link
                                to="/add-product"
                                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                            >
                                Add Product
                            </Link>
                        }
                        <Link
                            to="/products"
                            className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                        >
                            Products
                        </Link>
                        { isLoggedIn && userType === "customer" &&
                        <Link
                            to="/cart"
                            className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                        >
                            🛒 Cart
                            
                        </Link>
                        }
                        { isLoggedIn && userType === "customer" &&
                        <Link
                            to="/orders"
                            className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                        >
                            📝 Orders
                        </Link>
                        }
                    </div>
                </div>

                {/* Right section: Auth Links */}
                <div className="flex items-center gap-3">
                    {isLoggedIn ? (
                        <button
                            onClick={handleLogout}
                            className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-indigo-500 hover:bg-indigo-400 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow-md hover:shadow-indigo-500/30 transition-all duration-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
