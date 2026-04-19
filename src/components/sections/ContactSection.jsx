import React from "react";
import { gsap } from "gsap";
import styles from "./ContactSection.module.css";

export const ContactSection = React.memo(function ContactSection() {
  const [isContactSubmitting, setIsContactSubmitting] = React.useState(false);
  const [contactSubmitStatus, setContactSubmitStatus] = React.useState("idle");
  const [contactSubmitMessage, setContactSubmitMessage] = React.useState("");

  const contactCardRef = React.useRef(null);
  const sneakyRectRef = React.useRef(null);
  const leftPupilRef = React.useRef(null);
  const rightPupilRef = React.useRef(null);
  const buddyOneRef = React.useRef(null);
  const buddyTwoRef = React.useRef(null);
  const buddyOneLeftPupilRef = React.useRef(null);
  const buddyOneRightPupilRef = React.useRef(null);
  const buddyTwoLeftPupilRef = React.useRef(null);
  const buddyTwoRightPupilRef = React.useRef(null);

  React.useEffect(() => {
    if (!contactCardRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        gsap.fromTo(
          contactCardRef.current.querySelectorAll(".contact-animate"),
          { y: 20, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
        );

        observer.disconnect();
      },
      { threshold: 0.3 },
    );

    observer.observe(contactCardRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const moveSneakyEyesToPoint = React.useCallback((targetX, targetY, isTyping = false) => {
    if (!sneakyRectRef.current || !leftPupilRef.current || !rightPupilRef.current) {
      return;
    }
    const sneakyRect = sneakyRectRef.current.getBoundingClientRect();

    const eyeCenterX = sneakyRect.left + sneakyRect.width / 2;
    const eyeCenterY = sneakyRect.top + sneakyRect.height * 0.2;

    const offsetX = gsap.utils.clamp(-6, 6, (targetX - eyeCenterX) * 0.06);
    const offsetY = gsap.utils.clamp(-5, 5, (targetY - eyeCenterY) * 0.06);

    gsap.to([leftPupilRef.current, rightPupilRef.current], {
      x: offsetX,
      y: offsetY,
      duration: 0.24,
      ease: "power2.out",
    });

    const buddyPupils = [
      buddyOneLeftPupilRef.current,
      buddyOneRightPupilRef.current,
      buddyTwoLeftPupilRef.current,
      buddyTwoRightPupilRef.current,
    ].filter(Boolean);

    if (buddyPupils.length) {
      const buddyOffsetX = gsap.utils.clamp(-2.5, 4.5, offsetX * 0.5 + 1.4);
      const buddyOffsetY = gsap.utils.clamp(-4.5, 2, offsetY * 0.45 - 1.8);

      gsap.to(buddyPupils, {
        x: buddyOffsetX,
        y: buddyOffsetY,
        duration: 0.24,
        ease: "power2.out",
      });
    }

    gsap.to(sneakyRectRef.current, {
      x: isTyping ? -6 : -2,
      rotateZ: isTyping ? -1.2 : -0.4,
      duration: 0.24,
      ease: "power2.out",
    });

    gsap.to([buddyOneRef.current, buddyTwoRef.current], {
      x: isTyping ? -4 : -2,
      duration: 0.24,
      ease: "power2.out",
      stagger: 0.04,
    });
  }, []);

  const moveSneakyEyes = React.useCallback((targetElement, isTyping = false) => {
    if (!targetElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    moveSneakyEyesToPoint(targetCenterX, targetCenterY, isTyping);
  }, [moveSneakyEyesToPoint]);

  const resetBuddyEyes = React.useCallback(() => {
    if (!leftPupilRef.current || !rightPupilRef.current || !sneakyRectRef.current) {
      return;
    }

    gsap.to([leftPupilRef.current, rightPupilRef.current], {
      x: 0,
      y: 0,
      duration: 0.28,
      ease: "power2.out",
    });

    const buddyPupils = [
      buddyOneLeftPupilRef.current,
      buddyOneRightPupilRef.current,
      buddyTwoLeftPupilRef.current,
      buddyTwoRightPupilRef.current,
    ].filter(Boolean);

    if (buddyPupils.length) {
      gsap.to(buddyPupils, {
        x: 0,
        y: 0,
        duration: 0.28,
        ease: "power2.out",
      });
    }

    gsap.to(sneakyRectRef.current, {
      x: 0,
      rotateZ: 0,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to([buddyOneRef.current, buddyTwoRef.current], {
      x: 0,
      duration: 0.28,
      ease: "power2.out",
      stagger: 0.04,
    });
  }, []);

  const handleCardMove = React.useCallback((event) => {
    if (!contactCardRef.current) {
      return;
    }

    const { left, top, width, height } =
      contactCardRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - left) / width - 0.5;
    const offsetY = (event.clientY - top) / height - 0.5;

    gsap.to(contactCardRef.current, {
      rotateY: offsetX * 6,
      rotateX: -offsetY * 6,
      duration: 0.35,
      ease: "power2.out",
      transformPerspective: 900,
      transformOrigin: "center",
    });

    moveSneakyEyesToPoint(event.clientX, event.clientY);
  }, [moveSneakyEyesToPoint]);

  const handleCardLeave = React.useCallback(() => {
    if (!contactCardRef.current) {
      return;
    }

    gsap.to(contactCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.45,
      ease: "power3.out",
    });

    resetBuddyEyes();
  }, [resetBuddyEyes]);

  const handleFieldFocus = React.useCallback((event) => {
    moveSneakyEyes(event.currentTarget);
  }, [moveSneakyEyes]);

  const handleFieldInput = React.useCallback((event) => {
    moveSneakyEyes(event.currentTarget, true);
  }, [moveSneakyEyes]);

  const handleFieldBlur = React.useCallback(() => {
    resetBuddyEyes();
  }, [resetBuddyEyes]);

  const handleContactSubmit = React.useCallback(async (event) => {
    event.preventDefault();

    if (isContactSubmitting) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      setContactSubmitStatus("error");
      setContactSubmitMessage("Please fill out all fields before sending.");
      return;
    }

    setIsContactSubmitting(true);
    setContactSubmitStatus("idle");
    setContactSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send your message right now.");
      }

      setContactSubmitStatus("success");
      setContactSubmitMessage(
        payload?.message ||
          "Message sent successfully. I will get back to you soon.",
      );
      form.reset();
      handleFieldBlur();

      gsap.fromTo(
        ".contact-submit",
        { scale: 1 },
        {
          scale: 1.05,
          yoyo: true,
          repeat: 1,
          duration: 0.12,
          ease: "power1.out",
        },
      );
    } catch (error) {
      setContactSubmitStatus("error");
      setContactSubmitMessage(
        error instanceof Error
          ? error.message
          : "Unable to send your message right now.",
      );
    } finally {
      setIsContactSubmitting(false);
    }
  }, [handleFieldBlur, isContactSubmitting]);

  return (
    <section id="contact" className={`contact-section ${styles.section}`}>
      <div className="contact-layout">
        <div
          ref={contactCardRef}
          className="contact-card"
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
        >
          <p className="contact-kicker contact-animate">Get In Touch</p>
          <h2 className="contact-title contact-animate">
            Open to Roles & Freelance Projects
          </h2>
          <p className="contact-subtitle contact-animate">
            Recruiters, hiring managers, and clients can reach out here for
            full-time roles, internships, or freelance collaborations.
          </p>

          <div className="contact-form-shell contact-animate">
            <div className="buddy-stack" aria-hidden="true">
              <div ref={sneakyRectRef} className="sneaky-rect playful">
                <div className="sneaky-eyes">
                  <span className="sneaky-eye">
                    <span ref={leftPupilRef} className="sneaky-pupil" />
                  </span>
                  <span className="sneaky-eye">
                    <span ref={rightPupilRef} className="sneaky-pupil" />
                  </span>
                </div>
                <span className="sneaky-mouth playful" />
                <span className="buddy-wave" />
              </div>

              <div ref={buddyOneRef} className="buddy-mini buddy-mini-one">
                <span className="buddy-mini-eye">
                  <span ref={buddyOneLeftPupilRef} className="buddy-mini-pupil" />
                </span>
                <span className="buddy-mini-eye">
                  <span ref={buddyOneRightPupilRef} className="buddy-mini-pupil" />
                </span>
                <span className="buddy-mini-smile" />
              </div>

              <div ref={buddyTwoRef} className="buddy-mini buddy-mini-two">
                <span className="buddy-mini-eye">
                  <span ref={buddyTwoLeftPupilRef} className="buddy-mini-pupil" />
                </span>
                <span className="buddy-mini-eye">
                  <span ref={buddyTwoRightPupilRef} className="buddy-mini-pupil" />
                </span>
                <span className="buddy-mini-smile" />
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label className="contact-label" htmlFor="name">
                Your Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="contact-input"
                placeholder="Full name"
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <label className="contact-label" htmlFor="email">
                Work Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="contact-input"
                placeholder="name@company.com"
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <label className="contact-label" htmlFor="message">
                Opportunity Details
              </label>
              <textarea
                id="message"
                name="message"
                className="contact-input contact-textarea"
                placeholder="Role or project scope, timeline, and any key expectations..."
                rows={5}
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <button type="submit" className="contact-submit" disabled={isContactSubmitting}>
                {isContactSubmitting ? "Sending..." : "Send Inquiry"}
              </button>

              {contactSubmitMessage ? (
                <p
                  className={`contact-feedback ${contactSubmitStatus === "success" ? "success" : "error"}`}
                  role="status"
                  aria-live="polite"
                >
                  {contactSubmitMessage}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
});
