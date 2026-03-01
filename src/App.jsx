import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { gsap } from "gsap";
import { Color } from "three";
import Snowfall from "react-snowfall";
import "./App.css";
import { Model } from "./components/Model";
import { NameModel } from "./components/NameModel";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
  { id: "resume", label: "Resume" },
];

const initialSkills = {
  blender: 78,
  frontend: 88,
  backend: 76,
  figma: 72,
  aiml: 69,
};

const skillLabels = {
  blender: "Blender",
  frontend: "Frontend",
  backend: "Backend",
  figma: "Figma",
  aiml: "AI/ML",
};

const homeRoleTitles = ["AI/ML Developer", "Web Developer", "3D Designer"];

const skillDomains = [
  {
    id: "design",
    title: "Design",
    summary:
      "I use design tools to turn ideas into polished visual experiences with strong composition, consistency, and interaction flow.",
    cards: [
      {
        name: "Blender",
        level: "3D Design & Asset Workflow",
        description:
          "I can model clean assets, create basic materials, set lighting, and prepare scene-ready objects for web and portfolio use.",
      },
      {
        name: "Figma",
        level: "UI/UX Design",
        description:
          "I design interface layouts, create component-based systems, and structure user flows that are developer-friendly and scalable.",
      },
    ],
  },
  {
    id: "aiml",
    title: "AI/ML",
    summary:
      "I build practical machine learning foundations, from data preparation to model experimentation and result analysis.",
    cards: [
      {
        name: "Python ML Stack",
        level: "Data & Model Building",
        description:
          "Comfortable with preprocessing, feature handling, and training classic ML models using structured datasets and evaluation metrics.",
      },
      {
        name: "Model Evaluation",
        level: "Experiment & Iteration",
        description:
          "I compare models, inspect errors, and iterate on hyperparameters to improve performance in a measurable way.",
      },
    ],
  },
  {
    id: "web-dev",
    title: "Web Development",
    summary:
      "I create responsive and interactive web applications with modern frontend tooling and clean component architecture.",
    cards: [
      {
        name: "Frontend",
        level: "React & UI Systems",
        description:
          "I build modular React interfaces, connect animations/interactions, and maintain consistent styling for production-ready pages.",
      },
      {
        name: "Backend Basics",
        level: "API & App Logic",
        description:
          "I handle routing, request-response patterns, and integration workflows to support complete end-to-end web features.",
      },
    ],
  },
];

const growthTimeline = [
  {
    date: "2022",
    title: "Class 10 Achievement",
    detail:
      "Scored 97% in Class 10 with 100 marks in both Mathematics and Science.",
  },
  {
    date: "2024",
    title: "Class 12 Achievement",
    detail: "Scored 98% in Class 12 with 100 in Mathematics and 99 in Science.",
  },
  {
    date: "April 2024",
    title: "JEE Main",
    detail: "Secured 96 percentile in JEE Main.",
  },
  {
    date: "May 2024",
    title: "JEE Advanced",
    detail: "Secured AIR 11784 in JEE Advanced.",
  },
  {
    date: "July 2024",
    title: "Started Java",
    detail: "Began learning Java and core problem-solving fundamentals.",
  },
  {
    date: "August 2024",
    title: "CS Degree",
    detail:
      "Started B.Tech in Computer Science at Maharaja Surajmal Institute of Technology.",
  },
  {
    date: "September 2024",
    title: "DSA & CP Journey",
    detail:
      "Started learning and practicing Data Structures, Algorithms, and Competitive Programming.",
  },
  {
    date: "September 2024",
    title: "Geek Room Society",
    detail: "Joined Geek Room Society in the DSA department.",
  },
  {
    date: "October 2024",
    title: "HackWithMAIT 5.0",
    detail: "Participated and reached Top 20 rank.",
  },
  {
    date: "February 2025",
    title: "Frontend Development",
    detail:
      "Started learning frontend development and building interactive web interfaces.",
  },
  {
    date: "March 2025",
    title: "Power BI",
    detail: "Learned Power BI for analytics and dashboard storytelling.",
  },
  {
    date: "April 2025",
    title: "C Programming",
    detail: "Learned C language and low-level programming basics.",
  },
  {
    date: "August 2025",
    title: "C++ Programming",
    detail: "Learned C++ for advanced DSA and competitive programming.",
  },
  {
    date: "September 2025",
    title: "Codeforces Pupil",
    detail: "Reached Codeforces Pupil rank.",
  },
  {
    date: "September 2025",
    title: "CodeChef 3★",
    detail: "Achieved 3-star rating on CodeChef.",
  },
  {
    date: "October 2025",
    title: "HackWithMAIT 6.0",
    detail: "Participated and reached Top 20 rank.",
  },
  {
    date: "October 2025",
    title: "MSC Society",
    detail: "Joined MSC Society in the DSA department.",
  },
  {
    date: "October 2025",
    title: "TechSoc",
    detail: "Joined TechSoc in the Technical department.",
  },
  {
    date: "2025",
    title: "SIH Semi-Finals",
    detail: "Selected in Smart India Hackathon semi-finals.",
  },
  {
    date: "November 2025",
    title: "Python for Data Science",
    detail: "Learned Python and key libraries for data science workflows.",
  },
  {
    date: "January 2026",
    title: "LeetCode Knight",
    detail: "Reached LeetCode Knight level.",
  },
  {
    date: "January 2026",
    title: "Blender & Figma",
    detail: "Learned Blender and Figma for design and 3D workflows.",
  },
  {
    date: "January 2026",
    title: "3D Web Development",
    detail: "Learned 3D web development and interactive scene building.",
  },
  {
    date: "February 2026",
    title: "AI/ML Learning",
    detail: "Started learning AI/ML with practical experimentation.",
  },
  {
    date: "February 2026",
    title: "Backend & Databases",
    detail: "Learned backend development and database fundamentals.",
  },
  {
    date: "2026",
    title: "AlgoQuest Winner",
    detail:
      "Secured 3rd place in the DSA hackathon AlgoQuest out of 180+ participants.",
  },
];

