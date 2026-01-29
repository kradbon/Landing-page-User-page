"use client";

export function PortalPage({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-extrabold text-slate-900">{title}</h1>
      {subtitle ? <p className="mt-2 text-sm font-semibold text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

