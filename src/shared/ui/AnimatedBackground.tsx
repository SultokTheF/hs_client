import React from "react";

const AnimatedBackground: React.FC = () => {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="motion-ok animate-bg-pan-slow absolute -inset-[10%]
                   bg-[radial-gradient(1200px_900px_at_10%_10%,theme(colors.neon.200/.6),transparent_60%),radial-gradient(1000px_800px_at_90%_20%,theme(colors.neon.500/.25),transparent_60%),linear-gradient(120deg,var(--bg-a),var(--bg-b))]
                   dark:bg-[radial-gradient(1200px_900px_at_10%_10%,theme(colors.neon.500/.12),transparent_60%),radial-gradient(1000px_800px_at_90%_20%,theme(colors.neon.500/.10),transparent_60%),linear-gradient(120deg,var(--bg-b),var(--bg-a))]
                   "
      />

      <div className="absolute inset-0 bg-radial-fade dark:opacity-80 opacity-70" />

      <div className="motion-ok animate-blob-slow absolute left-[-10%] top-[15%] h-[42rem] w-[42rem] rounded-full bg-neon-500/25 blur-3xl dark:bg-neon-500/20" />
      <div className="motion-ok animate-blob-slower absolute right-[-8%] top-[35%] h-[38rem] w-[38rem] rounded-full bg-neon-300/20 blur-3xl dark:bg-neon-500/15" />
      <div className="motion-ok animate-blob-slow absolute left-[30%] bottom-[-15%] h-[46rem] w-[46rem] rounded-full bg-neon-200/25 blur-3xl dark:bg-neon-500/12" />

      <div className="motion-ok animate-glow absolute left-1/2 top-[38%] h-[26rem] w-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-500/25 blur-[48px] mix-blend-screen dark:bg-neon-500/20" />
    </div>
  );
};

export default AnimatedBackground;
