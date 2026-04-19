import React from "react";
import { projectCards } from "../../data/portfolioData";
import styles from "./ProjectsSection.module.css";

export const ProjectsSection = React.memo(function ProjectsSection() {
  return (
    <section id="projects" className={`projects-section ${styles.section}`}>
      <div className="projects-shell">
        <p className="projects-kicker">Featured Work</p>
        <h2 className="projects-title">Projects</h2>

        <div className="projects-grid">
          {projectCards.map((project) => (
            <article key={project.id} className="project-card">
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
    </section>
  );
});
