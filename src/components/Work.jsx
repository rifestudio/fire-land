import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";
import { prefersReducedMotion } from "../lib/motion";
import "./work.css";

import qwins from "../assets/images/qwins.png";

const PROJECTS = [
  {
    n: "01",
    title: "Ember",
    role: "Design & build",
    year: "2025",
    blurb:
      "A live ops console where every state change reads as motion, not noise.",
    tags: ["React", "WebGL", "GSAP"],
    visual: "v-ember",
    image: qwins,
  },
  {
    n: "02",
    title: "Kiln",
    role: "Frontend lead",
    year: "2024",
    blurb:
      "A type-first publishing tool. The editor disappears; the writing glows.",
    tags: ["Next.js", "Lenis", "TypeScript"],
    visual: "v-kiln",
    image: qwins,
  },
  {
    n: "03",
    title: "Vesta",
    role: "Interaction & motion",
    year: "2024",
    blurb:
      "Commerce that feels physical — weight, inertia, and heat on every tap.",
    tags: ["React", "Framer Motion"],
    visual: "v-vesta",
    image: qwins,
  },
  {
    n: "04",
    title: "Halcyon",
    role: "Solo build",
    year: "2023",
    blurb:
      "A calm dashboard for loud data. Stillness first, fire only where it counts.",
    tags: ["Vue", "D3", "Canvas"],
    visual: "v-halcyon",
    image: qwins,
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

        // чётные — вверх, нечётные — вниз
        const screen = card.querySelector(".work-card__screen-img");
        const dir = i % 2 === 0 ? -28 : 28;
        gsap.to(screen, {
          yPercent: dir,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
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
                <div
                  className="work-card__screen-img"
                  style={{
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-hidden="true"
                />
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
