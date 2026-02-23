import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { login } from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
const NavBar = () => {
    const { isLoggedIn, userType, firstName: reduxName } = useSelector((state) => state.auth);
    const firstName = reduxName || localStorage.getItem("firstName");
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
                        {userType !== "seller" &&
                            <Link
                                to="/cart"
                                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                            >
                                🛒 Cart

                            </Link>
                        }
                        {userType !== "seller" &&
                            <Link
                                to="/wishlist"
                                className="text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                            >
                                ❤️ Wishlist
                            </Link>
                        }
                        {userType !== "seller" &&
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
                        <div className="flex items-center gap-3">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-white/10 transition-all duration-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                    {firstName ? firstName[0].toUpperCase() : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                                <div className="hidden sm:block leading-tight">
                                    <p className="text-[11px] text-slate-400">Hello,</p>
                                    <p className="text-sm font-semibold text-slate-200">{firstName || "Account"}</p>
                                </div>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-all duration-200"
                            >
                                Logout
                            </button>
                        </div>
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
