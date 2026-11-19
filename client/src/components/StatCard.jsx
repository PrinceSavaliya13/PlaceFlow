export default function StatCard({
  label,
  value,
  icon: Icon,
  color = "indigo",
}) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold">{value ?? 0}</p>
        </div>
        {Icon && <Icon className={`text-3xl text-${color}-500`} />}
      </div>
    </div>
  );
}
