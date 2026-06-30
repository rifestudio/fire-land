import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RevealText from "./RevealText";
import { prefersReducedMotion } from "../lib/motion";
import "./about.css";

const STACK = [
  "JavaScript",
  "Python",
  "React",
  "Next.js",
  "Django",
  "FastAPI",
  "GSAP",
  "Framer Motion",
  "Three.js",
  "PostgreSQL",
];
export default function About() {
  const root = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".about__stack li", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".about__stack", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" className="section section--light about" ref={root}>
      <div className="shell about__grid">
        <div className="about__lead">
          <div className="section-eyebrow mark">
            <span className="ignite" aria-hidden="true">
              &gt;&gt;&gt;
            </span>
            <span className="idx">about</span>
          </div>
          <RevealText
            as="h2"
            className="about__manifesto display"
            text="I make small things move like they matter."
            stagger={0.06}
          />
        </div>

        <div className="about__body">
          <p className="about__p">
            I&apos;m <strong>effect</strong>. I build{" "}
            <strong>
              <span className="firetext">full sites</span>
            </strong>{" "}
            end to end,{" "}
            <strong>
              <span className="firetext">Telegram bots</span>
            </strong>
            , and{" "}
            <strong>
              <span className="firetext">Mini Apps</span>
            </strong>
            .
          </p>
          <p className="about__p">
            My rule is restraint. Most of the screen stays quiet so the one
            moment that moves actually lands. Less surface, more feeling.
          </p>

          <div className="about__stack-wrap">
            <span className="about__stack-label mark">tools I reach for</span>
            <ul className="about__stack">
              {STACK.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
