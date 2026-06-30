import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import EmberField from "./EmberField";
import RevealText from "./RevealText";
import { prefersReducedMotion } from "../lib/motion";
import "./contact.css";

const TELEGRAM = "https://t.me/effeectt";

export default function Contact() {
  const root = useRef(null);

  // The finale is fixed behind the page and revealed by scrolling to the end,
  // so its content is always "in view" — play the CTA in on mount rather than
  // on a scroll trigger that would never fire correctly for a fixed element.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".contact__cta", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        delay: 0.3,
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Reserve scroll room beneath the page equal to this section's height so it
  // can be fully revealed from underneath.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const setHeight = () =>
      document.documentElement.style.setProperty(
        "--finale-h",
        `${el.offsetHeight}px`,
      );
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Parallax: the section sits with its lower half tucked below the fold and
  // rises into place as the page scrolls off it, so its hidden bottom (footer)
  // surfaces at the very end of the page.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty("--parallax", "0px");
      return;
    }
    const main = document.querySelector("main");
    let raf = 0;
    const update = () => {
      raf = 0;
      const h = window.innerHeight;
      const start = (main?.offsetHeight ?? 0) - h;
      const p = Math.min(1, Math.max(0, (window.scrollY - start) / h));
      el.style.setProperty("--parallax", `${(1 - p) * h * 0.5}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const year = 2026;

  return (
    <section id="contact" className="section section--dark contact" ref={root}>
      <EmberField className="contact__embers" density={40} />
      <div className="contact__glow" aria-hidden="true" />

      <div className="shell contact__inner">
        <div className="section-eyebrow mark">
          <span className="ignite" aria-hidden="true">
            &gt;&gt;&gt;
          </span>
          <span className="idx">contact</span>
        </div>

        <RevealText
          as="h2"
          className="contact__headline display"
          text="Got something worth lighting up?"
          stagger={0.055}
          immediate
        />

        <a
          className="contact__cta"
          href={TELEGRAM}
          target="_blank"
          rel="noreferrer"
          data-hot
        >
          <span className="contact__cta-mark ignite" aria-hidden="true">
            &gt;&gt;&gt;
          </span>
          <span className="contact__cta-text">Message me on Telegram</span>
          <span className="contact__cta-handle">@effeectt</span>
        </a>
      </div>

      <footer className="contact__footer shell">
        <span className="mark">effect · Product Engineer</span>
        <span className="mark contact__footer-tg">
          <a href={TELEGRAM} target="_blank" rel="noreferrer">
            @effeectt
          </a>
        </span>
        <span className="mark">© {year}</span>
      </footer>
    </section>
  );
}
