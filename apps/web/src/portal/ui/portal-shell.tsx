"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon, IconName } from "@/portal/ui/icons";
import { signOut, getSession } from "@/portal/auth";
import { useOrg, setOrg } from "@/portal/features/org/store";
import { useNotificationsEnabled, toggleNotifications } from "@/portal/features/notifications/store";
import { useTheme, toggleTheme } from "@/portal/features/theme/store";
import { loadCoursesForOrg, setSearchQuery } from "@/portal/features/courses/store";
import { useUserFullName, useUserInitials, useUser } from "@/portal/entities/user/store";
import { useToast } from "@/portal/ui/toast";

type NavGroup = {
  title: string;
  items: { label: string; to: string; icon: IconName }[];
};

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const session = getSession();
  const org = useOrg();
  const notificationsEnabled = useNotificationsEnabled();
  const theme = useTheme();
  const fullName = useUserFullName();
  const initials = useUserInitials();
  const user = useUser();
  const toast = useToast();

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        title: "Learning",
        items: [
          { label: "Dashboard", to: "/portal/dashboard", icon: "dashboard" },
          { label: "Courses", to: "/portal/courses", icon: "courses" },
          { label: "Lessons", to: "/portal/lessons", icon: "lessons" },
          { label: "Quizzes", to: "/portal/quizzes", icon: "quizzes" },
          { label: "Tests", to: "/portal/tests", icon: "tests" },
          { label: "Downloads", to: "/portal/downloads", icon: "downloads" }
        ]
      },
      {
        title: "Tools",
        items: [
          { label: "Notebook", to: "/portal/notebook", icon: "notebook" },
          { label: "AI Tutor", to: "/portal/ai-tutor", icon: "ai_tutor" }
        ]
      },
      {
        title: "Account",
        items: [
          { label: "Profile", to: "/portal/profile", icon: "profile" },
          { label: "Security", to: "/portal/security", icon: "security" }
        ]
      }
    ],
    []
  );

  useEffect(() => {
    function onClick() {
      setUserMenuOpen(false);
      setOrgMenuOpen(false);
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    loadCoursesForOrg(org);
  }, [org]);

  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-[280px_1fr]">
      <aside className="hidden md:flex flex-col bg-white border-r border-slate-200 min-h-0">
          <div className="flex items-center gap-3 px-4 py-4">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center">
              <Icon name="logo" size={22} />
            </div>
            <div>
              <div className="text-sm font-extrabold leading-tight tracking-tight">Brooklyn LMS</div>
              <div className="text-xs font-semibold text-slate-500">Student Portal</div>
            </div>
          </div>

        <nav className="flex-1 min-h-0 overflow-auto px-2 pb-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mt-4">
              <div className="px-3 pb-2 text-[11px] font-extrabold tracking-[0.12em] text-slate-400 uppercase">
                {group.title}
              </div>
              <div className="grid gap-1">
                {group.items.map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      href={item.to}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold ${
                        active ? "bg-emerald-50 text-emerald-700" : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <Icon name={item.icon} size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="relative border-t border-slate-200 px-3 py-3">
          <button
            className="w-full flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-slate-50"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setUserMenuOpen((prev) => !prev);
            }}
          >
            <div className="h-10 w-10 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center overflow-hidden shrink-0">
              {initials}
            </div>
            <div className="min-w-0 flex-1 text-left">
              <div className="truncate text-sm font-semibold text-slate-900">{fullName}</div>
              <div className="truncate text-xs font-semibold text-slate-500">{user.email}</div>
            </div>
            <span className="text-slate-400" aria-hidden="true">
              <Icon name="chevron_down" size={18} />
            </span>
          </button>

          {userMenuOpen ? (
            <div className="absolute left-3 right-3 bottom-[72px] z-40 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button className="menu-item" type="button" onClick={() => router.push("/portal/profile")}>
                Profile
              </button>
              <button className="menu-item" type="button" onClick={() => router.push("/portal/security")}>
                Security
              </button>
              <button
                className="menu-item text-rose-700 hover:bg-rose-50"
                type="button"
                onClick={() => {
                  signOut();
                  router.push("/portal/login");
                  toast.show("Signed out");
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0 flex flex-col min-h-0">
        <header className="relative bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-3 shrink-0">
            <button
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setOrgMenuOpen((prev) => !prev);
              }}
            >
              <span className="truncate max-w-[160px]">{org}</span>
              <span className="text-slate-400" aria-hidden="true">
                <Icon name="chevron_down" size={18} />
              </span>
            </button>
          </div>

          <div className="flex-1 flex justify-center min-w-0">
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2 w-[520px] max-w-[52vw]">
              <span className="text-slate-400">
                <Icon name="search" size={18} />
              </span>
              <input
                className="w-full bg-transparent outline-none text-sm font-semibold text-slate-900 placeholder:text-slate-400"
                type="text"
                placeholder="Search courses, lessons, and files"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    setSearchQuery(search);
                    router.push("/portal/courses");
                    toast.show(`Search: ${search}`);
                  }
                }}
              />
              <kbd className="shrink-0 whitespace-nowrap rounded-lg border border-slate-200 bg-white/80 px-2 py-1 text-[11px] font-extrabold text-slate-500 text-center shadow-sm">
                Ctrl K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              className={`icon-btn ${notificationsEnabled ? "text-emerald-700 border-emerald-200 bg-emerald-50" : ""}`}
              type="button"
              aria-label="Toggle notifications"
              aria-pressed={notificationsEnabled}
              onClick={(event) => {
                event.stopPropagation();
                toggleNotifications();
                toast.show(notificationsEnabled ? "Notifications off" : "Notifications on");
              }}
            >
              <Icon name={notificationsEnabled ? "bell_off" : "bell"} size={20} />
            </button>
            <button
              className={`icon-btn ${theme === "dark" ? "text-amber-700 border-amber-200 bg-amber-50" : ""}`}
              type="button"
              aria-label="Toggle theme"
              aria-pressed={theme === "dark"}
              onClick={(event) => {
                event.stopPropagation();
                toggleTheme();
                toast.show(theme === "dark" ? "Light mode" : "Dark mode");
              }}
            >
              <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
            </button>
          </div>

          {orgMenuOpen ? (
            <div className="absolute left-4 top-14 z-40 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg">
              <button className="menu-item" type="button" onClick={() => setOrg("Marketplace")}>
                Marketplace
              </button>
              <button className="menu-item" type="button" onClick={() => setOrg("B2B Tenant")}>
                B2B Tenant
              </button>
              <button className="menu-item" type="button" onClick={() => setOrg("Demo")}>
                Demo
              </button>
            </div>
          ) : null}
        </header>

        <main className="flex-1 min-h-0 overflow-auto p-5 bg-slate-50">{children}</main>
      </div>
    </div>
  );
}
