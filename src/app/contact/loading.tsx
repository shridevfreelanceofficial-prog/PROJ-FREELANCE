export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#00C896]/15 via-transparent to-transparent opacity-80" />
      <div className="fixed top-0 right-0 -z-10 w-[700px] h-[700px] bg-[#00E6A8]/10 rounded-full blur-[150px]" />

      <main className="flex-1 w-full pt-32 pb-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="h-14 md:h-20 w-[520px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
            <div className="mt-6 h-7 md:h-8 w-[640px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 w-full flex flex-col gap-6">
              <div className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white p-8 shadow-2xl shadow-[#00C896]/5">
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-7 w-52 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                    <div className="mt-3 h-5 w-40 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-16 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="h-16 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                </div>

                <div className="mt-8 flex gap-3">
                  <div className="h-12 flex-1 rounded-xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="h-12 flex-1 rounded-xl bg-[#0F172A]/10 animate-pulse" />
                </div>
              </div>

              <div className="rounded-3xl bg-[#0F172A] border border-white/10 p-8 shadow-2xl">
                <div className="h-6 w-40 rounded-2xl bg-white/10 animate-pulse" />
                <div className="mt-4 h-4 w-full rounded-2xl bg-white/10 animate-pulse" />
                <div className="mt-2 h-4 w-5/6 rounded-2xl bg-white/10 animate-pulse" />
              </div>
            </div>

            <div className="lg:col-span-7 w-full">
              <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white p-8 md:p-10 shadow-2xl shadow-[#0F172A]/5">
                <div className="h-10 w-56 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                <div className="mt-8 space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  ))}
                  <div className="h-14 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#0F172A] text-white py-12 relative z-10 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-6 flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#00C896] to-[#00E6A8]" />
          </div>
          <div className="h-4 w-80 max-w-full rounded-2xl bg-white/10 animate-pulse mx-auto" />
        </div>
      </footer>
    </div>
  );
}