function RotatingModel({ rotationZ, isHovered }) {
  return (
    <group
      position={[0, -6, 0]}
      rotation={[-Math.PI / 2, 0, 0.5 + rotationZ]}
      scale={4.6}
    >
      <Model isHovered={isHovered} />
    </group>
  );
}

function HoverGeometry({ kind, position, baseColor, hoverColor, floatOffset }) {
  const meshRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isHeld, setIsHeld] = React.useState(false);
  const baseYRef = React.useRef(position[1]);
  const baseColorRef = React.useRef(new Color(baseColor));
  const hoverColorRef = React.useRef(new Color(hoverColor));
  const isActive = isHovered || isHeld;

  useFrame((state, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.position.y =
      baseYRef.current +
      Math.sin(state.clock.elapsedTime * 1.35 + floatOffset) * 0.09;

    if (isActive) {
      meshRef.current.rotation.x += delta * 1.4;
      meshRef.current.rotation.y += delta * 1.65;
      meshRef.current.rotation.z += delta * 0.8;
    }

    const targetScale = isActive ? 1.22 : 1;
    const nextScale =
      meshRef.current.scale.x +
      (targetScale - meshRef.current.scale.x) * Math.min(1, delta * 8);
    meshRef.current.scale.setScalar(nextScale);

    const material = meshRef.current.material;
    if (!material?.color || !material?.emissive) {
      return;
    }

    const targetColor = isActive ? hoverColorRef.current : baseColorRef.current;
    const emissiveLevel = isActive ? 0.24 : 0.08;

    material.color.lerp(targetColor, Math.min(1, delta * 9));
    material.emissiveIntensity +=
      (emissiveLevel - material.emissiveIntensity) * Math.min(1, delta * 9);
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(event) => {
        event.stopPropagation();
        setIsHovered(true);
      }}
      onPointerOut={(event) => {
        event.stopPropagation();
        setIsHovered(false);
        setIsHeld(false);
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        setIsHeld(true);
      }}
      onPointerUp={(event) => {
        event.stopPropagation();
        setIsHeld(false);
      }}
      onPointerCancel={(event) => {
        event.stopPropagation();
        setIsHeld(false);
      }}
    >
      {kind === "box" && <boxGeometry args={[1.05, 1.05, 1.05]} />}
      {kind === "torus" && <torusGeometry args={[0.68, 0.24, 24, 90]} />}
      {kind === "octa" && <octahedronGeometry args={[0.88, 0]} />}
      {kind === "cone" && <coneGeometry args={[0.74, 1.3, 28]} />}
      {kind === "ico" && <icosahedronGeometry args={[0.88, 0]} />}
      <meshStandardMaterial
        color={baseColor}
        emissive={baseColor}
        emissiveIntensity={0.08}
        metalness={0.18}
        roughness={0.34}
      />
    </mesh>
  );
}

