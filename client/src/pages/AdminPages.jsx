import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { FiUsers, FiBriefcase, FiAward } from "react-icons/fi";
import toast from "react-hot-toast";
export function AdminDashboard() {
  const [d, setD] = useState();
  useEffect(() => {
    api.get("/admin/dashboard").then((r) => setD(r.data));
  }, []);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Students" value={d?.stats.students} icon={FiUsers} />
      <StatCard
        label="Companies"
        value={d?.stats.companies}
        icon={FiBriefcase}
      />
      <StatCard label="Selections" value={d?.stats.selected} icon={FiAward} />
    </div>
  );
}
export function AdminCompanies() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const load = () =>
    api
      .get("/admin/companies")
      .then((r) => setItems(Array.isArray(r.data.companies) ? r.data.companies : []))
      .catch((err) => setError(err.response?.data?.message || "Could not load companies."));
  useEffect(() => {
    load();
  }, []);
  const toggle = async (c) => {
    await api.patch(`/admin/companies/${c._id}/approval`, {
      isApproved: !c.isApproved,
    });
    toast.success("Approval updated");
    load();
  };
  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">Company approvals</h2>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
      {!error && items.length === 0 && <p className="text-slate-500">No companies are awaiting review.</p>}
      {items.map((c) => (
        <div
          className="flex items-center justify-between border-b py-3"
          key={c._id}
        >
          <div>
            <b>{c.companyName}</b>
            <p className="text-sm text-slate-500">{c.user?.email}</p>
          </div>
          <button
            className={c.isApproved ? "btn-secondary" : "btn"}
            onClick={() => toggle(c)}
          >
            {c.isApproved ? "Approved" : "Approve"}
          </button>
        </div>
      ))}
    </div>
  );
}
export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const load = () =>
    api
      .get("/admin/users")
      .then((r) => setUsers(Array.isArray(r.data.users) ? r.data.users : []))
      .catch((err) => setError(err.response?.data?.message || "Could not load users."));
  useEffect(() => {
    load();
  }, []);
  const del = async (id) => {
    if (confirm("Delete this user?")) {
      await api.delete("/admin/users/" + id);
      load();
    }
  };
  return (
    <div className="card">
      <h2 className="mb-4 text-xl font-bold">Users</h2>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
      {!error && users.length === 0 && <p className="text-slate-500">No users found.</p>}
      {users.map((u) => (
        <div className="flex justify-between border-b py-3" key={u._id}>
          <span>
            {u.name}{" "}
            <small className="text-slate-500">
              {u.email} · {u.role}
            </small>
          </span>
          <button onClick={() => del(u._id)} className="text-rose-600">
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
export function Announcements() {
  const [list, setList] = useState([]),
    [title, setTitle] = useState(""),
    [content, setContent] = useState(""),
    [error, setError] = useState("");
  const load = () =>
    api
      .get("/admin/announcements")
      .then((r) => setList(Array.isArray(r.data.announcements) ? r.data.announcements : []))
      .catch((err) => setError(err.response?.data?.message || "Could not load announcements."));
  useEffect(() => {
    load();
  }, []);
  const post = async (e) => {
    e.preventDefault();
    await api.post("/admin/announcements", { title, content });
    setTitle("");
    setContent("");
    load();
    toast.success("Published");
  };
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="card space-y-3" onSubmit={post}>
        <h2 className="font-bold">New announcement</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="btn">Publish</button>
      </form>
      <div>
        {error && <p className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
        {!error && list.length === 0 && <div className="card text-slate-500">No announcements published yet.</div>}
        {list.map((a) => (
          <article className="card mb-3" key={a._id}>
            <b>{a.title}</b>
            <p className="mt-2 text-sm">{a.content}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
