import React from "react";
import clsx from "clsx";

type LogoProps = {
  size?: number;
  className?: string;
};

export const LogoMark: React.FC<LogoProps> = ({ size = 40, className }) => {
  return (
    <div
      className={clsx(
        "inline-flex items-center justify-center rounded-xl shadow-glass ring-1 ring-black/5 dark:ring-white/10",
        className,
      )}
      style={{
        width: size,
        height: size,
        background:
          "linear-gradient(135deg, rgba(169,255,0,0.95) 0%, rgba(201,255,64,0.95) 40%, rgba(245,255,200,0.95) 100%)",
      }}
    >
      <svg viewBox="0 0 48 48" width={size * 0.72} height={size * 0.72} aria-hidden>
        <path
          d="M10 17c0-3.866 3.134-7 7-7 6 0 8 9 14 9 3.866 0 7-3.134 7-7M10 31c0 3.866 3.134 7 7 7 6 0 8-9 14-9 3.866 0 7 3.134 7 7"
          fill="none"
          stroke="black"
          strokeWidth="4.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export const LogoWordmark: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={clsx("flex items-center gap-3", className)}>
      <LogoMark size={44} />
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            HiggsSeries
          </span>
          <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-zinc-700 ring-1 ring-black/10 dark:bg-white/10 dark:text-white/80 dark:ring-white/15">
            studio
          </span>
        </div>
        <p className="text-sm text-zinc-600 dark:text-white/60">AI short-film generator</p>
      </div>
    </div>
  );
};

export default LogoWordmark;
