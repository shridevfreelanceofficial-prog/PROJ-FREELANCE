export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-[-10%] right-[-5%] -z-10 w-[600px] h-[600px] bg-[#00E6A8]/5 rounded-full blur-[120px]" />

      <main className="flex-1 pt-32 pb-24 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className="h-14 md:h-20 w-72 md:w-[520px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
            <div className="mt-6 h-7 md:h-8 w-[620px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-full rounded-3xl bg-white/60 backdrop-blur-xl border border-white p-10 shadow-2xl shadow-[#00C896]/10"
              >
                <div className="h-16 w-16 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                <div className="mt-8 h-10 w-72 max-w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                <div className="mt-4 h-5 w-[420px] max-w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                <div className="mt-2 h-5 w-[360px] max-w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />

                <div className="mt-10 flex flex-col sm:flex-row gap-4">
                  <div className="h-14 flex-1 rounded-full bg-[#0F172A]/10 animate-pulse" />
                  <div className="h-14 flex-1 rounded-full bg-[#0F172A]/10 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </section>
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
