import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiBriefcase,
  FiHome,
  FiLogOut,
  FiUser,
  FiFileText,
  FiUsers,
  FiBell,
} from "react-icons/fi";
const links = {
  student: [
    ["/student", FiHome, "Dashboard"],
    ["/jobs", FiBriefcase, "Explore Jobs"],
    ["/applications", FiFileText, "Applications"],
    ["/profile", FiUser, "Profile"],
  ],
  company: [
    ["/company", FiHome, "Dashboard"],
    ["/company/jobs", FiBriefcase, "Manage Jobs"],
    ["/company/profile", FiUser, "Company Profile"],
  ],
  admin: [
    ["/admin", FiHome, "Dashboard"],
    ["/admin/companies", FiUsers, "Companies"],
    ["/admin/users", FiUsers, "Users"],
    ["/admin/announcements", FiBell, "Announcements"],
  ],
};
export default function AppLayout() {
  const { user, logout } = useAuth(),
    nav = useNavigate();
  const exit = async () => {
    await logout();
    nav("/login");
  };
  return (
    <div className="min-h-screen md:flex">
      <aside className="bg-ink p-4 text-white md:min-h-screen md:w-64">
        <h1 className="mb-8 text-xl font-bold">
          Place<span className="text-indigo-400">Flow</span>
        </h1>
        <nav className="space-y-1">
          {links[user.role].map(([to, I, label]) => (
            <NavLink
              end={to === "/" + user.role}
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 ${isActive ? "bg-indigo-600" : "hover:bg-slate-800"}`
              }
            >
              <I />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={exit}
          className="mt-8 flex items-center gap-3 px-3 py-3 text-slate-300 hover:text-white"
        >
          <FiLogOut /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <header className="mb-7 flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500">Welcome back</p>
            <h2 className="text-2xl font-bold">{user.name}</h2>
          </div>
          <div className="rounded-full bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 capitalize">
            {user.role}
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}
