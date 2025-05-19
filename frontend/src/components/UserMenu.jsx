import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { User2Icon } from "lucide-react";
import { userMenuItems } from "../constants";

const UserMenu = () => {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="btn btn-ghost btn-circle avatar"
      >
        <User2Icon className="size-5" />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 p-1 z-50 shadow-2xl bg-base-200 backdrop-blur-lg 
            rounded-2xl w-56 border border-base-content/10"
        >
          {userMenuItems.map(({ label, to, icon: Icon }) => {
            const IconComponent = Icon;
            return (
              <Link
                key={label}
                to={to}
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-colors hover:bg-base-content/5"
              >
                <IconComponent className="size-4" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default UserMenu;
