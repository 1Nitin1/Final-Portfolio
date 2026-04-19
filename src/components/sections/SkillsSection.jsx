import React from "react";
import { SkillModelSlot } from "../skills/SkillModelSlot";
import { skillDomains, growthTimeline } from "../../data/portfolioData";
import styles from "./SkillsSection.module.css";

export const SkillsSection = React.memo(function SkillsSection({
  useConservativeWebglMode,
  showGrowthTimeline,
  onToggleGrowthTimeline,
}) {
  return (
    <section id="skills" className={`skills-domain-section ${styles.section}`}>
      <div className="skills-domain-shell">
        <p className="skills-domain-kicker">Core Domains</p>
        <h2 className="skills-domain-title">Skills & Expertise</h2>

        {skillDomains.map((domain) => (
          <article key={domain.id} className="domain-block">
            <div className="domain-block-head">
              <h3 className="domain-block-title">{domain.title}</h3>
              <p className="domain-block-summary">{domain.summary}</p>
            </div>

            <div className="domain-card-grid">
              {domain.cards.map((card) => (
                <div key={card.name} className="domain-skill-card">
                  <SkillModelSlot
                    cardName={card.name}
                    lowSpecMode={useConservativeWebglMode}
                  />
                  <h4 className="domain-skill-name">{card.name}</h4>
                  <p className="domain-skill-level">{card.level}</p>
                  <p className="domain-skill-description">{card.description}</p>
                </div>
              ))}
            </div>
          </article>
        ))}

        <div className="growth-cta-wrap">
          <button
            type="button"
            className="growth-cta-btn"
            onClick={onToggleGrowthTimeline}
          >
            {showGrowthTimeline
              ? "Hide Growth & Experience"
              : "Show Growth & Experience"}
          </button>
        </div>

        {showGrowthTimeline ? (
          <section id="experience" className="growth-timeline-panel">
            <h3 className="growth-timeline-title">My Growth Timeline</h3>
            <div className="growth-timeline-track" aria-live="polite">
              {growthTimeline.map((item) => (
                <article
                  key={`${item.date}-${item.title}`}
                  className="growth-timeline-item"
                >
                  <span className="growth-timeline-dot" aria-hidden="true" />
                  <div className="growth-timeline-content">
                    <p className="growth-timeline-date">{item.date}</p>
                    <h4 className="growth-timeline-item-title">{item.title}</h4>
                    <p className="growth-timeline-item-detail">{item.detail}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </section>
  );
});