function HomeGeometries() {
  const { viewport } = useThree();
  const spreadFactor = Math.max(0.56, Math.min(1, viewport.width / 12));
  const verticalFactor = Math.max(0.78, Math.min(1, viewport.height / 7));

  const fitPosition = React.useCallback(
    (x, y, z) => [x * spreadFactor, y * verticalFactor, z],
    [spreadFactor, verticalFactor],
  );

  return (
    <group>
      <HoverGeometry
        kind="box"
        position={fitPosition(-3.5, 1.3, -1)}
        baseColor="#9e68ff"
        hoverColor="#a8ffcc"
        floatOffset={0.3}
      />
      <HoverGeometry
        kind="torus"
        position={fitPosition(-1.9, -1.1, 0.2)}
        baseColor="#8f5cf0"
        hoverColor="#9efec0"
        floatOffset={1.2}
      />
      <HoverGeometry
        kind="octa"
        position={fitPosition(0.4, 1.7, -0.8)}
        baseColor="#7b4bdd"
        hoverColor="#8df6b5"
        floatOffset={2.1}
      />
      <HoverGeometry
        kind="cone"
        position={fitPosition(2.2, -1.25, -0.3)}
        baseColor="#aa71ff"
        hoverColor="#b6ffce"
        floatOffset={2.8}
      />
      <HoverGeometry
        kind="ico"
        position={fitPosition(3.6, 1.2, 0.1)}
        baseColor="#935ff6"
        hoverColor="#98f8bd"
        floatOffset={3.6}
      />
    </group>
  );
}

