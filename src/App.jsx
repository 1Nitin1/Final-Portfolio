import React from "react";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import "./App.css";
import { Taskbar } from "./components/layout/Taskbar";
import { HomeHero } from "./components/sections/HomeHero";
import { AboutSection } from "./components/sections/AboutSection";
import { ModelCanvasSection } from "./components/sections/ModelCanvasSection";
import { SkillsSection } from "./components/sections/SkillsSection";
import { ProjectsSection } from "./components/sections/ProjectsSection";
import { ResumeSection } from "./components/sections/ResumeSection";
import { ContactSection } from "./components/sections/ContactSection";
import { navItems, profileLinks } from "./data/portfolioData";

function App() {
  const [theme, setTheme] = React.useState("dark");
  const [isMobileWebglMode, setIsMobileWebglMode] = React.useState(false);
  const [isLowSpecDevice, setIsLowSpecDevice] = React.useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("home");
  const [showGrowthTimeline, setShowGrowthTimeline] = React.useState(false);
  const [isConnectDropdownOpen, setIsConnectDropdownOpen] = React.useState(false);

  const connectDropdownRef = React.useRef(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mediaQuery = window.matchMedia("(max-width: 900px) and (pointer: coarse)");

    const syncMobileWebglMode = () => {
      setIsMobileWebglMode(mediaQuery.matches);
    };

    syncMobileWebglMode();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMobileWebglMode);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(syncMobileWebglMode);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncMobileWebglMode);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(syncMobileWebglMode);
      }
    };
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    const deviceMemory = Number(navigator.deviceMemory || 0);
    const cpuCores = Number(navigator.hardwareConcurrency || 0);
    const lowMemory = deviceMemory > 0 && deviceMemory <= 4;
    const lowCpu = cpuCores > 0 && cpuCores <= 4;

    setIsLowSpecDevice(lowMemory || lowCpu);
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      if (window.innerWidth > 960) {
        setIsMobileNavOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  React.useEffect(() => {
    gsap.fromTo(
      ".top-taskbar",
      { y: -24, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, ease: "power3.out" },
    );
  }, []);

  React.useEffect(() => {
    if (!isConnectDropdownOpen || typeof window === "undefined") {
      return;
    }

    const handlePointerDownOutside = (event) => {
      if (!connectDropdownRef.current?.contains(event.target)) {
        setIsConnectDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        setIsConnectDropdownOpen(false);
      }
    };

    window.addEventListener("pointerdown", handlePointerDownOutside);
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      window.removeEventListener("pointerdown", handlePointerDownOutside);
      window.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isConnectDropdownOpen]);

  const useConservativeWebglMode = isMobileWebglMode || isLowSpecDevice;

  const attachWebglRecovery = React.useCallback((canvasElement, restart) => {
    if (!canvasElement || canvasElement.dataset.webglRecoveryAttached === "1") {
      return;
    }

    canvasElement.dataset.webglRecoveryAttached = "1";
    canvasElement.addEventListener(
      "webglcontextlost",
      (event) => {
        event.preventDefault();
        window.setTimeout(() => {
          restart();
        }, 140);
      },
      { passive: false },
    );
  }, []);

  const handleNavClick = React.useCallback((sectionId) => {
    setActiveTab(sectionId);
    setIsMobileNavOpen(false);

    const scrollToSectionWithOffset = (sectionElement) => {
      if (!sectionElement) {
        return;
      }

      const taskbar = document.querySelector(".top-taskbar");
      const headerOffset = taskbar ? taskbar.getBoundingClientRect().height + 10 : 84;
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
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  }, []);

  const toggleMobileNav = React.useCallback(() => {
    setIsMobileNavOpen((prev) => !prev);
  }, []);

  const toggleConnectDropdown = React.useCallback(() => {
    setIsConnectDropdownOpen((prev) => !prev);
  }, []);

  const closeConnectDropdown = React.useCallback(() => {
    setIsConnectDropdownOpen(false);
  }, []);

  const toggleGrowthTimeline = React.useCallback(() => {
    setShowGrowthTimeline((prev) => !prev);
  }, []);

  return (
    <div className={`app-shell theme-${theme}`}>
      <Taskbar
        navItems={navItems}
        activeTab={activeTab}
        onNavClick={handleNavClick}
        isMobileNavOpen={isMobileNavOpen}
        onToggleMobileNav={toggleMobileNav}
        connectDropdownRef={connectDropdownRef}
        isConnectDropdownOpen={isConnectDropdownOpen}
        onToggleConnectDropdown={toggleConnectDropdown}
        onCloseConnectDropdown={closeConnectDropdown}
        profileLinks={profileLinks}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <HomeHero
        useConservativeWebglMode={useConservativeWebglMode}
        attachWebglRecovery={attachWebglRecovery}
        theme={theme}
      />

      <main className="main-screen">
        <AboutSection
          useConservativeWebglMode={useConservativeWebglMode}
          attachWebglRecovery={attachWebglRecovery}
        />
        <ModelCanvasSection useConservativeWebglMode={useConservativeWebglMode} />
      </main>

      <SkillsSection
        useConservativeWebglMode={useConservativeWebglMode}
        showGrowthTimeline={showGrowthTimeline}
        onToggleGrowthTimeline={toggleGrowthTimeline}
      />
      <ProjectsSection />
      <ResumeSection />
      <ContactSection />
    </div>
  );
}

export default App;

useGLTF.preload("/models/blender.glb");
useGLTF.preload("/models/figma.glb");
useGLTF.preload("/models/python.glb");
useGLTF.preload("/models/tensorflow.glb");
useGLTF.preload("/models/react.glb");
useGLTF.preload("/models/expressjs.glb");
useGLTF.preload("/models/nodejs.glb");
useGLTF.preload("/models/docker.glb");
useGLTF.preload("/models/kubernetes.glb");
useGLTF.preload("/models/fastapi.glb");
useGLTF.preload("/models/aws.glb");
