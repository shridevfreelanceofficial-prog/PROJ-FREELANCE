export default function Loading() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] via-[#0F766E] to-[#10B981]"></div>
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, white 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      ></div>

      <div className="absolute top-24 left-10 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-[28rem] h-[28rem] bg-teal-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 pt-32 pb-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 ring-1 ring-white/15 backdrop-blur-xl rounded-2xl mb-5 shadow-2xl">
              <div className="w-10 h-10 rounded-xl bg-white/10 animate-pulse" />
            </div>
            <div className="h-14 sm:h-16 w-[520px] max-w-full rounded-3xl bg-white/15 animate-pulse mx-auto" />
            <div className="mt-4 h-6 w-[560px] max-w-full rounded-3xl bg-white/10 animate-pulse mx-auto" />
          </div>

          <div className="backdrop-blur-2xl bg-white/95 shadow-[0_30px_80px_-40px_rgba(0,0,0,0.65)] border border-white/40 rounded-3xl">
            <div className="p-7 sm:p-8 space-y-5">
              <div>
                <div className="h-4 w-32 rounded-2xl bg-[#0F172A]/10 animate-pulse" />
                <div className="mt-3 h-[58px] rounded-2xl bg-[#0F172A]/10 animate-pulse" />
              </div>
              <div className="h-[56px] rounded-2xl bg-[#0F172A]/10 animate-pulse" />
            </div>
          </div>

          <div className="mt-8 text-center">
            <div className="h-4 w-40 rounded-2xl bg-white/10 animate-pulse mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
