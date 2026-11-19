import { useEffect, useState } from "react";
import api from "../services/api";
import { FiBriefcase, FiCheckCircle, FiClock, FiUpload } from "react-icons/fi";
import StatCard from "../components/StatCard";
import toast from "react-hot-toast";
export function StudentDashboard() {
  const [d, setD] = useState();
  useEffect(() => {
    api.get("/students/dashboard").then((r) => setD(r.data));
  }, []);
  const c = Object.fromEntries((d?.counts || []).map((x) => [x._id, x.count]));
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Applications"
          value={(d?.counts || []).reduce((a, x) => a + x.count, 0)}
          icon={FiBriefcase}
        />
        <StatCard label="Pending" value={c.pending} icon={FiClock} />
        <StatCard label="Selected" value={c.selected} icon={FiCheckCircle} />
      </div>
      <section className="card">
        <h3 className="mb-4 text-lg font-semibold">Recent activity</h3>
        {d?.applications?.length ? (
          d.applications.map((a) => (
            <div className="border-b py-3 last:border-0" key={a._id}>
              <b>{a.job?.title}</b>
              <span className="ml-2 text-sm text-slate-500">
                {a.job?.company?.companyName}
              </span>
              <Status status={a.status} />
            </div>
          ))
        ) : (
          <p className="text-slate-500">
            No applications yet. Explore open opportunities.
          </p>
        )}
      </section>
      <section className="card">
        <h3 className="mb-4 text-lg font-semibold">Announcements</h3>
        {d?.announcements?.length ? (
          <div className="space-y-3">
            {d.announcements.map((announcement) => (
              <article className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4" key={announcement._id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-semibold text-indigo-950">{announcement.title}</h4>
                  <time className="text-xs text-slate-500">{new Date(announcement.createdAt).toLocaleDateString()}</time>
                </div>
                <p className="mt-2 text-sm text-slate-700">{announcement.content}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">No announcements have been published yet.</p>
        )}
      </section>
    </div>
  );
}
export function Profile() {
  const [s, setS] = useState();
  useEffect(() => {
    api
      .get("/students/profile")
      .then((r) => setS(r.data.student))
      .catch(() =>
        api.get("/companies/profile").then((r) => setS(r.data.company)),
      );
  }, []);
  const save = async (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target));
    try {
      const endpoint = s.companyName
        ? "/companies/profile"
        : "/students/profile";
      const r = await api.put(endpoint, d);
      setS(r.data.student || r.data.company);
      toast.success("Profile saved");
    } catch {
      toast.error("Could not save");
    }
  };
  const resume = async (e) => {
    const fd = new FormData();
    fd.append("resume", e.target.files[0]);
    try {
      const r = await api.post("/students/resume", fd);
      setS(r.data.student);
      toast.success("Resume uploaded");
    } catch (e) {
      toast.error(e.response?.data?.message || "Upload failed");
    }
  };
  if (!s) return "Loading…";
  const company = !!s.companyName;
  return (
    <div className="card max-w-2xl">
      <h3 className="mb-5 text-xl font-semibold">
        {company ? "Company" : "Student"} profile
      </h3>
      <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
        {company ? (
          <>
            <Input n="companyName" v={s.companyName} label="Company name" />
            <Input n="industry" v={s.industry} label="Industry" />
            <Input n="website" v={s.website} label="Website" />
            <Input n="location" v={s.location} label="Location" />
          </>
        ) : (
          <>
            <Input n="department" v={s.department} label="Department" />
            <Input
              n="graduationYear"
              v={s.graduationYear}
              label="Graduation year"
            />
            <Input n="cgpa" v={s.cgpa} label="CGPA" />
            <Input
              n="skills"
              v={s.skills?.join(", ")}
              label="Skills (comma-separated)"
            />
          </>
        )}
        <label className="sm:col-span-2 label">
          Bio / Description
          <textarea
            name={company ? "description" : "bio"}
            defaultValue={company ? s.description : s.bio}
          />
        </label>
        <button className="btn">Save changes</button>
      </form>
      {!company && (
        <label className="btn-secondary mt-5 cursor-pointer w-fit">
          <FiUpload /> Upload PDF resume
          <input
            className="hidden"
            type="file"
            accept="application/pdf"
            onChange={resume}
          />
        </label>
      )}
    </div>
  );
}
const Input = ({ n, v, label }) => (
  <label className="label">
    {label}
    <input name={n} defaultValue={v || ""} />
  </label>
);
export const Status = ({ status }) => (
  <span
    className={`badge ml-2 ${status === "selected" ? "bg-emerald-100 text-emerald-700" : status === "rejected" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
  >
    {status}
  </span>
);
