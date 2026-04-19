import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap } from "gsap";
import { NameModel } from "../NameModel";
import { initialSkills, skillLabels } from "../../data/portfolioData";
import styles from "./AboutSection.module.css";

export const AboutSection = React.memo(function AboutSection({
  useConservativeWebglMode,
  attachWebglRecovery,
}) {
  const aboutSectionRef = React.useRef(null);
  const skillFillRefs = React.useRef({});
  const [nameCanvasKey, setNameCanvasKey] = React.useState(0);
  const [isNameContainerHeld, setIsNameContainerHeld] = React.useState(false);

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

        Object.entries(initialSkills).forEach(([key, value], index) => {
          const fill = skillFillRefs.current[key];
          if (!fill) {
            return;
          }

          gsap.fromTo(
            fill,
            { width: "0%" },
            {
              width: `${value}%`,
              duration: 0.85,
              ease: "power3.out",
              delay: 0.12 + index * 0.06,
            },
          );
        });

        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(aboutSectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNameCanvasCreated = React.useCallback(
    ({ gl }) => {
      attachWebglRecovery(gl?.domElement, () => {
        setNameCanvasKey((prev) => prev + 1);
      });
    },
    [attachWebglRecovery],
  );

  const handleNameCanvasPointerDown = React.useCallback((event) => {
    setIsNameContainerHeld(true);

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }, []);

  const handleNameCanvasPointerUp = React.useCallback((event) => {
    setIsNameContainerHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        return;
      }
    }
  }, []);

  const handleNameCanvasPointerCancel = React.useCallback((event) => {
    setIsNameContainerHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        return;
      }
    }
  }, []);

  return (
    <section id="about" ref={aboutSectionRef} className={`about-inline ${styles.about}`}>
      <div className="about-card">
        <p className="about-kicker about-animate">About Me</p>
        <div
          className="about-name-canvas about-animate"
          onPointerDown={handleNameCanvasPointerDown}
          onPointerUp={handleNameCanvasPointerUp}
          onPointerCancel={handleNameCanvasPointerCancel}
          onPointerLeave={handleNameCanvasPointerCancel}
        >
          <Canvas
            key={nameCanvasKey}
            camera={{ position: [0, 0, 5], fov: 45 }}
            dpr={useConservativeWebglMode ? [0.75, 1] : [1, 1.75]}
            gl={{
              antialias: !useConservativeWebglMode,
              powerPreference: useConservativeWebglMode ? "low-power" : "high-performance",
              stencil: false,
            }}
            performance={{ min: useConservativeWebglMode ? 0.4 : 0.6 }}
            onCreated={handleNameCanvasCreated}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[2, 2, 4]} intensity={1.1} />
            <Suspense fallback={null}>
              <NameModel
                position={[-4.8, -0.5, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={1.8}
                mobileHoldActive={isNameContainerHeld}
              />
            </Suspense>
          </Canvas>
        </div>

        <p className="about-text about-animate">
          I am Nitin Baranwal, a 19-year-old developer and student currently
          pursuing my Computer Science degree. I enjoy building clean,
          interactive web experiences and combining design with logic to make
          products that feel alive.
        </p>

        <div id="skill-ratings" className="skills-panel about-animate">
          <h3 className="skills-title">Skill Ratings</h3>
          {Object.keys(initialSkills).map((skillKey) => (
            <div key={skillKey} className="skill-item">
              <div className="skill-header">
                <span className="skill-name">{skillLabels[skillKey]}</span>
                <span className="skill-value">{initialSkills[skillKey]}%</span>
              </div>

              <div className="skill-track">
                <div
                  ref={(element) => {
                    skillFillRefs.current[skillKey] = element;
                  }}
                  className="skill-fill"
                  style={{ width: "0%" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
