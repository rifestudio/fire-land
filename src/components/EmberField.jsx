import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../lib/motion";

/**
 * A canvas of embers drifting upward like sparks off a fire — the warm
 * atmosphere behind the dark grounds. Dosed: few particles, low opacity,
 * additive blending so they read as light, not dots.
 * Reduced motion → a single still warm glow, no animation.
 */
export default function EmberField({ density = 56, className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const reduce = prefersReducedMotion();
    let raf;
    let w;
    let h;
    let dpr;
    let embers = [];
    let running = true;

    const COLORS = ["#ff2d0e", "#ff4d1c", "#ff7a18", "#ffb020"];

    const seed = () => {
      embers = Array.from({ length: density }, () => spawn(true));
    };
    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + Math.random() * 60,
        r: 0.6 + Math.random() * 2.2,
        vy: 0.15 + Math.random() * 0.7,
        vx: (Math.random() - 0.5) * 0.35,
        life: 0,
        maxLife: 260 + Math.random() * 360,
        hue: COLORS[(Math.random() * COLORS.length) | 0],
        flick: Math.random() * Math.PI * 2,
      };
    }

    const applySize = () => {
      const nw = canvas.offsetWidth;
      const nh = canvas.offsetHeight;
      // ignore not-yet-laid-out (0) reads and no-op events (mobile URL bar)
      if (!nw || !nh || (nw === w && nh === h)) return false;
      const prevW = w;
      const prevH = h;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!embers.length) {
        seed();
      } else {
        // a genuine resize: keep embers where they are instead of teleporting
        const sx = w / prevW;
        const sy = h / prevH;
        embers.forEach((e) => {
          e.x *= sx;
          e.y *= sy;
        });
      }
      return true;
    };

    const drawStill = () => {
      ctx.clearRect(0, 0, w, h);
      embers.forEach((e) => paint(e, 0.5));
    };

    function paint(e, alphaScale) {
      // The life term goes <= 0 on the frame an ember dies. Canvas silently
      // ignores an out-of-range globalAlpha, which would leave the previous
      // ember's (often full) alpha in place — a sharp flash just before the
      // ember respawns. Clamp, and skip drawing once fully faded.
      const fade = 1 - e.life / e.maxLife;
      if (fade <= 0) return;
      const a = alphaScale * (0.5 + 0.5 * Math.sin(e.flick)) * fade;
      if (a <= 0) return;
      ctx.globalAlpha = a > 1 ? 1 : a;
      const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
      g.addColorStop(0, e.hue);
      g.addColorStop(1, "rgba(255,77,28,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    const tick = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      embers.forEach((e, i) => {
        e.y -= e.vy;
        e.x += e.vx;
        e.flick += 0.05;
        e.life += 1;
        paint(e, 1);
        if (e.y < -20 || e.life > e.maxLife) embers[i] = spawn(false);
      });
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };

    applySize();

    // Observe the canvas box, not window 'resize': mobile browsers fire resize
    // on every URL-bar show/hide while scrolling, which previously reseeded the
    // whole field and made embers jump around. ResizeObserver only fires on a
    // real box-size change.
    const ro = new ResizeObserver(() => {
      if (applySize() && reduce) drawStill();
    });
    ro.observe(canvas);

    if (reduce) {
      drawStill();
      return () => ro.disconnect();
    }

    // pause when offscreen / tab hidden to save the main thread
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !raf) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
        cancelAnimationFrame(raf);
        raf = null;
      }
    });
    io.observe(canvas);

    return () => {
      ro.disconnect();
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={`ember-field ${className}`}
      aria-hidden="true"
    />
  );
}