function App() {
  const [activeTab, setActiveTab] = React.useState("home");
  const [homeRoleIndex, setHomeRoleIndex] = React.useState(0);
  const [showGrowthTimeline, setShowGrowthTimeline] = React.useState(false);
  const [modelZRotation, setModelZRotation] = React.useState(0);
  const [isModelHovered, setIsModelHovered] = React.useState(false);
  const [isModelHeld, setIsModelHeld] = React.useState(false);
  const [isNameContainerHeld, setIsNameContainerHeld] = React.useState(false);
  const isModelHeldRef = React.useRef(false);
  const aboutSectionRef = React.useRef(null);
  const aboutCardRef = React.useRef(null);
  const skillFillRefs = React.useRef({});
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
    gsap.fromTo(
      ".top-taskbar",
      { y: -24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
    );

    const revealObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          return;
        }

        if (
          entry.target === aboutSectionRef.current &&
          aboutSectionRef.current
        ) {
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
        }

        if (entry.target === contactCardRef.current && contactCardRef.current) {
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
        }

        revealObserver.unobserve(entry.target);
      },
      { threshold: 0.3 },
    );

    if (aboutSectionRef.current) {
      revealObserver.observe(aboutSectionRef.current);
    }

    if (contactCardRef.current) {
      revealObserver.observe(contactCardRef.current);
    }

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  React.useEffect(() => {
    const roleTimer = window.setInterval(() => {
      setHomeRoleIndex((prevIndex) => (prevIndex + 1) % homeRoleTitles.length);
    }, 3000);

    return () => {
      window.clearInterval(roleTimer);
    };
  }, []);

  const handleAboutMove = (event) => {
    if (!aboutCardRef.current) {
      return;
    }

    const { left, top, width, height } =
      aboutCardRef.current.getBoundingClientRect();
    const offsetX = (event.clientX - left) / width - 0.5;
    const offsetY = (event.clientY - top) / height - 0.5;

    gsap.to(aboutCardRef.current, {
      rotateY: offsetX * 8,
      rotateX: -offsetY * 8,
      duration: 0.3,
      ease: "power2.out",
      transformPerspective: 900,
    });
  };

  const handleAboutLeave = () => {
    if (!aboutCardRef.current) {
      return;
    }

    gsap.to(aboutCardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.38,
      ease: "power3.out",
    });
  };

  const handleCanvasMove = (event) => {
    const pointerType = event.pointerType || "mouse";
    if (pointerType === "touch" && !isModelHeldRef.current) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const normalizedX = x / bounds.width - 0.5;

    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
    setModelZRotation(normalizedX * 1.4);
  };

  const handleCanvasLeave = (event) => {
    event.currentTarget.style.setProperty("--mx", "50%");
    event.currentTarget.style.setProperty("--my", "50%");
    setModelZRotation(0);
    setIsModelHovered(false);
    setIsModelHeld(false);
    isModelHeldRef.current = false;
  };

  const handleCanvasPointerDown = (event) => {
    setIsModelHeld(true);
    setIsModelHovered(true);
    isModelHeldRef.current = true;

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handleCanvasPointerUp = (event) => {
    setIsModelHeld(false);
    isModelHeldRef.current = false;

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {}
    }

    if (event.pointerType === "touch") {
      setIsModelHovered(false);
      setModelZRotation(0);
      event.currentTarget.style.setProperty("--mx", "50%");
      event.currentTarget.style.setProperty("--my", "50%");
    }
  };

  const handleCanvasPointerCancel = (event) => {
    setIsModelHeld(false);
    isModelHeldRef.current = false;
    setIsModelHovered(false);
    setModelZRotation(0);
    event.currentTarget.style.setProperty("--mx", "50%");
    event.currentTarget.style.setProperty("--my", "50%");

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {}
    }
  };

  const handleNameCanvasPointerDown = (event) => {
    setIsNameContainerHeld(true);

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handleNameCanvasPointerUp = (event) => {
    setIsNameContainerHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {}
    }
  };

  const handleNameCanvasPointerCancel = (event) => {
    setIsNameContainerHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {}
    }
  };

  const handleNavClick = (sectionId) => {
    setActiveTab(sectionId);

    const scrollToSectionWithOffset = (sectionElement) => {
      if (!sectionElement) {
        return;
      }

      const taskbar = document.querySelector(".top-taskbar");
      const headerOffset = taskbar
        ? taskbar.getBoundingClientRect().height + 10
        : 84;
      const targetY =
        sectionElement.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });
    };

    if (sectionId === "experience") {
      setShowGrowthTimeline(true);

      window.setTimeout(() => {
        const experienceSection = document.getElementById("experience");
        const fallbackSkillsSection = document.getElementById("skills");
        scrollToSectionWithOffset(experienceSection || fallbackSkillsSection);
      }, 140);

      return;
    }

    const section = document.getElementById(sectionId);
    scrollToSectionWithOffset(section);
  };

  const handleCardMove = (event) => {
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
  };

  const handleCardLeave = () => {
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
  };

  const handleShowGrowthTimeline = () => {
    setShowGrowthTimeline((prev) => !prev);
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

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
  };

  const moveSneakyEyesToPoint = (targetX, targetY, isTyping = false) => {
    if (
      !sneakyRectRef.current ||
      !leftPupilRef.current ||
      !rightPupilRef.current
    ) {
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
  };

  const moveSneakyEyes = (targetElement, isTyping = false) => {
    if (!targetElement) {
      return;
    }

    const targetRect = targetElement.getBoundingClientRect();
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    moveSneakyEyesToPoint(targetCenterX, targetCenterY, isTyping);
  };

  const resetBuddyEyes = () => {
    if (
      !leftPupilRef.current ||
      !rightPupilRef.current ||
      !sneakyRectRef.current
    ) {
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
  };

  const handleFieldFocus = (event) => {
    moveSneakyEyes(event.currentTarget);
  };

  const handleFieldInput = (event) => {
    moveSneakyEyes(event.currentTarget, true);
  };

  const handleFieldBlur = () => {
    resetBuddyEyes();
  };

  return (
    <div className="app-shell">
      <header className="top-taskbar">
        <div className="taskbar-brand">Portfolio</div>
        <nav className="taskbar-nav" aria-label="Portfolio navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`taskbar-item ${activeTab === item.id ? "active" : ""}`}
              onClick={() => handleNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className="taskbar-cta"
          onClick={() => handleNavClick("contact")}
        >
          Let&apos;s Connect
        </button>
      </header>

      <section id="home" className="home-hero">
        <div className="home-hero-canvas" aria-hidden="true">
          <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[4, 5, 5]} intensity={1.15} />
            <pointLight
              position={[-4, -2, 3]}
              intensity={0.85}
              color="#b487ff"
            />
            <HomeGeometries />
          </Canvas>
        </div>

        <Snowfall
          className="home-hero-snow"
          snowflakeCount={120}
          speed={[0.3, 0.9]}
          wind={[-0.25, 0.35]}
          radius={[0.5, 2.1]}
        />

        <div className="home-hero-content">
          <p className="home-hero-kicker">My Portfolio</p>
          <h1 key={homeRoleIndex} className="home-hero-title home-hero-role">
            {homeRoleTitles[homeRoleIndex]}
          </h1>
          <p className="home-hero-subtitle">
            Hi, I&apos;m Nitin Baranwal — I blend design, code, and 3D to build
            modern digital products.
          </p>
        </div>
      </section>

      <main className="main-screen">
        <section
          id="about"
          ref={aboutSectionRef}
          className="about-inline"
          onMouseMove={handleAboutMove}
          onMouseLeave={handleAboutLeave}
        >
          <div ref={aboutCardRef} className="about-card">
            <p className="about-kicker about-animate">About Me</p>
            <div
              className="about-name-canvas about-animate"
              onPointerDown={handleNameCanvasPointerDown}
              onPointerUp={handleNameCanvasPointerUp}
              onPointerCancel={handleNameCanvasPointerCancel}
              onPointerLeave={handleNameCanvasPointerCancel}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[2, 2, 4]} intensity={1.1} />
                <NameModel
                  position={[-5.5, -0.5, 0]}
                  rotation={[Math.PI / 2, 0, 0]}
                  scale={1.8}
                  mobileHoldActive={isNameContainerHeld}
                />
              </Canvas>
            </div>
            <p className="about-text about-animate">
              I am Nitin Baranwal, a 19-year-old developer and student currently
              pursuing my Computer Science degree. I enjoy building clean,
              interactive web experiences and combining design with logic to
              make products that feel alive.
            </p>

            <div id="skill-ratings" className="skills-panel about-animate">
              <h3 className="skills-title">Skill Ratings</h3>
              {Object.keys(initialSkills).map((skillKey) => (
                <div key={skillKey} className="skill-item">
                  <div className="skill-header">
                    <span className="skill-name">{skillLabels[skillKey]}</span>
                    <span className="skill-value">
                      {initialSkills[skillKey]}%
                    </span>
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

        <div
          className={`canvas-container ${isModelHovered || isModelHeld ? "active" : ""}`}
          onPointerEnter={() => setIsModelHovered(true)}
          onPointerMove={handleCanvasMove}
          onPointerLeave={handleCanvasLeave}
          onPointerDown={handleCanvasPointerDown}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerCancel}
        >
          <span className="canvas-hold-hint">Hold to rotate</span>
          <Canvas camera={{ position: [2, 2, 4], fov: 60 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[3, 3, 3]} intensity={1} />
            <RotatingModel
              rotationZ={modelZRotation}
              isHovered={isModelHovered || isModelHeld}
            />
          </Canvas>
        </div>
      </main>

      <section id="skills" className="skills-domain-section">
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
                    <div className="skill-model-slot" aria-hidden="true">
                      <span className="skill-model-slot-label">
                        3D Model Slot · {card.name}
                      </span>
                    </div>

                    <h4 className="domain-skill-name">{card.name}</h4>
                    <p className="domain-skill-level">{card.level}</p>
                    <p className="domain-skill-description">
                      {card.description}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          ))}

          <div className="growth-cta-wrap">
            <button
              type="button"
              className="growth-cta-btn"
              onClick={handleShowGrowthTimeline}
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
                      <h4 className="growth-timeline-item-title">
                        {item.title}
                      </h4>
                      <p className="growth-timeline-item-detail">
                        {item.detail}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div
          ref={contactCardRef}
          className="contact-card"
          onPointerMove={handleCardMove}
          onPointerLeave={handleCardLeave}
        >
          <p className="contact-kicker contact-animate">Get In Touch</p>
          <h2 className="contact-title contact-animate">
            Let&apos;s Build Something Great
          </h2>
          <p className="contact-subtitle contact-animate">
            Share your project idea, timeline, and goals. I&apos;ll get back to
            you soon.
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
                  <span
                    ref={buddyOneLeftPupilRef}
                    className="buddy-mini-pupil"
                  />
                </span>
                <span className="buddy-mini-eye">
                  <span
                    ref={buddyOneRightPupilRef}
                    className="buddy-mini-pupil"
                  />
                </span>
                <span className="buddy-mini-smile" />
              </div>

              <div ref={buddyTwoRef} className="buddy-mini buddy-mini-two">
                <span className="buddy-mini-eye">
                  <span
                    ref={buddyTwoLeftPupilRef}
                    className="buddy-mini-pupil"
                  />
                </span>
                <span className="buddy-mini-eye">
                  <span
                    ref={buddyTwoRightPupilRef}
                    className="buddy-mini-pupil"
                  />
                </span>
                <span className="buddy-mini-smile" />
              </div>
            </div>

            <form className="contact-form" onSubmit={handleContactSubmit}>
              <label className="contact-label" htmlFor="name">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                className="contact-input"
                placeholder="Your name"
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <label className="contact-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="contact-input"
                placeholder="your@email.com"
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <label className="contact-label" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="contact-input contact-textarea"
                placeholder="Tell me about your project..."
                rows={5}
                required
                onFocus={handleFieldFocus}
                onInput={handleFieldInput}
                onBlur={handleFieldBlur}
              />

              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
