import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
const Field = ({ label, ...p }) => (
  <label className="block">
    <span className="label">{label}</span>
    <input {...p} />
  </label>
);
export function Login() {
  const { register, handleSubmit } = useForm();
  const { login } = useAuth(),
    nav = useNavigate();
  const submit = async (d) => {
    try {
      const u = await login(d);
      nav("/" + u.role);
    } catch (e) {
      toast.error(e.response?.data?.message || "Unable to sign in");
    }
  };
  return (
    <AuthShell title="Welcome back">
      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <Field
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />
        <Field
          label="Password"
          type="password"
          {...register("password", { required: true })}
        />
        <button className="btn w-full">Sign in</button>
      </form>
      <p className="mt-5 text-center text-sm">
        New here?{" "}
        <Link className="text-indigo-600" to="/register">
          Create an account
        </Link>
      </p>
      <p className="mt-4 text-center text-xs text-slate-400">
        Admin: admin@campus.edu / Admin@123 after seeding
      </p>
    </AuthShell>
  );
}
export function Register() {
  const { register, handleSubmit, watch } = useForm({
    defaultValues: { role: "student" },
  });
  const { register: signup } = useAuth(),
    nav = useNavigate();
  const role = watch("role");
  const submit = async (d) => {
    try {
      const u = await signup(d);
      nav("/" + u.role);
    } catch (e) {
      toast.error(
        e.response?.data?.message ||
          (e.request
            ? "Cannot reach the API. Ensure the backend is running on port 5000."
            : "Registration failed"),
      );
    }
  };
  return (
    <AuthShell title="Create your account">
      <form onSubmit={handleSubmit(submit)} className="space-y-3">
        <Field
          label={role === "company" ? "Contact name" : "Full name"}
          {...register("name", { required: true })}
        />
        <Field
          label="Email"
          type="email"
          {...register("email", { required: true })}
        />
        <Field
          label="Password"
          type="password"
          {...register("password", { required: true, minLength: 6 })}
        />
        <label className="label">
          I am a{" "}
          <select {...register("role")}>
            <option value="student">Student</option>
            <option value="company">Company</option>
          </select>
        </label>
        {role === "company" ? (
          <Field
            label="Company name"
            {...register("companyName", { required: true })}
          />
        ) : (
          <>
            <Field label="Department" {...register("department")} />
            <Field
              label="Graduation year"
              type="number"
              {...register("graduationYear")}
            />
          </>
        )}
        <button className="btn w-full">Create account</button>
      </form>
      <p className="mt-5 text-center text-sm">
        Already registered?{" "}
        <Link className="text-indigo-600" to="/login">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
function AuthShell({ title, children }) {
  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-indigo-950 via-indigo-700 to-cyan-500 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white/95 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-ink">PlaceFlow</h1>
        <h2 className="mt-6 text-xl font-semibold">{title}</h2>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}
