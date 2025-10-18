/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  MutableRefObject,
} from "react";
import clsx from "clsx";
import { Play, Pause, Maximize, Minimize } from "lucide-react";
import { Loader } from "@/shared/ui/Loader";

export type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  src: string;
  poster?: string;
  wrapperClassName?: string;
};

const AUTO_HIDE_MS = 1800;

const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      autoPlay = false,
      controls = false,
      className,
      wrapperClassName,
      muted: mutedProp,
      preload = "metadata",
      playsInline = true,
      ...rest
    },
    ref,
  ) => {
    const internalRef = useRef<HTMLVideoElement>(null);
    const videoRef = (ref as MutableRefObject<HTMLVideoElement>) || internalRef;

    const [ready, setReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [isPlaying, setIsPlaying] = useState(!!autoPlay);
    const [showUi, setShowUi] = useState(true);
    const [isSeeking, setIsSeeking] = useState(false);

    const [duration, setDuration] = useState(0);
    const [time, setTime] = useState(0);
    const [isFs, setIsFs] = useState(false);

    const wrapRef = useRef<HTMLDivElement>(null);
    const hideTimer = useRef<number | null>(null);

    const pokeUi = useCallback(() => {
      setShowUi(true);
      if (AUTO_HIDE_MS > 0) {
        if (hideTimer.current) window.clearTimeout(hideTimer.current);
        hideTimer.current = window.setTimeout(() => setShowUi(false), AUTO_HIDE_MS) as any;
      }
    }, []);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      const onLoaded = () => {
        setDuration(Number.isFinite(v.duration) ? v.duration : 0);
        setReady(true);
        setLoading(false);
      };
      const onDuration = () => setDuration(Number.isFinite(v.duration) ? v.duration : 0);
      const onWaiting = () => setLoading(true);
      const onPlaying = () => {
        setIsPlaying(true);
        setLoading(false);
      };
      const onPauseEvt = () => {
        setIsPlaying(false);
        setLoading(false);
      };
      const onTime = () => setTime(v.currentTime || 0);
      const onErr = () => {
        setLoading(false);
        setErrorMsg(v.error ? `Playback error (code ${v.error.code})` : "Playback error");
      };

      v.addEventListener("loadedmetadata", onLoaded);
      v.addEventListener("durationchange", onDuration);
      v.addEventListener("waiting", onWaiting);
      v.addEventListener("playing", onPlaying);
      v.addEventListener("pause", onPauseEvt);
      v.addEventListener("timeupdate", onTime);
      v.addEventListener("error", onErr);

      return () => {
        v.removeEventListener("loadedmetadata", onLoaded);
        v.removeEventListener("durationchange", onDuration);
        v.removeEventListener("waiting", onWaiting);
        v.removeEventListener("playing", onPlaying);
        v.removeEventListener("pause", onPauseEvt);
        v.removeEventListener("timeupdate", onTime);
        v.removeEventListener("error", onErr);
      };
    }, [videoRef]);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = !!mutedProp;
    }, [mutedProp]);

    useEffect(() => {
      const onFs = () => setIsFs(!!document.fullscreenElement);
      document.addEventListener("fullscreenchange", onFs);
      return () => document.removeEventListener("fullscreenchange", onFs);
    }, []);

    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        const target = e.target as HTMLElement | null;
        if (!target?.closest("[data-liquid-player]")) return;
        switch (e.key) {
          case " ":
          case "k":
            e.preventDefault();
            togglePlay();
            break;
          case "f":
            e.preventDefault();
            toggleFs();
            break;
        }
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    const togglePlay = useCallback(() => {
      const v = videoRef.current;
      if (!v) return;
      if (v.paused) {
        v.play().catch(() => setErrorMsg("Autoplay was blocked"));
      } else {
        v.pause();
      }
      pokeUi();
    }, [videoRef, pokeUi]);

    const seekTo = useCallback(
      (t: number) => {
        const v = videoRef.current;
        if (!v || !Number.isFinite(duration) || duration <= 0) return;
        const next = Math.max(0, Math.min(duration, t));
        v.currentTime = next;
        setTime(next);
      },
      [videoRef, duration],
    );

    const toggleFs = useCallback(async () => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      if (!document.fullscreenElement) await wrap.requestFullscreen();
      else await document.exitFullscreen();
      pokeUi();
    }, [pokeUi]);

    const gradientGlass =
      "ring-[var(--glass-ring)] bg-white/[0.10] dark:bg-white/[0.07] " +
      "before:absolute before:inset-px before:rounded-[calc(theme(borderRadius.2xl)-2px)] " +
      "before:bg-gradient-to-b before:from-white/30 before:to-white/[0.05] before:pointer-events-none " +
      "after:absolute after:inset-0 after:rounded-[inherit] after:pointer-events-none " +
      "after:[background:radial-gradient(40%_60%_at_20%_10%,theme(colors.neon.500/0.10),transparent_60%),radial-gradient(55%_45%_at_80%_30%,theme(colors.neon.200/0.08),transparent_60%)] " +
      "motion-ok:after:animate-liquid-slow";

    const sliderThumb =
      "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 " +
      "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white " +
      "[&::-webkit-slider-thumb]:shadow-none " +
      "hover:[&::-webkit-slider-thumb]:scale-110 " +
      "[&::-moz-range-thumb]:h-3 [&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white";

    const sliderTrackInvisible =
      "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-transparent " +
      "[&::-moz-range-track]:h-1 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-transparent";

    const sliderCommon = clsx(
      "relative z-10 block w-full appearance-none bg-transparent",
      "p-0 m-0 pb-[7px] leading-none align-middle",
      sliderThumb,
      sliderTrackInvisible,
      "focus:outline-none",
    );

    return (
      <div
        ref={wrapRef}
        data-liquid-player
        className={clsx(
          "relative overflow-hidden rounded-xl shadow-glass",
          "bg-black/30 backdrop-blur-2xl border border-white/10",
          "transition-all duration-500",
          wrapperClassName,
        )}
        onPointerMove={pokeUi}
        onMouseLeave={() => setShowUi(false)}
      >
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          controls={false}
          muted={mutedProp}
          playsInline={playsInline}
          preload={preload}
          className={clsx("w-full h-auto object-cover", className)}
          onClick={togglePlay}
          {...rest}
        />

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          {loading && !errorMsg && (
            <div
              className={clsx(
                "pointer-events-auto relative isolate rounded-2xl px-3 py-2 text-white ring-1",
                "bg-white/10 backdrop-blur-xl",
                gradientGlass,
              )}
            >
              <div className="flex items-center gap-2">
                <Loader size="sm" />
                <span className="text-xs opacity-90">Loading…</span>
              </div>
            </div>
          )}
          {errorMsg && (
            <div
              className={clsx(
                "pointer-events-auto relative isolate rounded-2xl px-3 py-2 text-white ring-1",
                "bg-white/10 backdrop-blur-xl",
                gradientGlass,
              )}
              role="alert"
            >
              <span className="text-xs">{errorMsg}</span>
            </div>
          )}
        </div>

        {!isPlaying && !loading && !errorMsg && (
          <button
            type="button"
            onClick={togglePlay}
            className={clsx(
              "pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              "inline-flex items-center gap-2 rounded-2xl px-3 py-1.5 text-white ring-1",
              "bg-white/10 backdrop-blur-xl hover:bg-white/12 active:bg-white/14",
              gradientGlass,
              "transition-opacity duration-300",
            )}
            aria-label="Play"
            title="Play"
          >
            <Play className="h-5 w-5" /> Play
          </button>
        )}

        <div
          className={clsx(
            "pointer-events-none absolute inset-x-4 bottom-3 text-white",
            "transition-opacity duration-300",
            showUi || isSeeking || !ready || loading || errorMsg ? "opacity-100" : "opacity-0",
          )}
          aria-hidden={!(showUi || isSeeking || !ready || loading || errorMsg)}
        >
          <div
            className={clsx(
              "relative isolate pointer-events-auto flex items-center gap-2",
              "rounded-2xl ring-1 p-2",
              "bg-white/15 backdrop-blur-xl",
              gradientGlass,
            )}
          >
            <button
              type="button"
              onClick={togglePlay}
              className={clsx(
                "inline-flex items-center justify-center rounded-lg p-1.5",
                "text-white/95 hover:text-white focus-visible:outline-none",
                "ring-1 ring-[var(--glass-ring)] bg-white/10 hover:bg-white/12 active:bg-white/14",
                "backdrop-blur-xl shadow-glass transition-all",
                "focus-visible:ring-2 focus-visible:ring-neon-500/50",
                "active:translate-y-[0.5px] active:scale-[0.995]",
              )}
              aria-label={isPlaying ? "Pause" : "Play"}
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </button>

            <div className="flex-1 flex items-center">
              <input
                type="range"
                min={0}
                max={duration > 0 ? duration : 0}
                step={0.01}
                value={duration > 0 ? time : 0}
                disabled={duration <= 0}
                onChange={(e) => {
                  setIsSeeking(true);
                  seekTo(parseFloat(e.target.value));
                }}
                onPointerDown={() => setIsSeeking(true)}
                onPointerUp={() => {
                  setIsSeeking(false);
                  pokeUi();
                }}
                className={clsx("w-full", "h-4", "relative", sliderCommon)}
                aria-label="Seek"
              />
            </div>

            <button
              type="button"
              onClick={toggleFs}
              className={clsx(
                "inline-flex items-center justify-center rounded-lg p-1.5",
                "text-white/95 hover:text-white focus-visible:outline-none",
                "ring-1 ring-[var(--glass-ring)] bg-white/10 hover:bg-white/12 active:bg-white/14",
                "backdrop-blur-xl shadow-glass transition-all",
                "focus-visible:ring-2 focus-visible:ring-neon-500/50",
                "active:translate-y-[0.5px] active:scale-[0.995]",
              )}
              aria-label="Fullscreen"
              title="Fullscreen"
            >
              {isFs ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    );
  },
);

VideoPlayer.displayName = "VideoPlayer";

export { VideoPlayer };
