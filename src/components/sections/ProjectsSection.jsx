import React from "react";
import { projectCards } from "../../data/portfolioData";
import styles from "./ProjectsSection.module.css";

export const ProjectsSection = React.memo(function ProjectsSection() {
  const totalProjects = projectCards.length;
  const [activeProjectIndex, setActiveProjectIndex] = React.useState(1);
  const [isCarouselTransitionEnabled, setIsCarouselTransitionEnabled] = React.useState(true);

  const carouselCards = React.useMemo(() => {
    if (!totalProjects) {
      return [];
    }

    return [
      projectCards[totalProjects - 1],
      ...projectCards,
      projectCards[0],
    ];
  }, [totalProjects]);

  React.useEffect(() => {
    if (totalProjects <= 1) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setActiveProjectIndex((currentIndex) => currentIndex + 1);
    }, 3200);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [totalProjects]);

  const handleCarouselTransitionEnd = React.useCallback(() => {
    if (totalProjects <= 1) {
      return;
    }

    if (activeProjectIndex === totalProjects + 1) {
      setIsCarouselTransitionEnabled(false);
      setActiveProjectIndex(1);
      return;
    }

    if (activeProjectIndex === 0) {
      setIsCarouselTransitionEnabled(false);
      setActiveProjectIndex(totalProjects);
    }
  }, [activeProjectIndex, totalProjects]);

  React.useEffect(() => {
    if (isCarouselTransitionEnabled) {
      return;
    }

    const frameId = window.requestAnimationFrame(() => {
      setIsCarouselTransitionEnabled(true);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isCarouselTransitionEnabled]);

  const activeDotIndex = totalProjects
    ? (activeProjectIndex - 1 + totalProjects) % totalProjects
    : 0;

  return (
    <section id="projects" className={`projects-section ${styles.section}`}>
      <div className="projects-shell">
        <p className="projects-kicker">Featured Work</p>
        <h2 className="projects-title">Projects</h2>

        <div className="projects-carousel-window">
          <div
            onTransitionEnd={handleCarouselTransitionEnd}
            className={`projects-carousel-track ${
              isCarouselTransitionEnabled ? "" : "no-transition"
            }`}
            style={{ transform: `translateX(-${activeProjectIndex * 100}%)` }}
          >
          {carouselCards.map((project, index) => (
            <article key={`${project.id}-${index}`} className="project-card">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="project-image-link"
                aria-label={`Open ${project.title} live project`}
              >
                <img
                  src={project.image}
                  alt={project.imageAlt}
                  className="project-image"
                  loading="lazy"
                />
              </a>

              <h3 className="project-name">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="project-live-link"
              >
                View Live
              </a>
            </article>
          ))}
          </div>
        </div>

        <div className="projects-carousel-dots" aria-label="Project slide indicators">
          {projectCards.map((project, index) => (
            <button
              key={project.id}
              type="button"
              className={`projects-carousel-dot ${activeDotIndex === index ? "active" : ""}`}
              onClick={() => setActiveProjectIndex(index + 1)}
              aria-label={`Show ${project.title}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
});
