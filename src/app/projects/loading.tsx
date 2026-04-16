export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-[#F4FFFA]">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#00C896]/10 via-transparent to-transparent opacity-80" />
      <div className="fixed top-20 right-0 -z-10 w-[500px] h-[500px] bg-[#00E6A8]/10 rounded-full blur-[120px]" />
      <div className="fixed bottom-0 left-0 -z-10 w-[600px] h-[600px] bg-[#0F766E]/5 rounded-full blur-[150px]" />

      <main className="flex-1 pt-32 pb-16 relative z-10 w-full">
        <section className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <div className="h-14 md:h-20 w-72 md:w-[520px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
            <div className="mt-6 h-7 md:h-8 w-[620px] max-w-full rounded-3xl bg-[#0F172A]/10 animate-pulse mx-auto" />
          </div>

          <div className="bg-white/30 p-4 md:p-8 rounded-[2rem] border border-white/50 backdrop-blur-md shadow-2xl shadow-[#00C896]/10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-3xl bg-white/60 backdrop-blur-xl border border-white p-6 shadow-xl shadow-[#00C896]/5"
                >
                  <div className="h-40 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="mt-6 h-6 w-2/3 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="mt-3 h-4 w-full rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="mt-2 h-4 w-5/6 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                  <div className="mt-6 h-11 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                </div>
              ))}
            </div>
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
