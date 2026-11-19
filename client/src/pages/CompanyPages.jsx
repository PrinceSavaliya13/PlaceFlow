import { useEffect, useState } from "react";
import api from "../services/api";
import StatCard from "../components/StatCard";
import { FiBriefcase, FiUsers, FiPlus } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
export function CompanyDashboard() {
  const [d, setD] = useState();
  useEffect(() => {
    api.get("/companies/dashboard").then((r) => setD(r.data));
  }, []);
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard label="Total jobs" value={d?.stats.jobs} icon={FiBriefcase} />
      <StatCard label="Open jobs" value={d?.stats.open} icon={FiPlus} />
      <StatCard
        label="Applications"
        value={d?.stats.applications}
        icon={FiUsers}
      />
    </div>
  );
}
const empty = {
  title: "",
  description: "",
  requirements: "",
  location: "",
  jobType: "Full-time",
  deadline: "",
};
export function ManageJobs() {
  const [jobs, setJobs] = useState([]),
    [form, setForm] = useState(empty),
    [edit, setEdit] = useState(null),
    [loading, setLoading] = useState(true);
  const load = () =>
    api
      .get("/companies/dashboard")
      .then((r) => setJobs(Array.isArray(r.data.jobs) ? r.data.jobs : []))
      .catch((error) =>
        toast.error(error.response?.data?.message || "Could not load your jobs"),
      )
      .finally(() => setLoading(false));
  useEffect(() => {
    load();
  }, []);
  const submit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      requirements: form.requirements
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
    };
    try {
      edit
        ? await api.put("/jobs/" + edit, data)
        : await api.post("/jobs", data);
      toast.success(edit ? "Job updated" : "Job created");
      setForm(empty);
      setEdit(null);
      load();
    } catch (e) {
      toast.error(e.response?.data?.message || "Action failed");
    }
  };
  const start = (j) => {
    setEdit(j._id);
    setForm({
      ...j,
      requirements: j.requirements.join(","),
      deadline: j.deadline.slice(0, 10),
    });
  };
  const del = async (id) => {
    if (confirm("Delete this job?")) {
      await api.delete("/jobs/" + id);
      load();
    }
  };
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={submit} className="card h-fit space-y-3">
        <h2 className="font-bold">{edit ? "Edit job" : "Post a job"}</h2>
        {["title", "location", "deadline"].map((n) => (
          <input
            key={n}
            type={n === "deadline" ? "date" : "text"}
            placeholder={n}
            value={form[n] || ""}
            onChange={(e) => setForm({ ...form, [n]: e.target.value })}
            required
          />
        ))}
        <select
          value={form.jobType}
          onChange={(e) => setForm({ ...form, jobType: e.target.value })}
        >
          <option>Full-time</option>
          <option>Internship</option>
          <option>Part-time</option>
          <option>Remote</option>
        </select>
        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />
        <input
          placeholder="Requirements, comma-separated"
          value={form.requirements}
          onChange={(e) => setForm({ ...form, requirements: e.target.value })}
        />
        <button className="btn w-full">{edit ? "Update" : "Publish"}</button>
      </form>
      <div className="space-y-3 lg:col-span-2">
        {loading && <div className="card text-slate-500">Loading jobs…</div>}
        {!loading && jobs.length === 0 && (
          <div className="card text-slate-500">
            No jobs posted yet. Use the form to publish your first opportunity.
          </div>
        )}
        {jobs.map((j) => (
          <div className="card flex items-center justify-between" key={j._id}>
            <div>
              <b>{j.title}</b>
              <p className="text-sm text-slate-500">
                {j.location} · {j.status}
              </p>
            </div>
            <div className="flex gap-3">
              <Link className="text-emerald-600" to={`/company/jobs/${j._id}/applicants`}>
                Applicants
              </Link>
              <button className="text-indigo-600" onClick={() => start(j)}>
                Edit
              </button>
              <button className="text-rose-600" onClick={() => del(j._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function JobApplicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [error, setError] = useState("");
  const load = () =>
    api
      .get(`/companies/jobs/${jobId}/applicants`)
      .then((r) => setApplications(Array.isArray(r.data.applications) ? r.data.applications : []))
      .catch((err) => setError(err.response?.data?.message || "Could not load applicants."));
  useEffect(() => {
    load();
  }, [jobId]);
  const changeStatus = async (applicationId, status) => {
    try {
      await api.patch(`/companies/applications/${applicationId}/status`, { status });
      toast.success(`Candidate ${status}`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update application");
    }
  };
  return (
    <div className="card overflow-x-auto">
      <h2 className="mb-1 text-xl font-bold">Applicants</h2>
      <p className="mb-5 text-sm text-slate-500">Review candidates and update their placement status.</p>
      {error && <p className="rounded-xl bg-rose-50 p-3 text-rose-700">{error}</p>}
      {!error && applications.length === 0 && <p className="text-slate-500">No applications received for this job yet.</p>}
      {applications.map((application) => {
        const student = application.student;
        return (
          <div className="border-b py-4 last:border-0" key={application._id}>
            <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
              <div>
                <b>{student?.user?.name || "Student"}</b>
                <p className="text-sm text-slate-500">{student?.user?.email} · {student?.department || "Department not provided"}</p>
                {student?.skills?.length > 0 && <p className="mt-1 text-sm">Skills: {student.skills.join(", ")}</p>}
                {student?.resume && <a className="mt-1 inline-block text-sm text-indigo-600" href={`http://localhost:5000${student.resume}`} target="_blank" rel="noreferrer">View resume</a>}
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="badge bg-slate-100 text-slate-700">{application.status}</span>
                <button className="btn-secondary text-sm" onClick={() => changeStatus(application._id, "shortlisted")}>Shortlist</button>
                <button className="btn bg-emerald-600 text-sm hover:bg-emerald-700" onClick={() => changeStatus(application._id, "selected")}>Select</button>
                <button className="btn-secondary border-rose-200 text-sm text-rose-600" onClick={() => changeStatus(application._id, "rejected")}>Reject</button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
