import { useState } from "react";
import { Link, useResolvedPath, useNavigate } from "react-router-dom";
import {
  StoreIcon,
  ShoppingBagIcon,
  LogOutIcon,
  LogInIcon,
  MenuIcon,
  XIcon,
  ClipboardListIcon,
  UserIcon,
} from "lucide-react";
import ThemeSelector from "./ThemeSelector";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";
import UserMenu from "./UserMenu";

const Navbar = () => {
  const [navOpen, setNavOpen] = useState(false);

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
          {/* Desktop */}
          <div className="hidden md:flex items-center gap-4">
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
            {/* TODO: User Profile Icon (My order, Profile Edit) */}
            {user && <UserMenu />}
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            <ThemeSelector />
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
            {navOpen ? (
              <button
                className="btn btn-ghost"
                onClick={() => setNavOpen(false)}
              >
                <XIcon className="size-6" />
              </button>
            ) : (
              <button
                className="btn btn-ghost"
                onClick={() => setNavOpen(true)}
              >
                <MenuIcon className="size-6" />
              </button>
            )}
          </div>
        </div>
        {navOpen && (
          <ul className="flex md:hidden flex-col items-center gap-4 my-4">
            <li>
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-base-content hover:opacity-80"
                >
                  <LogOutIcon className="size-5 align-middle" />
                  <span className="text-lg tracking-widest align-middle">
                    Logout
                  </span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-3 text-base-content hover:opacity-80"
                >
                  <LogInIcon className="size-5 align-middle" />
                  <span className="text-lg tracking-widest align-middle">
                    Login
                  </span>
                </Link>
              )}
            </li>
            {/* My Order*/}
            <li>
              <Link
                to="/order"
                className="flex items-center gap-3 text-base-content hover:opacity-80"
              >
                <ClipboardListIcon className="size-5 align-middle" />
                <span className="text-lg tracking-widest align-middle">
                  My Order
                </span>
              </Link>
            </li>

            {/* Edit Profile */}
            {/* <li>
              <Link
                to="/profile"
                className="flex items-center gap-3 text-base-content hover:opacity-80"
              >
                <UserIcon className="w-5 h-5 align-middle" />
                <span className="text-lg tracking-widest align-middle">
                  Edit Profile
                </span>
              </Link>
            </li> */}
          </ul>
        )}
      </div>
    </div>
  );
};
export default Navbar;
