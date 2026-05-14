import React from "react";
import { gsap } from "gsap";
import { profileLinks } from "../../data/portfolioData";
import styles from "./AboutSection.module.css";

const NAME_TEXT = "NITIN BARANWAL";
const NAME_COLORS = ["#f5f0ff", "#ffd6a5", "#95ffc2", "#9cc8ff", "#ffb8d2"];
const BASE_NAME_COLOR = "#f5f0ff";

export const AboutSection = React.memo(function AboutSection() {
  const aboutSectionRef = React.useRef(null);
  const nameLetterRefs = React.useRef([]);

  React.useEffect(() => {
    if (!aboutSectionRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        gsap.fromTo(
          aboutSectionRef.current.querySelectorAll(".about-animate"),
          { y: 26, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
        );
        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(aboutSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const letters = nameLetterRefs.current.filter(Boolean);
    if (!letters.length) {
      return;
    }

    const resetLetters = () => {
      gsap.set(letters, {
        color: BASE_NAME_COLOR,
        y: 0,
        textShadow: "0 0 16px rgba(180, 146, 255, 0.32)",
      });
    };

    const glowPulse = () => {
      resetLetters();
      const picks = Math.min(5, letters.length);
      const shuffled = [...letters].sort(() => Math.random() - 0.5).slice(0, picks);

      shuffled.forEach((target) => {
        const color = NAME_COLORS[Math.floor(Math.random() * NAME_COLORS.length)];
        gsap.to(target, {
          color,
          y: -2,
          textShadow: `0 0 22px ${color}`,
          duration: 0.24,
          ease: "power2.out",
          yoyo: true,
          repeat: 1,
        });
      });
    };

    resetLetters();
    glowPulse();
    const intervalId = window.setInterval(glowPulse, 360);

    return () => {
      window.clearInterval(intervalId);
      gsap.killTweensOf(letters);
    };
  }, []);

  const codingProfiles = React.useMemo(() => {
    const linkById = Object.fromEntries(profileLinks.map((profile) => [profile.id, profile.url]));
    return [
      {
        id: "leetcode",
        name: "LeetCode",
        rank: "Knight",
        rating: "2030",
        accentClass: "leetcode",
        url: linkById.leetcode,
      },
      {
        id: "codechef",
        name: "CodeChef",
        rank: "3 Star",
        rating: "1770 Max",
        accentClass: "codechef",
        url: linkById.codechef,
      },
      {
        id: "codeforces",
        name: "Codeforces",
        rank: "Specialist",
        rating: "1563",
        accentClass: "codeforces",
        url: linkById.codeforces,
      },
    ];
  }, []);

  return (
    <section id="about" ref={aboutSectionRef} className={`about-inline ${styles.about}`}>
      <div className="about-card">
        <p className="about-kicker about-animate">About Me</p>
        <div className="about-name-2d about-animate" aria-label={NAME_TEXT}>
          {Array.from(NAME_TEXT).map((character, index) => (
            <span
              key={`${character}-${index}`}
              className="about-name-letter"
              ref={(element) => {
                if (character !== " ") {
                  nameLetterRefs.current[index] = element;
                }
              }}
            >
              {character === " " ? "\u00A0" : character}
            </span>
          ))}
        </div>

        <p className="about-text about-animate">
          I am Nitin Baranwal, a 19-year-old developer and student currently
          pursuing my Computer Science degree. I enjoy building clean,
          interactive web experiences and combining design with logic to make
          products that feel alive.
        </p>

        <div id="coding-profiles" className="coding-profiles-panel about-animate">
          <div className="coding-profiles-head">
            <h3 className="coding-profiles-title">Coding Profiles</h3>
            <p className="coding-profiles-solved">
              Solved <strong>1500+</strong> problems till date across competitive coding platforms.
            </p>
          </div>

          <div className="coding-profile-grid">
            {codingProfiles.map((profile) => (
              <a
                key={profile.id}
                href={profile.url}
                target="_blank"
                rel="noreferrer"
                className={`coding-profile-card ${profile.accentClass}`}
                aria-label={`Open ${profile.name} profile`}
              >
                <p className="coding-profile-platform">{profile.name}</p>
                <p className="coding-profile-rank">{profile.rank}</p>
                <p className="coding-profile-rating">{profile.rating} rating</p>
              </a>
            ))}
          </div>
          <p className="coding-profiles-note">
            Consistent problem-solving has shaped my approach to writing cleaner logic and faster,
            more reliable code under constraints.
          </p>
        </div>

        <div className="about-achievements-panel about-animate">
          <h3 className="about-achievements-title">Achievements</h3>
          <p className="about-achievement-item">
            Won <strong>1st place</strong> in the hackathon held at DTU named
            <span className="about-achievement-highlight"> "Game up your DSA"</span>.
          </p>
          <p className="about-achievement-item">
            Secured <strong>2nd runner up</strong> in a state-level DSA contest.
          </p>
        </div>
      </div>
    </section>
  );
});
