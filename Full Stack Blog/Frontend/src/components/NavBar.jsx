import { Link, useLocation } from "react-router-dom";

const NavBar = () => {
  const location = useLocation();
  
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/create-blog", label: "Create Blog" },
  ];

  return (
    <nav className="bg-blue-700 drop-shadow-lg py-4 px-6 flex items-center justify-between">
      <div className="text-2xl font-bold tracking-wide text-slate-50 select-none">
        <span className="hover:text-blue-200 transition-colors">Full Stack Blog</span>
      </div>
      <ul className="flex gap-8">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                location.pathname === link.path
                  ? "bg-blue-900 text-white shadow-sm"
                  : "text-blue-100 hover:bg-blue-800 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
