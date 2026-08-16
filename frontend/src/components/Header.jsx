import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, Radio, Shield, Video, Cloud } from "lucide-react";
import { BRAND } from "../config";
import { currentSession, logout, getLive } from "../lib/store";
import { firebaseEnabled } from "../lib/firebase";
import { cloudLogout } from "../lib/cloudSync";
import { BullLogo } from "./BullLogo";

const navItemClass = ({ isActive }) =>
  `flex items-center gap-1.5 px-3 py-2 text-sm font-medium tracking-wide uppercase transition-colors border-b-2 ${
    isActive
      ? "text-emerald-400 border-emerald-400"
      : "text-gray-400 border-transparent hover:text-gray-100"
  }`;

export const Header = () => {
  const session = currentSession();
  const navigate = useNavigate();
  const live = getLive();

  const handleLogout = () => {
    if (firebaseEnabled && session?.role === "admin") {
      cloudLogout().catch(() => {});
    }
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#232D42] bg-[#0A0D14]/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2" data-testid="brand-home-link">
            <BullLogo size={28} />
            <div className="font-display text-lg font-bold uppercase tracking-wider text-gray-100">
              {BRAND.name}
            </div>
            {firebaseEnabled && (
              <span
                data-testid="cloud-badge"
                className="hidden sm:inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 font-mono-t text-[9px] uppercase tracking-widest text-emerald-300"
                title="Cloud sync active"
              >
                <Cloud className="h-2.5 w-2.5" /> Cloud
              </span>
            )}
          </Link>

          {/* Nav */}
          {session && (
            <nav className="hidden md:flex items-center gap-1">
              <NavLink to="/modules" className={navItemClass} data-testid="nav-modules-link">
                <Video className="h-4 w-4" /> Modules
              </NavLink>
              <NavLink to="/live" className={navItemClass} data-testid="nav-live-session-link">
                <Radio className="h-4 w-4" /> Live
                {live?.isLive && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-red-500 live-pulse" />
                )}
              </NavLink>
              {session.role === "admin" && (
                <NavLink to="/admin" className={navItemClass} data-testid="nav-admin-link">
                  <Shield className="h-4 w-4" /> Admin
                </NavLink>
              )}
            </nav>
          )}

          {/* Right */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                <div className="hidden sm:flex flex-col items-end leading-tight">
                  <span className="font-mono-t text-[10px] uppercase tracking-widest text-emerald-400">
                    {session.role}
                  </span>
                  <span className="text-sm text-gray-200">{session.name}</span>
                </div>
                <button
                  data-testid="nav-logout-button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-md border border-[#232D42] bg-[#161D2F] px-3 py-1.5 text-xs text-gray-200 hover:border-red-500 hover:text-red-400 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-[#0A0D14] hover:bg-emerald-400 transition-colors"
                data-testid="header-login-link"
              >
                Student Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
