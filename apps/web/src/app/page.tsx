export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f6f3ed] via-white to-emerald-50 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center px-6">
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">Brooklyn LMS</p>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">Landing builder ready.</h1>
          <p className="max-w-xl text-lg text-slate-600">
            Visit the premium landing preview or jump into the admin editor to customize every block.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/brooklynlms/home"
              className="rounded-full bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_28px_rgba(13,110,106,0.25)]"
            >
              Open landing
            </a>
            <a
              href="/admin/editor"
              className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700"
            >
              Open admin
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
