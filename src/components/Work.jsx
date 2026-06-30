import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";
import { prefersReducedMotion } from "../lib/motion";
import "./work.css";

import qwins from "../assets/images/qwins.png";
import hash from "../assets/images/Hash.png";
import hashix from "../assets/images/hashix.png";
import cs from "../assets/images/cs.png";

import qwins_video from "../assets/videos/qwins.mp4";

// To use a looped video for a case, import it here and set `video` on the
// project below instead of `image`, e.g.:
//   import emberClip from "../assets/videos/ember.mp4";
//   { ...,  video: emberClip }
// The video autoplays muted, loops, and gets the same parallax + hover as images.

const PROJECTS = [
  {
    n: "01",
    title: "Hashix",
    role: "Full-stack build",
    year: "2025",
    blurb:
      "A mining-ops platform where the machine feels alive — every payout, breakdown, and repair reads as motion, not noise.",
    tags: ["React", "Django", "POSTGRES"],
    visual: "v-ember",
    image: hashix,
  },
  {
    n: "02",
    title: "Qwins",
    role: "Frontend",
    year: "2024",
    blurb:
      "A hosting-provider site built for pixel-precision — instant page transitions, theme and language that flip without a flicker.",
    tags: ["Next.js", "Tailwind", "Framer Motion"],
    visual: "v-kiln",

    video: qwins_video,
  },
  {
    n: "03",
    title: "HashProfit",
    role: "Full-stack build",
    year: "2025",
    blurb:
      "A marketplace for reselling hash keys, with a payment layer built from raw blockchain primitives — every transaction handled by hand, no off-the-shelf rails.",
    tags: ["Web3", "React", "Django"],
    visual: "v-vesta",
    image: hash,
  },
  {
    n: "04",
    title: "CSBAZAAR",
    role: "Frontend",
    year: "2024",
    blurb:
      "A CS2 trading platform — front-end built from zero, with non-standard Telegram auth and a backend we ended up rescuing along the way.",
    tags: ["React", "Recharts", "TypeScript"],
    visual: "v-halcyon",
    image: cs,
  },
];

export default function Work() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray(".work-card").forEach((card, i) => {
        gsap.from(card, {
          y: 64,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
        });

        // чётные — вверх, нечётные — вниз. Travel is bounded to the image's
        // overhang (see work.css) so the picture always fills the frame —
        // it starts at one edge and parallaxes to the other, never exposing
        // the empty frame behind it.
        const screen = card.querySelector(".work-card__screen-img");
        // yPercent travel. Element is 126% tall (see work.css), so ±8 moves it
        // ~10% of the frame — just shy of the 13% overhang, so the picture
        // parallaxes nearly edge-to-edge (starts close to its own border)
        // while keeping a small safety margin so the frame border never shows.
        const range = 8;
        const from = i % 2 === 0 ? range : -range;
        gsap.fromTo(
          screen,
          { yPercent: from },
          {
            yPercent: -from,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              start: "top bottom",
              end: "bottom top",
              // numeric scrub lerps the parallax toward its target every frame
              // instead of snapping to each scroll event — smooth on iOS, where
              // touch scroll isn't Lenis-smoothed and fires events in coarse steps
              scrub: 0.6,
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="work" className="section section--light work" ref={root}>
      <div className="shell">
        <div className="section-eyebrow mark">
          <span className="ignite" aria-hidden="true">
            &gt;&gt;&gt;
          </span>
          <span className="idx">selected work — 04</span>
        </div>
        <RevealText
          as="h2"
          className="work__title display"
          text="Things I lit up"
        />
      </div>

      <ul className="work__list shell">
        {PROJECTS.map((p) => (
          <li className="work-card" key={p.n} data-hot>
            <a
              className="work-card__link"
              href="#contact"
              aria-label={`${p.title} — ${p.role}, ${p.year}`}
            >
              <div className="work-card__screen">
                {p.video ? (
                  <>
                    <video
                      className="work-card__screen-img"
                      src={p.video}
                      poster={p.image}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
                    />
                    {/* desaturates the video via a blend overlay so the
                        grayscale→colour hover animates opacity (cheap) instead
                        of a per-frame filter on the video (which stalls it) */}
                    <span className="work-card__desat" aria-hidden="true" />
                  </>
                ) : (
                  <div
                    className="work-card__screen-img"
                    style={{
                      backgroundImage: `url(${p.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                    aria-hidden="true"
                  />
                )}
                <span className="work-card__glow" aria-hidden="true" />
              </div>

              <div className="work-card__meta">
                <span className="work-card__n mark">{p.n}</span>
                <h3 className="work-card__title display">
                  {p.title}
                  <span className="work-card__arrow ignite" aria-hidden="true">
                    &gt;&gt;&gt;
                  </span>
                </h3>
                <p className="work-card__blurb">{p.blurb}</p>
                <div className="work-card__foot">
                  <span className="work-card__role">{p.role}</span>
                  <ul className="work-card__tags">
                    {p.tags.map((t) => (
                      <li key={t} className="mark">
                        {t}
                      </li>
                    ))}
                  </ul>
                  <span className="work-card__year mark">{p.year}</span>
                </div>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
