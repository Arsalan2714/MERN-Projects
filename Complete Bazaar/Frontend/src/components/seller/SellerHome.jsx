import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchSellerProdusts } from "../../store/slices/sellerSlice";

const SellerHome = () => {
    const { products, isLoading, errorMessage } = useSelector(
        (state) => state.seller
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSellerProdusts());
    }, []);

    // Loading State
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-400 text-lg font-medium">
                        Loading your products...
                    </p>
                </div>
            </div>
        );
    }

    // Error State
    if (errorMessage.length > 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
                <div className="bg-slate-800/60 backdrop-blur-sm border border-red-500/30 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 mb-4">
                        <svg
                            className="w-8 h-8 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-red-400 mb-2">
                        Something went wrong
                    </h2>
                    {errorMessage.map((msg, i) => (
                        <p key={i} className="text-slate-400">
                            {msg}
                        </p>
                    ))}
                    <button
                        onClick={() => dispatch(fetchSellerProdusts())}
                        className="mt-6 px-6 py-2.5 rounded-lg bg-indigo-500 hover:bg-indigo-400 text-white font-medium transition-colors duration-200 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    // Star rating helper
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <svg
                    key={i}
                    className={`w-4 h-4 ${i <= Math.round(rating) ? "text-amber-400" : "text-slate-600"
                        }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            );
        }
        return stars;
    };

    // Products loaded successfully
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                            Your Products
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {products.length}{" "}
                            {products.length === 1 ? "product" : "products"} listed
                        </p>
                    </div>
                    <Link
                        to="/add-product"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Product
                    </Link>
                </div>

                {/* Empty State */}
                {products.length === 0 ? (
                    <div className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-12 text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-700/50 border border-slate-600 mb-5">
                            <svg
                                className="w-10 h-10 text-slate-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-slate-200 mb-2">
                            No products yet
                        </h2>
                        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                            Start building your store by adding your first product.
                        </p>
                        <Link
                            to="/add-product"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-semibold shadow-lg hover:shadow-indigo-500/30 transition-all duration-300"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4v16m8-8H4"
                                />
                            </svg>
                            Add Your First Product
                        </Link>
                    </div>
                ) : (
                    /* Product Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="bg-slate-800/60 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-xl overflow-hidden hover:border-indigo-500/40 hover:shadow-indigo-500/10 transition-all duration-300 group"
                            >
                                {/* Product Image */}
                                <div className="relative h-48 bg-slate-700/50 overflow-hidden">
                                    <img
                                        src={`http://localhost:3001/${product.imageUrl}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Category Badge */}
                                    <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/80 text-white backdrop-blur-sm">
                                        {product.category}
                                    </span>
                                    {/* Stock Badge */}
                                    <span
                                        className={`absolute top-3 right-3 px-2.5 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${product.stock > 0
                                                ? "bg-emerald-500/80 text-white"
                                                : "bg-red-500/80 text-white"
                                            }`}
                                    >
                                        {product.stock > 0
                                            ? `${product.stock} in stock`
                                            : "Out of stock"}
                                    </span>
                                </div>

                                {/* Product Info */}
                                <div className="p-5">
                                    <h3 className="text-lg font-semibold text-slate-100 mb-1 truncate">
                                        {product.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 mb-3">
                                        {product.brand}
                                    </p>
                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                                        {product.description}
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex">{renderStars(product.rating)}</div>
                                        <span className="text-xs text-slate-500">
                                            ({product.numReviews}{" "}
                                            {product.numReviews === 1 ? "review" : "reviews"})
                                        </span>
                                    </div>

                                    {/* Price */}
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                                        <span className="text-xl font-bold text-indigo-400">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerHome;
