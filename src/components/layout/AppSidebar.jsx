import { useState, useRef, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FolderKanban, LayoutTemplate, Settings, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    id: "projects",
    label: "Proyek",
    icon: FolderKanban,
    path: "/dashboard",
  },
  {
    id: "templates",
    label: "Templat",
    icon: LayoutTemplate,
    path: "/new",
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const popoverRef = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    function handleOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleLogout = async () => {
    setProfileOpen(false);
    try {
      if (logout) await logout();
    } catch {
      // ignore
    }
    navigate("/");
  };

  // User display metadata & initials
  const displayName = useMemo(() => {
    return (
      user?.user_metadata?.full_name ||
      user?.user_metadata?.company_name ||
      user?.email?.split("@")[0] ||
      "Pengguna"
    );
  }, [user]);

  const userEmail = user?.email || "user@pitchku.id";

  const initials = useMemo(() => {
    if (!displayName) return "PK";
    const parts = displayName.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }, [displayName]);

  return (
    <aside className="w-[72px] shrink-0 flex flex-col items-center justify-between border-r border-white/[0.06] bg-[#0b1326] sticky top-0 h-screen select-none z-40">

      {/* ── Nav items ─────────────────────────────────────── */}
      <nav className="flex flex-col items-center gap-1 w-full pt-4 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.id}
              to={item.path}
              title={item.label}
              className={`
                flex flex-col items-center justify-center gap-1
                w-full py-3 px-1 rounded-xl
                transition-all duration-150 group
                ${isActive
                  ? "bg-slate-700/70 text-white"
                  : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }
              `}
            >
              <Icon
                className={`w-5 h-5 ${isActive ? "text-amber-400" : "text-slate-400 group-hover:text-slate-200"}`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              <span
                className={`text-[10px] font-semibold leading-none tracking-wide ${isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                  }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Avatar ─────────────────────────────────── */}
      <div className="relative w-full px-2 pb-4" ref={popoverRef}>
        {/* Popover */}
        {profileOpen && (
          <div className="absolute bottom-full left-full z-50 mb-2 ml-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-[#131B2E] shadow-2xl shadow-black/60 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* User info header */}
            <div className="border-b border-white/[0.06] px-4 py-3">
              <p className="truncate text-xs font-semibold text-white">
                {displayName}
              </p>
              <p className="truncate text-[11px] text-slate-400">
                {userEmail}
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-0.5 px-1.5 py-1.5">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  alert("Fitur Pengaturan akan segera hadir.");
                }}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-300 transition-colors hover:bg-slate-800/70 hover:text-white"
              >
                <Settings className="h-3.5 w-3.5 text-slate-400" />
                Pengaturan
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                Keluar
              </button>
            </div>
          </div>
        )}

        {/* Avatar trigger */}
        <button
          type="button"
          onClick={() => setProfileOpen((o) => !o)}
          title="Profil & Pengaturan"
          className={`
            w-full flex flex-col items-center justify-center gap-1 py-2 rounded-xl
            transition-all duration-150 cursor-pointer
            ${profileOpen ? "bg-slate-700/60" : "hover:bg-slate-800/60"}
          `}
        >
          {/* Avatar circle */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 p-[2px] shadow-md shadow-amber-500/10">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-[11px] font-bold text-amber-400 leading-none">
                {initials}
              </span>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
