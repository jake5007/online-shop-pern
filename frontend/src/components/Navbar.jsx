import { Link, useResolvedPath, useNavigate } from "react-router-dom";
import {
  StoreIcon,
  ShoppingBagIcon,
  LogOutIcon,
  LogInIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const totalQuantity = useCartStore((state) => state.totalQuantity);
  const navigate = useNavigate();
  const { pathname } = useResolvedPath();
  const isHomePage = pathname === "/";

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="navbar px-4 min-h-[4rem] justify-between">
          {/* Logo */}
          <div className="flex-1 lg:flex-none">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <div className="flex items-center gap-2">
                <StoreIcon className="size-9 text-primary" />

                <span
                  className="font-semibold font-mono tracking-widest text-2xl
                  bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
                >
                  OnlineShop
                </span>
              </div>
            </Link>
          </div>
          {/* Right side */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm truncate max-w-[150px] hidden sm:block">
                  Welcome, <b>{user.name}</b>
                </span>
                <button
                  className="btn btn-ghost btn-circle"
                  onClick={handleLogout}
                >
                  <LogOutIcon className="size-5" />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-ghost btn-circle">
                <LogInIcon className="size-5" />
              </Link>
            )}
            <ThemeSelector />
            {isHomePage && (
              <Link to="/cart" className="btn btn-ghost btn-circle">
                <div className="indicator">
                  <ShoppingBagIcon className="size-5" />
                  {totalQuantity > 0 && (
                    <span className="indicator-item badge badge-sm badge-primary">
                      {totalQuantity}
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Navbar;
