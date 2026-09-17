const revisionDays = [3, 5, 7, 15, 30];

export function RevisionCadence() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-200/60">
            Revision rhythm
          </p>
          <p className="mt-1 text-sm text-white/70">From solved to remembered</p>
        </div>
        <span className="rounded-full bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
          5 reviews
        </span>
      </div>

      <div className="relative flex items-start justify-between">
        <div className="absolute left-5 right-5 top-5 h-px bg-gradient-to-r from-emerald-300/70 via-emerald-300/30 to-white/10" />
        {revisionDays.map((day, index) => (
          <div
            className="relative flex flex-col items-center gap-2.5"
            key={day}
          >
            <span
              className={
                index === 0
                  ? "grid size-10 place-items-center rounded-full border border-emerald-200 bg-emerald-300 text-sm font-bold text-[#10221b] shadow-[0_0_0_5px_rgba(110,231,183,0.08)]"
                  : "grid size-10 place-items-center rounded-full border border-white/15 bg-[#173229] text-sm font-semibold text-white/80"
              }
            >
              {day}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
              Day
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
