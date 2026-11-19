import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { Status } from "./StudentPages";
export function Jobs() {
  const [jobs, setJobs] = useState([]),
    [search, setSearch] = useState("");
  const load = () =>
    api.get("/jobs", { params: { search } }).then((r) => setJobs(r.data.jobs));
  useEffect(() => {
    load();
  }, []);
  return (
    <div>
      <div className="mb-5 flex gap-2">
        <input
          placeholder="Search roles, skills, locations…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn" onClick={load}>
          Search
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((j) => (
          <Link
            to={`/jobs/${j._id}`}
            className="card hover:-translate-y-1"
            key={j._id}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{j.title}</h3>
              <Status status={j.status} />
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {j.company?.companyName} · {j.location}
            </p>
            <p className="mt-3 line-clamp-2 text-sm">{j.description}</p>
            <p className="mt-4 text-xs text-slate-400">
              Deadline: {new Date(j.deadline).toLocaleDateString()}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
export function JobDetail() {
  const { id } = useParams(),
    [job, setJob] = useState(),
    { user } = useAuth(),
    nav = useNavigate();
  useEffect(() => {
    api.get("/jobs/" + id).then((r) => setJob(r.data.job));
  }, [id]);
  const apply = async () => {
    try {
      await api.post("/applications/" + id, {});
      toast.success("Application submitted");
      nav("/applications");
    } catch (e) {
      toast.error(e.response?.data?.message || "Could not apply");
    }
  };
  if (!job) return "Loading…";
  return (
    <article className="card max-w-3xl">
      <Status status={job.status} />
      <h1 className="mt-3 text-3xl font-bold">{job.title}</h1>
      <p className="mt-1 text-slate-500">
        {job.company?.companyName} · {job.location} · {job.jobType}
      </p>
      <p className="mt-6 whitespace-pre-line">{job.description}</p>
      <h3 className="mt-6 font-semibold">Requirements</h3>
      <ul className="mt-2 list-disc pl-5">
        {job.requirements?.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      {user?.role === "student" && (
        <button className="btn mt-7" onClick={apply}>
          Apply now
        </button>
      )}
    </article>
  );
}
export function Applications() {
  const [apps, setApps] = useState([]);
  const load = () =>
    api.get("/applications").then((r) => setApps(r.data.applications));
  useEffect(() => {
    load();
  }, []);
  const withdraw = async (id) => {
    await api.patch(`/applications/${id}/withdraw`);
    toast.success("Application withdrawn");
    load();
  };
  return (
    <div className="card overflow-x-auto">
      <h2 className="mb-4 text-xl font-bold">My applications</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b text-sm text-slate-500">
            <th className="p-2">Job</th>
            <th>Company</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {apps.map((a) => (
            <tr key={a._id} className="border-b">
              <td className="p-2 font-medium">{a.job?.title}</td>
              <td>{a.job?.company?.companyName}</td>
              <td>
                <Status status={a.status} />
              </td>
              <td>
                {a.status === "pending" && (
                  <button
                    className="text-rose-600"
                    onClick={() => withdraw(a._id)}
                  >
                    Withdraw
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
