import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

function HeartBackground() {
  // Floating hearts + soft gradient glow
  const hearts = useMemo(
    () =>
      Array.from({ length: 22 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 26,
        delay: Math.random() * 2.5,
        duration: 6 + Math.random() * 10,
        drift: -20 + Math.random() * 40,
        opacity: 0.18 + Math.random() * 0.22,
      })),
    [],
  );

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50" />

      {/* animated blobs */}
      <motion.div
        className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl"
        animate={{
          x: [0, 40, -20, 0],
          y: [0, 10, 30, 0],
          scale: [1, 1.08, 0.96, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-fuchsia-200/40 blur-3xl"
        animate={{
          x: [0, -30, 20, 0],
          y: [0, -20, 10, 0],
          scale: [1, 0.96, 1.1, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* floating hearts */}
      {hearts.map((h) => (
        <motion.div
          key={h.id}
          className="pointer-events-none absolute"
          style={{
            left: `${h.left}%`,
            width: h.size,
            height: h.size,
            opacity: h.opacity,
          }}
          initial={{ y: "110%", rotate: 0 }}
          animate={{
            y: "-20%",
            rotate: [0, 10, -10, 0],
            x: [0, h.drift, -h.drift / 2, 0],
          }}
          transition={{
            delay: h.delay,
            duration: h.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
            <path
              d="M12 21s-7.2-4.6-9.7-8.7C.7 9.3 2.2 5.8 5.6 5.1c1.8-.4 3.5.3 4.5 1.6 1-1.3 2.7-2 4.5-1.6 3.4.7 4.9 4.2 3.3 7.2C19.2 16.4 12 21 12 21Z"
              className="fill-rose-400"
            />
          </svg>
        </motion.div>
      ))}

      {/* subtle noise */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#000_1px,transparent_1px)] [background-size:18px_18px]" />
    </div>
  );
}

function Pill({ active, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all md:text-sm
        ${
          active
            ? "bg-rose-600 text-white shadow-lg shadow-rose-200"
            : "bg-white/60 text-rose-700 hover:bg-white/80"
        }`}
    >
      <span className="relative z-10">{label}</span>
      <motion.span
        className="absolute inset-0 rounded-full"
        initial={false}
        animate={active ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.25 }}
        style={{
          background:
            "linear-gradient(90deg, rgba(244,63,94,1), rgba(236,72,153,1), rgba(244,63,94,1))",
        }}
      />
    </button>
  );
}

function PhotoGrid({ photos = [], accent = "rose" }) {
  const palette = {
    rose: "from-rose-200/60 via-pink-200/40 to-fuchsia-200/50",
    pink: "from-pink-200/60 via-rose-200/40 to-fuchsia-200/50",
    fuchsia: "from-fuchsia-200/60 via-pink-200/40 to-rose-200/50",
  };

  const fallback = Array.from({ length: 6 }).map(
    (_, i) =>
      `https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=80&sig=${i}`,
  );

  const items = (photos?.length ? photos : fallback).slice(0, 8);

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <div
        className={`pointer-events-none absolute -inset-2 rounded-3xl bg-gradient-to-br ${palette[accent]} blur-2xl`}
      />
      <div className="relative grid grid-cols-3 gap-2 rounded-3xl bg-white/55 p-3 backdrop-blur-xl shadow-xl shadow-rose-100">
        {items.map((src, idx) => (
          <motion.div
            key={src + idx}
            className="relative overflow-hidden rounded-2xl bg-white"
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.06 * idx, ease: "easeOut" }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.img
              src={src}
              alt={`Memory ${idx + 1}`}
              className="h-28 w-full object-cover sm:h-32 md:h-36"
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <motion.div
              className="pointer-events-none absolute inset-0"
              animate={{
                background: [
                  "linear-gradient(180deg, rgba(244,63,94,0.00), rgba(244,63,94,0.10))",
                  "linear-gradient(180deg, rgba(236,72,153,0.00), rgba(236,72,153,0.10))",
                  "linear-gradient(180deg, rgba(244,63,94,0.00), rgba(244,63,94,0.10))",
                ],
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function SparkleLine() {
  return (
    <div className="relative my-6 flex items-center gap-3">
      <motion.div
        className="h-[2px] flex-1 rounded-full bg-rose-200"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ transformOrigin: "left" }}
      />
      <motion.div
        className="h-2 w-2 rounded-full bg-rose-400"
        animate={{ scale: [1, 1.35, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="h-[2px] flex-1 rounded-full bg-rose-200"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.08 }}
        style={{ transformOrigin: "right" }}
      />
    </div>
  );
}

function YesHeartBurst({ show }) {
  const bursts = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => ({
        id: i,
        x: -120 + Math.random() * 240,
        y: -120 + Math.random() * 240,
        s: 0.7 + Math.random() * 0.9,
        r: -30 + Math.random() * 60,
        d: Math.random() * 0.2,
      })),
    [],
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {bursts.map((b) => (
            <motion.div
              key={b.id}
              className="absolute left-1/2 top-1/2"
              initial={{ x: 0, y: 0, scale: 0.2, rotate: 0, opacity: 0 }}
              animate={{
                x: b.x,
                y: b.y,
                scale: b.s,
                rotate: b.r,
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 1.2, delay: b.d, ease: "easeOut" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 21s-7.2-4.6-9.7-8.7C.7 9.3 2.2 5.8 5.6 5.1c1.8-.4 3.5.3 4.5 1.6 1-1.3 2.7-2 4.5-1.6 3.4.7 4.9 4.2 3.3 7.2C19.2 16.4 12 21 12 21Z"
                  className="fill-rose-500"
                />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function CelebrationOverlay({ show }) {
  // Full-screen flower + party popper burst
  const particles = useMemo(() => {
    const emojis = ["🌸", "💐", "🎉", "🎊", "🌷", "✨"];
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      emoji: emojis[i % emojis.length],
      x0: (Math.random() * 100).toFixed(2),
      x1: (-25 + Math.random() * 150).toFixed(2),
      r: (-180 + Math.random() * 360).toFixed(0),
      s: (0.8 + Math.random() * 1.4).toFixed(2),
      d: (Math.random() * 0.35).toFixed(2),
      t: (1.4 + Math.random() * 1.0).toFixed(2),
    }));
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[80]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* soft flash */}
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0] }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-rose-200/30 via-pink-200/30 to-fuchsia-200/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 0] }}
            transition={{ duration: 1.8, ease: "easeOut" }}
          />

          {/* particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute left-1/2 top-[55%] text-3xl md:text-4xl"
              style={{
                transform: "translate(-50%, -50%)",
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0.2,
                rotate: 0,
                opacity: 0,
              }}
              animate={{
                x: `${p.x1}vw`,
                y: "-80vh",
                scale: Number(p.s),
                rotate: Number(p.r),
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                delay: Number(p.d),
                duration: Number(p.t),
                ease: "easeOut",
              }}
            >
              {p.emoji}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

//--------------------------

function AudioBar({ src = "/audio/love.mp3" }) {
  const audioRef = useRef(null);
  const rafRef = useRef(null);

  const [ready, setReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(0);
  const [dragging, setDragging] = useState(false);

  const lineRef = useRef(null);

  const fmt = (t) => {
    if (!Number.isFinite(t)) return "0:00";
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const stopRAF = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  };

  const tick = () => {
    const a = audioRef.current;
    if (!a) return;
    setCur(a.currentTime || 0);
    setDur(a.duration || 0);
    rafRef.current = requestAnimationFrame(tick);
  };

  const tryAutoPlay = async () => {
    const a = audioRef.current;
    if (!a) return;
    try {
      await a.play();
      setBlocked(false);
      setPlaying(true);
      stopRAF();
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setBlocked(true);
      setPlaying(false);
      stopRAF();
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onLoaded = () => {
      setReady(true);
      setDur(a.duration || 0);
      tryAutoPlay();
    };

    const onPlay = () => {
      setPlaying(true);
      stopRAF();
      rafRef.current = requestAnimationFrame(tick);
    };

    const onPause = () => {
      setPlaying(false);
      stopRAF();
    };

    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);

    return () => {
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      stopRAF();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;

    if (a.paused) {
      try {
        await a.play();
        setBlocked(false);
      } catch {
        setBlocked(true);
      }
    } else {
      a.pause();
    }
  };

  const setFromClientX = (clientX) => {
    const a = audioRef.current;
    const el = lineRef.current;
    if (!a || !el || !Number.isFinite(a.duration)) return;

    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    const p = r.width ? x / r.width : 0;
    a.currentTime = p * a.duration;
    setCur(a.currentTime);
  };

  const onPointerDown = (e) => {
    setDragging(true);
    setFromClientX(e.clientX);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const onPointerMove = (e) => {
    if (!dragging) return;
    setFromClientX(e.clientX);
  };

  const onPointerUp = () => setDragging(false);

  const pct = dur > 0 ? (cur / dur) * 100 : 0;

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" />

      {/* minimal bottom player */}
      <div className="fixed inset-x-0 bottom-3 z-[120] px-4">
        {/* line area */}
        <div className="relative mx-auto max-w-6xl">
          <div
            ref={lineRef}
            className="relative h-[8px] w-full rounded-full bg-rose-200/70 cursor-pointer"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{ touchAction: "none" }}
          >
            {/* progress */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-rose-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* centered play/pause button (on the line) */}
          <button
            onClick={toggle}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-rose-600 text-white shadow-lg shadow-rose-200 cursor-pointer"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M7 5h3v14H7V5Zm7 0h3v14h-3V5Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7L8 5Z" fill="currentColor" />
              </svg>
            )}
          </button>

          {/* tiny time (optional; remove if you want super clean) */}
          <div className="mt-2 flex items-center justify-center gap-3 text-[11px] font-semibold text-rose-900/60">
            <span>{fmt(cur)}</span>
            <span className="opacity-40">•</span>
            <span>{ready ? fmt(dur) : "…"}</span>
          </div>
        </div>
      </div>
    </>
  );
}

const AUDIO_SRC = "/audio/co2.mp3";

//---------------------------

function HeartRevealOverlay({ show, images = [] }) {
  // fallback if src empty
  const fallback =
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=1200&q=80";

  const list = images.length ? images : [fallback];

  const [index, setIndex] = useState(0);

  // change image every 5 sec
  useEffect(() => {
    if (!show) return;

    const id = setInterval(() => {
      setIndex((p) => (p + 1) % list.length);
    }, 5000); // 🔥 5 seconds

    return () => clearInterval(id);
  }, [show, list.length]);

  const img = list[index];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none fixed inset-0 z-[85] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {/* soft background glow */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background:
                "radial-gradient(circle at center, rgba(244,63,94,0.22), rgba(244,63,94,0.00) 55%)",
            }}
          />

          {/* blurred heart glow behind */}
          <motion.div
            className="absolute"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.05, opacity: 0.55 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              width: "min(78vw, 520px)",
              height: "min(78vw, 520px)",
              filter: "blur(28px)",
              background:
                "radial-gradient(circle at 40% 35%, rgba(244,63,94,0.55), rgba(236,72,153,0.20), rgba(217,70,239,0.05))",
              clipPath:
                "path('M23.6,0 C20.2,0 17.2,2.1 16,5.2 C14.8,2.1 11.8,0 8.4,0 C3.8,0 0,3.8 0,8.4 C0,17.5 16,29.6 16,29.6 C16,29.6 32,17.5 32,8.4 C32,3.8 28.2,0 23.6,0 Z')",
            }}
          />

          {/* main heart */}
          <motion.div
            className="relative"
            initial={{ scale: 0.72, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.08, opacity: 0, y: -6 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
            style={{
              width: "min(78vw, 520px)",
              height: "min(78vw, 520px)",
            }}
          >
            <svg
              viewBox="0 0 32 29.6"
              width="100%"
              height="100%"
              className="drop-shadow-[0_18px_40px_rgba(244,63,94,0.22)]"
            >
              <defs>
                <clipPath id="heartClip">
                  <path d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.2C14.8,2.1,11.8,0,8.4,0 C3.8,0,0,3.8,0,8.4c0,9.1,16,21.2,16,21.2s16-12.1,16-21.2 C32,3.8,28.2,0,23.6,0z" />
                </clipPath>
              </defs>

              {/* photo inside heart */}
              <image
                href={img}
                x="0"
                y="0"
                width="32"
                height="29.6"
                preserveAspectRatio="xMidYMid slice"
                clipPath="url(#heartClip)"
              />

              {/* pink overlay that fades away to reveal the photo */}
              <motion.rect
                x="0"
                y="0"
                width="32"
                height="29.6"
                clipPath="url(#heartClip)"
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut", delay: 0.15 }}
                fill="rgba(244,63,94,0.92)"
              />

              {/* subtle shine on top (optional) */}
              <motion.rect
                x="0"
                y="0"
                width="32"
                height="29.6"
                clipPath="url(#heartClip)"
                initial={{ opacity: 0.35 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.05 }}
                fill="rgba(255,255,255,0.30)"
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ValentineWeekSurpriseApp() {
  const VALENTINE_HEART_IMAGES = [
    "images/f1.jpeg",
    "images/f2.jpeg",
    "images/f3.jpeg",
    "images/f4.jpeg",
    "images/f5.jpeg",
    "images/f6.jpeg",
    "images/f7.jpeg",
    "images/f8.jpeg",
  ].filter(Boolean);

  const [heartShow, setHeartShow] = useState(false);

  // Personalize these
  const HER_NAME = "My Love"; // <- change
  const YOUR_NAME = "Yours"; // <- change

  const STEPS = useMemo(
    () => [
      {
        key: "rose",
        dayLabel: "Rose Day",
        dateLabel: "7 Feb",
        accent: "rose",
        title: "A rose for the way you make my life bloom 🌹",
        metaphor:
          "Like a rose, you’re soft and strong at the same time — and you make ordinary days feel special. You are the rose of my life and i will always protect you my love.",
        photos: [
          // Replace these with her photos (3 to 6)
          "images/rose1.jpeg",
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
          "images/rose2.jpeg",
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
          "images/rose3.jpeg",
          "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=900&q=80",
        ].filter(Boolean),
      },
      {
        key: "propose",
        dayLabel: "Propose Day",
        dateLabel: "8 Feb",
        accent: "pink",
        title: "I propose you — again and again 💍",
        metaphor:
          "If love were a decision, I’d still pick you every time. Today is my little way of saying: I’m proud of us, and I want more of you in my tomorrows.",
        photos: [
          "https://plus.unsplash.com/premium_photo-1674068279574-92b0a56e660e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "images/propose1.jpeg",
          "https://plus.unsplash.com/premium_photo-1674068279574-92b0a56e660e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "images/propose2.jpeg",
          "https://plus.unsplash.com/premium_photo-1674068279574-92b0a56e660e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "images/propose3.jpeg",
        ].filter(Boolean),
      },
      {
        key: "chocolate",
        dayLabel: "Chocolate Day",
        dateLabel: "9 Feb",
        accent: "fuchsia",
        title: "Sweet like you 🍫",
        metaphor:
          "Chocolate is sweet… but somehow you’re the sweetest. You turn stress into calm and silence into comfort. Here’s to the tiny moments that taste better because you.",
        photos: [
          "images/choco1.jpeg",
          "https://images.unsplash.com/photo-1582176604856-e824b4736522?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "images/choco2.jpeg",
          "https://images.unsplash.com/photo-1582176604856-e824b4736522?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          "images/choco3.jpeg",
          "https://images.unsplash.com/photo-1582176604856-e824b4736522?q=80&w=686&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        ].filter(Boolean),
      },
      {
        key: "teddy",
        dayLabel: "Teddy Day",
        dateLabel: "10 Feb",
        accent: "rose",
        title: "You’re My Safe Place in a Loud World 🧸",
        metaphor:
          "A teddy is for warm hugs on days you feel small. But for me… you’re the comfort. When you’re around, everything feels softer and lighter.",
        photos: [
          "https://imgs.search.brave.com/dSK_B-zjrx050JEmgywn6WgCZscoGoqjBwOww0V-ZJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFMMGthVVV5Z0wu/anBn",
          "images/teddy3.jpeg",
          "https://imgs.search.brave.com/dSK_B-zjrx050JEmgywn6WgCZscoGoqjBwOww0V-ZJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFMMGthVVV5Z0wu/anBn",
          "images/teddy2.jpeg",
          "https://imgs.search.brave.com/dSK_B-zjrx050JEmgywn6WgCZscoGoqjBwOww0V-ZJM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFMMGthVVV5Z0wu/anBn",
          "images/teddy1.jpeg",
        ].filter(Boolean),
      },
      {
        key: "promise",
        dayLabel: "Promise Day",
        dateLabel: "11 Feb",
        accent: "pink",
        title: "My promise is simple: for you and with you always 💗",
        metaphor:
          "I promise to listen, to grow, to try — and to love you in the small everyday ways, not just the big romantic moments.",
        photos: [
          "images/promise1.jpeg",
          "https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG92ZXxlbnwwfHwwfHx8MA%3D%3D",
          "images/promise2.jpeg",
          "https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG92ZXxlbnwwfHwwfHx8MA%3D%3D",
          "images/promise3.jpeg",
          "https://images.unsplash.com/reserve/Af0sF2OS5S5gatqrKzVP_Silhoutte.jpg?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG92ZXxlbnwwfHwwfHx8MA%3D%3D",
        ].filter(Boolean),
      },
      {
        key: "hug",
        dayLabel: "Hug Day",
        dateLabel: "12 Feb",
        accent: "fuchsia",
        title: "A hug that says everything 🤗",
        metaphor:
          "Some things don’t need words. If this page could hug you, it would. Until then — imagine I’m holding you close, telling you ‘I’m here.’ and confessing that i love you so much.",
        photos: [
          "https://imgs.search.brave.com/DLry5cWTp36HXRl7WtUpD5biw8zJoerl2khgPSKmDE8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTI3LzA3Ni9zbWFs/bC9haS1nZW5lcmF0/ZWQtdHdvLWNhdHMt/c251Z2dsaW5nLXRv/Z2V0aGVyLXR3by1h/ZG9yYWJsZS1raXR0/ZW5zLXNsZWVwaW5n/LXRvZ2V0aGVyLWNs/b3NlLXVwLWdlbmVy/YXRpdmUtYWktcGhv/dG8uanBn",
          "images/hug1.jpeg",
          "https://imgs.search.brave.com/DLry5cWTp36HXRl7WtUpD5biw8zJoerl2khgPSKmDE8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTI3LzA3Ni9zbWFs/bC9haS1nZW5lcmF0/ZWQtdHdvLWNhdHMt/c251Z2dsaW5nLXRv/Z2V0aGVyLXR3by1h/ZG9yYWJsZS1raXR0/ZW5zLXNsZWVwaW5n/LXRvZ2V0aGVyLWNs/b3NlLXVwLWdlbmVy/YXRpdmUtYWktcGhv/dG8uanBn",
          "images/hug2.jpeg",
          "https://imgs.search.brave.com/DLry5cWTp36HXRl7WtUpD5biw8zJoerl2khgPSKmDE8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTI3LzA3Ni9zbWFs/bC9haS1nZW5lcmF0/ZWQtdHdvLWNhdHMt/c251Z2dsaW5nLXRv/Z2V0aGVyLXR3by1h/ZG9yYWJsZS1raXR0/ZW5zLXNsZWVwaW5n/LXRvZ2V0aGVyLWNs/b3NlLXVwLWdlbmVy/YXRpdmUtYWktcGhv/dG8uanBn",
          "images/hug3.jpeg",
        ].filter(Boolean),
      },
      {
        key: "kiss",
        dayLabel: "Kiss Day",
        dateLabel: "13 Feb",
        accent: "rose",
        title: "A kiss — for all the times you made me smile 😘",
        metaphor:
          "If i could kiss you through this page, then i would. From the first kiss to the last, every kiss will be have a special place in my heart with a deep meaning and feeling.",
        photos: [
          "images/kiss1.jpeg",
          "https://imgs.search.brave.com/fYWae5EClPrRSbQnqwMhS2uNeSqQMycAKoIlImUcQl4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzEv/NzU5LzA2Mi9zbWFs/bC90d28tYWRvcmFi/bGUtY2F0LWZyaWVu/ZHMtc2hvdy1hZmZl/Y3Rpb24tYW5kLWxv/dmUtd2hpbGUtY3Vk/ZGxpbmctYW5kLWdy/b29taW5nLWVhY2gt/b3RoZXItY3V0ZS1n/aW5nZXItYW5kLXRh/YmJ5LWtpdHRlbi1w/YWlyLXJlbGF4LXRv/Z2V0aGVyLW9uLXNv/ZnQtY2F0LXRyZWUt/aW5kb29yLXBob3Rv/LmpwZWc",
          "images/kiss2.jpeg",
          "https://imgs.search.brave.com/fYWae5EClPrRSbQnqwMhS2uNeSqQMycAKoIlImUcQl4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzEv/NzU5LzA2Mi9zbWFs/bC90d28tYWRvcmFi/bGUtY2F0LWZyaWVu/ZHMtc2hvdy1hZmZl/Y3Rpb24tYW5kLWxv/dmUtd2hpbGUtY3Vk/ZGxpbmctYW5kLWdy/b29taW5nLWVhY2gt/b3RoZXItY3V0ZS1n/aW5nZXItYW5kLXRh/YmJ5LWtpdHRlbi1w/YWlyLXJlbGF4LXRv/Z2V0aGVyLW9uLXNv/ZnQtY2F0LXRyZWUt/aW5kb29yLXBob3Rv/LmpwZWc",
          "images/kiss3.jpeg",
          "https://imgs.search.brave.com/fYWae5EClPrRSbQnqwMhS2uNeSqQMycAKoIlImUcQl4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNzEv/NzU5LzA2Mi9zbWFs/bC90d28tYWRvcmFi/bGUtY2F0LWZyaWVu/ZHMtc2hvdy1hZmZl/Y3Rpb24tYW5kLWxv/dmUtd2hpbGUtY3Vk/ZGxpbmctYW5kLWdy/b29taW5nLWVhY2gt/b3RoZXItY3V0ZS1n/aW5nZXItYW5kLXRh/YmJ5LWtpdHRlbi1w/YWlyLXJlbGF4LXRv/Z2V0aGVyLW9uLXNv/ZnQtY2F0LXRyZWUt/aW5kb29yLXBob3Rv/LmpwZWc",
        ].filter(Boolean),
      },
      {
        key: "valentine",
        dayLabel: "Valentine’s Day",
        dateLabel: "14 Feb",
        accent: "pink",
        title: "Okay… one last question 💞",
        metaphor:
          "I built this little web page because you deserve effort, not just words. And because I want you to feel how important you are to me — in every phase, every day.",
        photos: [
          "https://imgs.search.brave.com/F5tbbvaqYJSGfRLEfuP7VzG0hAnerZ7wJ3M1B5V6su4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTc4LzE1NC9zbWFs/bC9haS1nZW5lcmF0/ZWQtcmVkLWhlYXJ0/LW9uLWEtcGluay1i/YWNrZ3JvdW5kLXZh/bGVudGluZS1zLWRh/eS1waG90by5qcGc",
          "images/v1.jpeg",
          "https://imgs.search.brave.com/F5tbbvaqYJSGfRLEfuP7VzG0hAnerZ7wJ3M1B5V6su4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTc4LzE1NC9zbWFs/bC9haS1nZW5lcmF0/ZWQtcmVkLWhlYXJ0/LW9uLWEtcGluay1i/YWNrZ3JvdW5kLXZh/bGVudGluZS1zLWRh/eS1waG90by5qcGc",
          "images/v3.jpeg",
          "https://imgs.search.brave.com/F5tbbvaqYJSGfRLEfuP7VzG0hAnerZ7wJ3M1B5V6su4/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wMzcv/OTc4LzE1NC9zbWFs/bC9haS1nZW5lcmF0/ZWQtcmVkLWhlYXJ0/LW9uLWEtcGluay1i/YWNrZ3JvdW5kLXZh/bGVudGluZS1zLWRh/eS1waG90by5qcGc",
          "images/v4.jpeg",
        ].filter(Boolean),
      },
    ],
    [],
  );

  const [idx, setIdx] = useState(0);
  const step = STEPS[idx];

  // soft parallax cursor glow
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 18, mass: 0.6 });

  // Valentine question interaction
  const [answer, setAnswer] = useState(null); // 'yes' | 'no' | null
  const [celebrate, setCelebrate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const noBtnRef = useRef(null);
  const cardRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      mx.set((x - 0.5) * 40);
      my.set((y - 0.5) * 40);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  useEffect(() => {
    // reset valentine interaction when leaving the last step
    if (step.key !== "valentine") {
      setAnswer(null);
      setCelebrate(false);
      setShowModal(false);
    }
  }, [step.key]);

  const onNoHover = () => {
    if (step.key !== "valentine") return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();

    // keep inside card bounds
    const pad = 14;
    const maxX = rect.width - 140; // approx button width
    const maxY = rect.height - 90; // approx button height

    const x = clamp(Math.random() * maxX, pad, maxX - pad);
    const y = clamp(Math.random() * maxY, pad, maxY - pad);

    setNoPos({ x, y });
  };

  const goNext = () => setIdx((p) => Math.min(STEPS.length - 1, p + 1));
  const goPrev = () => setIdx((p) => Math.max(0, p - 1));

  return (
    <div className="relative min-h-screen pb-24">
      <HeartBackground />

      {/* cursor glow */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-300/30 blur-3xl"
        style={{ x: sx, y: sy }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-6xl px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          className="mx-auto mb-6 max-w-3xl text-center"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-xs font-semibold text-rose-700 shadow-sm backdrop-blur-md"
            whileHover={{ scale: 1.02 }}
          >
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>Valentine Week • A little surprise for {HER_NAME}</span>
          </motion.div>

          <motion.h1
            className="mt-4 bg-gradient-to-r from-rose-600 via-pink-600 to-fuchsia-600 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent md:text-5xl"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: "easeOut" }}
          >
            7 Days, 7 Reasons — For My Love
          </motion.h1>
        </motion.div>

        {/* Main Card */}
        <div className="relative mx-auto max-w-5xl">
          <CelebrationOverlay show={celebrate} />
          <HeartRevealOverlay
            show={heartShow}
            images={VALENTINE_HEART_IMAGES}
          />
          <YesHeartBurst show={answer === "yes"} />

          <motion.div
            ref={cardRef}
            className="relative overflow-hidden rounded-[2rem] bg-white/55 p-5 shadow-2xl shadow-rose-100 backdrop-blur-xl md:p-8"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            {/* animated border glow */}
            <motion.div
              className="pointer-events-none absolute -inset-[2px] rounded-[2rem]"
              animate={{
                background: [
                  "linear-gradient(90deg, rgba(244,63,94,0.25), rgba(236,72,153,0.25), rgba(217,70,239,0.25))",
                  "linear-gradient(90deg, rgba(217,70,239,0.25), rgba(244,63,94,0.25), rgba(236,72,153,0.25))",
                  "linear-gradient(90deg, rgba(236,72,153,0.25), rgba(217,70,239,0.25), rgba(244,63,94,0.25))",
                ],
              }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "blur(10px)" }}
            />

            <div className="relative grid grid-cols-2 items-start gap-6 md:grid-cols-12 md:gap-8">
              {/* Left: text */}
              <div className="md:col-span-6">
                <motion.div
                  className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-1.5 text-xs font-bold text-rose-700"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  <span>{step.dayLabel}</span>
                  <span className="text-rose-400">•</span>
                  <span>{step.dateLabel}</span>
                </motion.div>

                <motion.h2
                  className="mt-4 text-2xl font-extrabold tracking-tight text-rose-900 md:text-3xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: "easeOut" }}
                >
                  {step.title}
                </motion.h2>

                <SparkleLine />

                <motion.p
                  className="flex items-start gap-2 text-sm leading-relaxed text-rose-900/75 md:text-base"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
                >
                  {/* Heart Icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-[2px] h-4 w-4 shrink-0 fill-rose-500"
                  >
                    <path d="M12 21s-7.2-4.6-9.7-8.7C.7 9.3 2.2 5.8 5.6 5.1c1.8-.4 3.5.3 4.5 1.6 1-1.3 2.7-2 4.5-1.6 3.4.7 4.9 4.2 3.3 7.2C19.2 16.4 12 21 12 21Z" />
                  </svg>

                  {step.metaphor}
                </motion.p>

                {/* signature */}
                <motion.div
                  className="mt-6 inline-flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 shadow-sm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
                >
                  <motion.div
                    className="flex h-10 w-10 items-center justify-center"
                    animate={{
                      scale: [1, 1.1, 1],
                      filter: [
                        "drop-shadow(0 0 4px rgba(244,63,94,0.4))",
                        "drop-shadow(0 0 14px rgba(244,63,94,0.8))",
                        "drop-shadow(0 0 4px rgba(244,63,94,0.4))",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      viewBox="0 0 32 29.6"
                      className="h-7 w-7 fill-rose-500"
                    >
                      <path
                        d="M23.6,0c-3.4,0-6.4,2.1-7.6,5.2C14.8,2.1,11.8,0,8.4,0
      C3.8,0,0,3.8,0,8.4c0,9.1,16,21.2,16,21.2s16-12.1,16-21.2
      C32,3.8,28.2,0,23.6,0z"
                      />
                    </svg>
                  </motion.div>

                  <div className="text-left">
                    <div className="text-xs font-bold text-rose-900">
                      Made with love
                    </div>
                    <div className="text-xs text-rose-900/70">— Promise</div>
                  </div>
                </motion.div>

                {/* Valentine question */}
                <AnimatePresence>
                  {step.key === "valentine" && (
                    <motion.div
                      className="relative mt-8 overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50/80 via-pink-50/80 to-fuchsia-50/80 p-7 shadow-lg"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                    >
                      <motion.h3
                        className="text-center text-2xl font-extrabold text-rose-900 md:text-3xl"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                      >
                        So...Will you be my Valentine? 💘
                      </motion.h3>

                      <motion.p
                        className="mt-3 text-center text-sm text-rose-900/70 md:text-base"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.45,
                          delay: 0.05,
                          ease: "easeOut",
                        }}
                      >
                        I’m asking with all my heart. (And a tiny bit of code
                        😄)
                      </motion.p>

                      <div className="relative mt-6 flex min-h-[72px] flex-wrap items-center justify-center gap-4">
                        <motion.button
                          onClick={() => {
                            setAnswer("yes");

                            // Flowers (2 seconds)
                            setCelebrate(true);
                            window.setTimeout(() => setCelebrate(false), 2000);

                            // Heart (30 seconds)
                            setHeartShow(true);
                            window.setTimeout(() => setHeartShow(false), 40000);
                          }}
                          className="relative cursor-pointer rounded-2xl bg-rose-600 px-6 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-rose-200 md:text-base"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          animate={
                            answer === "yes" ? { scale: [1, 1.06, 1] } : {}
                          }
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                          Yes 💖
                        </motion.button>

                        <motion.button
                          ref={noBtnRef}
                          onMouseEnter={onNoHover}
                          onClick={() => setAnswer("no")}
                          className="cursor-pointer rounded-2xl bg-white/80 px-6 py-3.5 text-sm font-extrabold text-rose-700 shadow-sm md:text-base"
                          style={{
                            position: "absolute",
                            left: noPos.x,
                            top: noPos.y,
                          }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          No 🙈
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {answer === "yes" && (
                          <motion.div
                            className="mt-5 rounded-2xl bg-white/70 p-4 text-rose-900 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                          >
                            <div className="text-sm font-extrabold">
                              Yayyy! 💞
                            </div>
                            <div className="mt-1 text-sm text-rose-900/75">
                              You just made my whole universe brighter. Happy
                              Valentine’s Day, {HER_NAME}.
                            </div>
                          </motion.div>
                        )}
                        {answer === "no" && (
                          <motion.div
                            className="mt-5 rounded-2xl bg-white/70 p-4 text-rose-900 shadow-sm"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 0.35, ease: "easeOut" }}
                          >
                            <div className="text-sm font-extrabold">
                              Hehe 😅
                            </div>
                            <div className="mt-1 text-sm text-rose-900/75">
                              Okay — even if you say no, I still choose you.
                              (But can I try again with a hug? 🤗)
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right: photo grid */}
              <div className="md:col-span-6">
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <PhotoGrid photos={step.photos} accent={step.accent} />
                </motion.div>
              </div>
            </div>

            {/* Footer nav */}
            <motion.div
              className="mt-7 flex flex-col items-center justify-between gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1, ease: "easeOut" }}
            >
              <div className="text-xs font-semibold text-rose-900/60">
                Step {idx + 1} / {STEPS.length}
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={goPrev}
                  disabled={idx === 0}
                  className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-bold shadow-sm transition-all $
                    ${idx === 0 ? "bg-white/40 text-rose-300" : "bg-white/75 text-rose-700 hover:bg-white/90"}`}
                  whileHover={idx === 0 ? {} : { scale: 1.02 }}
                  whileTap={idx === 0 ? {} : { scale: 0.98 }}
                >
                  ← Back
                </motion.button>

                <motion.button
                  onClick={goNext}
                  disabled={idx === STEPS.length - 1}
                  className={`cursor-pointer rounded-2xl px-4 py-2 text-sm font-bold shadow-lg shadow-rose-200 transition-all $
                    ${
                      idx === STEPS.length - 1
                        ? "bg-white/40 text-rose-300"
                        : "bg-rose-600 text-white hover:brightness-110"
                    }`}
                  whileHover={idx === STEPS.length - 1 ? {} : { scale: 1.02 }}
                  whileTap={idx === STEPS.length - 1 ? {} : { scale: 0.98 }}
                >
                  Next →
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      <AudioBar src={AUDIO_SRC} />
    </div>
  );
}
