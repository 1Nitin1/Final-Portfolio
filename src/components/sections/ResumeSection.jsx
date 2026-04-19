import React from "react";
import { resumeDownloadUrl, resumeViewUrl } from "../../data/portfolioData";
import styles from "./ResumeSection.module.css";

export const ResumeSection = React.memo(function ResumeSection() {
  const [showResumeEmailForm, setShowResumeEmailForm] = React.useState(false);
  const [isResumeEmailSubmitting, setIsResumeEmailSubmitting] = React.useState(false);
  const [resumeEmailStatus, setResumeEmailStatus] = React.useState("idle");
  const [resumeEmailMessage, setResumeEmailMessage] = React.useState("");

  const handleResumeEmailToggle = React.useCallback(() => {
    setShowResumeEmailForm((prev) => !prev);
    setResumeEmailStatus("idle");
    setResumeEmailMessage("");
  }, []);

  const handleResumeEmailSubmit = React.useCallback(async (event) => {
    event.preventDefault();

    if (isResumeEmailSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = (formData.get("resumeEmail") || "").toString().trim();

    if (!email) {
      setResumeEmailStatus("error");
      setResumeEmailMessage("Please enter your email address.");
      return;
    }

    setIsResumeEmailSubmitting(true);
    setResumeEmailStatus("idle");
    setResumeEmailMessage("");

    try {
      const response = await fetch("/api/resume-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to email the resume right now.");
      }

      setResumeEmailStatus("success");
      setResumeEmailMessage(payload?.message || "Resume has been sent to your email.");
      form.reset();
    } catch (error) {
      setResumeEmailStatus("error");
      setResumeEmailMessage(
        error instanceof Error
          ? error.message
          : "Unable to email the resume right now.",
      );
    } finally {
      setIsResumeEmailSubmitting(false);
    }
  }, [isResumeEmailSubmitting]);

  return (
    <section id="resume" className={`resume-section ${styles.section}`}>
      <div className="resume-shell">
        <p className="resume-kicker">Career Snapshot</p>
        <h2 className="resume-title">Resume</h2>
        <p className="resume-subtitle">
          View my latest resume online or download a copy directly.
        </p>

        <div className="resume-actions">
          <a href={resumeViewUrl} target="_blank" rel="noreferrer" className="resume-btn">
            View
          </a>
          <a
            href={resumeDownloadUrl}
            target="_blank"
            rel="noreferrer"
            className="resume-btn resume-btn-secondary"
          >
            Download
          </a>
          <button
            type="button"
            className="resume-btn resume-btn-secondary"
            onClick={handleResumeEmailToggle}
          >
            Get Emailed
          </button>
        </div>

        {showResumeEmailForm ? (
          <form className="resume-email-form" onSubmit={handleResumeEmailSubmit}>
            <label className="resume-email-label" htmlFor="resumeEmail">
              Enter your email
            </label>
            <input
              id="resumeEmail"
              name="resumeEmail"
              type="email"
              className="resume-email-input"
              placeholder="name@company.com"
              required
            />
            <button
              type="submit"
              className="resume-email-submit"
              disabled={isResumeEmailSubmitting}
            >
              {isResumeEmailSubmitting ? "Sending..." : "Submit"}
            </button>

            {resumeEmailMessage ? (
              <p
                className={`resume-email-feedback ${resumeEmailStatus === "success" ? "success" : "error"}`}
                role="status"
                aria-live="polite"
              >
                {resumeEmailMessage}
              </p>
            ) : null}
          </form>
        ) : null}
      </div>
    </section>
  );
});
