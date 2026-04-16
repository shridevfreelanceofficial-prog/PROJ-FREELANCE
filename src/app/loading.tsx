export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="h-12 w-72 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
        <div className="mt-4 h-6 w-[32rem] max-w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-3xl border border-white bg-white/60 backdrop-blur-xl p-6 shadow-xl shadow-[#00C896]/5"
            >
              <div className="h-40 w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />
              <div className="mt-6 h-6 w-2/3 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
              <div className="mt-3 h-4 w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />
              <div className="mt-2 h-4 w-5/6 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
              <div className="mt-6 flex gap-3">
                <div className="h-10 w-28 rounded-full bg-[#0F172A]/10 animate-pulse" />
                <div className="h-10 w-28 rounded-full bg-[#0F172A]/10 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
