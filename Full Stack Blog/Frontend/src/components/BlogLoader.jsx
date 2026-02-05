import { useContext, useEffect, useState } from "react"
import { BlogContext } from "../store/BlogContext"

const BlogLoader = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const { setBlogs } = useContext(BlogContext);

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3001/api/blogs")
      .then((res) => res.json())
      .then((resJson) => {
        setBlogs(resJson?.blogs ?? []);
      })
      .catch((err) => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [setBlogs]);

  return (
    <div className={`flex flex-col min-h-screen w-full ${!loading && !error ? "items-start justify-start pt-8 pl-8" : "items-center justify-center"}`}>
      {loading && (
        <div className="flex flex-col items-center space-y-4">
          <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <h1 className="text-lg font-semibold text-blue-700">
            Loading Blogs<span className="animate-pulse">...</span>
          </h1>
        </div>
      )}
      {error && (
        <div className="flex flex-col items-center space-y-2">
          <svg className="h-10 w-10 text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414A8 8 0 116.05 6.05l1.414-1.414a10 10 0 1010.9 0z" />
          </svg>
          <h1 className="text-lg font-semibold text-red-600">
            Error Loading Blogs
          </h1>
          <p className="text-slate-600">Please try again later.</p>
        </div>
      )}
      {!loading && !error && (
        <div className="w-full px-8">
          {children}
        </div>
      )}
    </div>
  );
};

export default BlogLoader