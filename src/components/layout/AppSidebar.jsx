import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FolderKanban, LayoutTemplate, Settings, LogOut } from "lucide-react";

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

  const handleLogout = () => {
    setProfileOpen(false);
    navigate("/login");
  };

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
                ${
                  isActive
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
                className={`text-[10px] font-semibold leading-none tracking-wide ${
                  isActive ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom Avatar ─────────────────────────────────── */}
      <div className="w-full px-2 pb-4 relative" ref={popoverRef}>

        {/* Popover */}
        {profileOpen && (
          <div className="absolute bottom-[60px] left-1/2 -translate-x-1/2 w-52 bg-[#131B2E] border border-white/10 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
            {/* User info header */}
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-white truncate">Kopi Nusantara</p>
              <p className="text-[11px] text-slate-400 truncate">founder@kopinusantara.id</p>
            </div>

            {/* Actions */}
            <div className="py-1.5 px-1.5 space-y-0.5">
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(false);
                  alert("Fitur Pengaturan akan segera hadir.");
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/70 rounded-lg transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                Pengaturan
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
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
              <span className="text-[11px] font-bold text-amber-400 leading-none">KN</span>
            </div>
          </div>
        </button>
      </div>
    </aside>
  );
}
