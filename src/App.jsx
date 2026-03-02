import React, { Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { gsap } from "gsap";
import { Box3, Color, Vector3 } from "three";
import Snowfall from "react-snowfall";
import "./App.css";
import { Model } from "./components/Model";
import { NameModel } from "./components/NameModel";
import { ResonanceOrrery } from "./components/ResonanceOrrery";
import portfolioLogo from "./assets/logo .png";
import calculatorProjectImage from "./assets/cal.png";
import todoProjectImage from "./assets/todo.png";

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

const resumeViewUrl =
  "https://drive.google.com/file/d/1gniCu779cwb1_O3-yF54fo0YI9mmHS7o/view?usp=drivesdk";
const resumeDownloadUrl =
  "https://drive.google.com/uc?export=download&id=1gniCu779cwb1_O3-yF54fo0YI9mmHS7o";

const projectCards = [
  {
    id: "calculator",
    title: "Calculator App",
    description:
      "A clean and responsive calculator web app for fast arithmetic operations with a simple, user-friendly interface.",
    image: calculatorProjectImage,
    imageAlt: "Calculator project preview",
    liveUrl: "https://calculator-ten-pi-89.vercel.app/",
  },
  {
    id: "todo",
    title: "Todo App",
    description:
      "A lightweight task manager that helps track daily work with add, update, and completion-focused todo workflows.",
    image: todoProjectImage,
    imageAlt: "Todo app project preview",
    liveUrl: "https://todo-app-iota-flax.vercel.app/",
  },
];

const skillCardModelFileMap = {
  Blender: ["blender.glb"],
  Figma: ["figma.glb"],
  "Python ML Stack": ["python.glb", "numpy.glb", "pandas.glb"],
  "Model Evaluation": ["tensorflow.glb"],
  Frontend: ["html.glb", "css.glb", "js.glb", "react.glb"],
  "Backend Basics": [
    "expressjs.glb",
    "nodejs.glb",
    "docker.glb",
    "kubernetes.glb",
    "postmanapi.glb",
  ],
};

const skillModelOverridesByFile = {
  "blender.glb": {
    baseScale: 10,
    position: [0, -0.05, 0],
  },
  "figma.glb": {
    baseScale: 11.5,
    position: [0, 0, 0],
  },
  "python.glb": {
    baseScale: 8.4,
    position: [0, -0.1, 0],
  },
  "numpy.glb": {
    baseScale: 8.2,
    position: [0, -0.14, 0],
  },
  "pandas.glb": {
    baseScale: 8.2,
    position: [0, -0.14, 0],
  },
  "tensorflow.glb": {
    baseScale: 9,
    position: [0, -0.08, 0],
  },
  "react.glb": {
    baseScale: 8.4,
    position: [0, -0.1, 0],
  },
  "html.glb": {
    baseScale: 8,
    position: [0, -0.12, 0],
  },
  "css.glb": {
    baseScale: 8,
    position: [0, -0.12, 0],
  },
  "expressjs.glb": {
    initialRotation: [0, 0, 0],
    baseScale: 9,
    position: [0, -0.1, 0],
  },
  "nodejs.glb": {
    baseScale: 7.5,
    position: [0, -0.12, 0],
  },
  "docker.glb": {
    baseScale: 8.1,
    position: [0, -0.13, 0],
  },
  "kubernetes.glb": {
    baseScale: 8,
    position: [0, -0.14, 0],
  },
  "postmanapi.glb": {
    baseScale: 7.5,
    position: [0, -0.1, 0],
  },
  "js.glb": {
    baseScale: 7.5,
    position: [0, -0.1, 0],
  },
};

function getSideBySideOffsets(count) {
  const presetOffsets = {
    1: [0],
    2: [-1.6, 1.6],
    3: [-2.5, 0, 2.5],
    4: [-3.5, -1.1, 1.1, 3.5],
    5: [-4, -2, 0, 2, 4],
  };

  if (presetOffsets[count]) {
    return presetOffsets[count];
  }

  const spacing = 1.9;
  const start = -((count - 1) * spacing) / 2;
  return Array.from({ length: count }, (_, index) => start + spacing * index);
}

const defaultSkillModelVisualConfig = {
  cameraPosition: [0, 0, 4.4],
  fov: 44,
  ambientIntensity: 1.8,
  lightBoost: 1.25,
  baseScale: 9,
  position: [0, 0, 0],
  initialRotation: [0, 0, 0],
};

const skillModelConfig = {
  Blender: {
    modelPath: "/models/blender.glb",
    cameraPosition: [0, 0, 4.2],
    fov: 42,
    ambientIntensity: 1.5,
    lightBoost: 1.35,
    baseScale: 12,
    position: [0, 0, 0],
    initialRotation: [0, 0, 0],
  },
  Figma: {
    modelPath: "/models/figma.glb",
    cameraPosition: [0, 0.1, 4.5],
    fov: 44,
    ambientIntensity: 3,
    lightBoost: 1.35,
    baseScale: 14,
    position: [0, 0, 0],
    initialRotation: [0, 0, 0],
  },
};

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
          "I create and optimize 3D assets in Blender, including modeling, UV/material setup, and export to GLB for web scenes in Three.js and React Three Fiber.",
      },
      {
        name: "Figma",
        level: "UI/UX Design",
        description:
          "I design clean UI systems in Figma with reusable components, Auto Layout, and design tokens, then hand off specs that map smoothly into React + CSS implementations.",
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
          "Using Python with NumPy and Pandas, I handle cleaning, transformation, and feature prep, plus notebook-based analysis in Jupyter and visualization with Matplotlib/Seaborn.",
      },
      {
        name: "Model Evaluation",
        level: "Experiment & Iteration",
        description:
          "With TensorFlow workflows, I run training experiments, compare metrics, and iterate on architecture/hyperparameters while tracking runs and validating results with scikit-learn metrics.",
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
          "I build frontend interfaces with React, HTML, CSS, and JavaScript, and use Vite, GSAP, and responsive layout patterns to deliver smooth, production-ready UI interactions.",
      },
      {
        name: "Backend Basics",
        level: "API & App Logic",
        description:
          "I work with Express and Node.js for APIs, test endpoints with Postman, manage data using PostgreSQL/Neon, and use Docker/Kubernetes basics for containerized backend workflows.",
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

function InteractiveSkillModel({
  modelPath,
  baseScale,
  position,
  initialRotation,
  lightBoost = 1,
  forceActive = false,
}) {
  const modelGroupRef = React.useRef(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [isHeld, setIsHeld] = React.useState(false);
  const isActive = forceActive || isHovered || isHeld;
  const { scene } = useGLTF(modelPath);
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);
  const centeredSceneOffset = React.useMemo(() => {
    const bounds = new Box3().setFromObject(clonedScene);
    if (!Number.isFinite(bounds.min.x)) {
      return [0, 0, 0];
    }

    const center = new Vector3();
    bounds.getCenter(center);
    return [-center.x, -center.y, -center.z];
  }, [clonedScene]);

  React.useEffect(() => {
    const applyBoost = (material) => {
      if (!material || Array.isArray(material)) {
        return;
      }

      if (
        material.color &&
        typeof material.color.multiplyScalar === "function"
      ) {
        material.color.multiplyScalar(lightBoost);
      }

      if (typeof material.emissiveIntensity === "number") {
        material.emissiveIntensity = Math.max(
          material.emissiveIntensity,
          0.4 * lightBoost,
        );
      }

      if (typeof material.envMapIntensity === "number") {
        material.envMapIntensity = Math.max(
          material.envMapIntensity,
          1.1 * lightBoost,
        );
      }

      material.needsUpdate = true;
    };

    clonedScene.traverse((child) => {
      if (!child?.isMesh) {
        return;
      }

      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) => material.clone());
        child.material.forEach(applyBoost);
      } else if (child.material) {
        child.material = child.material.clone();
        applyBoost(child.material);
      }
    });
  }, [clonedScene, lightBoost]);

  useFrame((_, delta) => {
    if (!modelGroupRef.current) {
      return;
    }

    const rotationYSpeed = isActive ? 1.7 : 0.45;
    modelGroupRef.current.rotation.y += delta * rotationYSpeed;

    const targetScale = baseScale * (isActive ? 1.12 : 1);
    const nextScale =
      modelGroupRef.current.scale.x +
      (targetScale - modelGroupRef.current.scale.x) * Math.min(1, delta * 8);
    modelGroupRef.current.scale.setScalar(nextScale);
  });

  return (
    <group position={position} rotation={initialRotation}>
      <group
        ref={modelGroupRef}
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
        <primitive object={clonedScene} position={centeredSceneOffset} />
      </group>
    </group>
  );
}

function SkillModelSlot({ cardName }) {
  const modelFileNames = skillCardModelFileMap[cardName] || [];
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [isCanvasHeld, setIsCanvasHeld] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const baseCardConfig = {
    ...defaultSkillModelVisualConfig,
    ...(skillModelConfig[cardName] || {}),
  };

  if (!modelFileNames.length) {
    return (
      <div className="skill-model-slot" aria-hidden="true">
        <span className="skill-model-slot-label">
          3D Model Slot · {cardName}
        </span>
      </div>
    );
  }

  const isMulti = modelFileNames.length > 1;
  const modelCount = modelFileNames.length;
  const baseOffsets = getSideBySideOffsets(modelCount);

  const spacingCompression =
    viewportWidth <= 420
      ? 0.78
      : viewportWidth <= 560
        ? 0.84
        : viewportWidth <= 760
          ? 0.9
          : viewportWidth <= 960
            ? 0.95
            : 1;

  const cameraDistanceBoost =
    (modelCount >= 4 ? 1 : modelCount === 3 ? 0.6 : 0) +
    (viewportWidth <= 560 ? 1 : viewportWidth <= 760 ? 0.55 : 0);

  const cameraFovBoost =
    viewportWidth <= 560 ? 6 : viewportWidth <= 760 ? 3 : 0;
  const isMobileCanvasView = viewportWidth <= 760;

  const handleSlotPointerDown = (event) => {
    if (!isMobileCanvasView) {
      return;
    }

    setIsCanvasHeld(true);

    if (typeof event.currentTarget.setPointerCapture === "function") {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        return;
      }
    }
  };

  const handleSlotPointerUp = (event) => {
    setIsCanvasHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        return;
      }
    }
  };

  const handleSlotPointerCancel = (event) => {
    setIsCanvasHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        return;
      }
    }
  };

  return (
    <div
      className={`skill-model-slot ${isMulti ? "multi" : "single"}`}
      aria-hidden="true"
      onPointerDown={handleSlotPointerDown}
      onPointerUp={handleSlotPointerUp}
      onPointerCancel={handleSlotPointerCancel}
      onPointerLeave={() => {
        setIsCanvasHeld(false);
      }}
    >
      <Canvas
        className="skill-model-canvas"
        camera={{
          position: [
            baseCardConfig.cameraPosition[0],
            baseCardConfig.cameraPosition[1],
            baseCardConfig.cameraPosition[2] + cameraDistanceBoost,
          ],
          fov: baseCardConfig.fov + cameraFovBoost,
        }}
      >
        <ambientLight intensity={baseCardConfig.ambientIntensity ?? 0.78} />
        <hemisphereLight
          intensity={1.05}
          color="#fff2ff"
          groundColor="#35174f"
        />
        <directionalLight position={[2.5, 3, 2.5]} intensity={1.4} />
        <pointLight position={[-2, 1.2, 2]} intensity={1.15} color="#c99bff" />
        <Suspense fallback={null}>
          {modelFileNames.map((modelFileName, index) => {
            const perFileConfig = {
              ...baseCardConfig,
              ...(skillModelOverridesByFile[modelFileName] || {}),
            };
            const [baseX, baseY, baseZ] = perFileConfig.position;
            const adjustedXOffset = baseOffsets[index] * spacingCompression;

            return (
              <InteractiveSkillModel
                key={`${cardName}-${modelFileName}`}
                modelPath={`/models/${modelFileName}`}
                baseScale={perFileConfig.baseScale}
                position={[baseX + adjustedXOffset, baseY, baseZ]}
                initialRotation={perFileConfig.initialRotation}
                lightBoost={perFileConfig.lightBoost}
                forceActive={isMobileCanvasView && isCanvasHeld}
              />
            );
          })}
        </Suspense>
      </Canvas>
      <span className="skill-model-hint">Hold / Hover</span>
    </div>
  );
}
function App() {
  const [isMobileWebglMode, setIsMobileWebglMode] = React.useState(false);
  const [homeCanvasKey, setHomeCanvasKey] = React.useState(0);
  const [nameCanvasKey, setNameCanvasKey] = React.useState(0);
  const [activeTab, setActiveTab] = React.useState("home");
  const [homeRoleIndex, setHomeRoleIndex] = React.useState(0);
  const [showGrowthTimeline, setShowGrowthTimeline] = React.useState(false);
  const [modelZRotation, setModelZRotation] = React.useState(0);
  const [isModelHovered, setIsModelHovered] = React.useState(false);
  const [isModelHeld, setIsModelHeld] = React.useState(false);
  const [isNameContainerHeld, setIsNameContainerHeld] = React.useState(false);
  const [isContactSubmitting, setIsContactSubmitting] = React.useState(false);
  const [contactSubmitStatus, setContactSubmitStatus] = React.useState("idle");
  const [contactSubmitMessage, setContactSubmitMessage] = React.useState("");
  const [showResumeEmailForm, setShowResumeEmailForm] = React.useState(false);
  const [isResumeEmailSubmitting, setIsResumeEmailSubmitting] =
    React.useState(false);
  const [resumeEmailStatus, setResumeEmailStatus] = React.useState("idle");
  const [resumeEmailMessage, setResumeEmailMessage] = React.useState("");
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
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(max-width: 900px) and (pointer: coarse)",
    );

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

  const handleHomeCanvasCreated = React.useCallback(
    ({ gl }) => {
      attachWebglRecovery(gl?.domElement, () => {
        setHomeCanvasKey((prev) => prev + 1);
      });
    },
    [attachWebglRecovery],
  );

  const handleNameCanvasCreated = React.useCallback(
    ({ gl }) => {
      attachWebglRecovery(gl?.domElement, () => {
        setNameCanvasKey((prev) => prev + 1);
      });
    },
    [attachWebglRecovery],
  );

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
      } catch {
        return;
      }
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
      } catch {
        return;
      }
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
      } catch {
        return;
      }
    }
  };

  const handleNameCanvasPointerCancel = (event) => {
    setIsNameContainerHeld(false);

    if (typeof event.currentTarget.releasePointerCapture === "function") {
      try {
        event.currentTarget.releasePointerCapture(event.pointerId);
      } catch {
        return;
      }
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

  const handleContactSubmit = async (event) => {
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
        throw new Error(
          payload?.message || "Unable to send your message right now.",
        );
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
  };

  const handleResumeEmailToggle = () => {
    setShowResumeEmailForm((prev) => !prev);
    setResumeEmailStatus("idle");
    setResumeEmailMessage("");
  };

  const handleResumeEmailSubmit = async (event) => {
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
        throw new Error(
          payload?.message || "Unable to email the resume right now.",
        );
      }

      setResumeEmailStatus("success");
      setResumeEmailMessage(
        payload?.message || "Resume has been sent to your email.",
      );
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
        <div className="taskbar-brand">
          <img
            src={portfolioLogo}
            alt="Portfolio logo"
            className="taskbar-logo"
          />
          <span>Portfolio</span>
        </div>
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
          <Canvas
            key={homeCanvasKey}
            camera={{ position: [0, 0, 8], fov: 50 }}
            dpr={isMobileWebglMode ? [1, 1.2] : [1, 2]}
            gl={{
              antialias: !isMobileWebglMode,
              powerPreference: isMobileWebglMode
                ? "low-power"
                : "high-performance",
            }}
            onCreated={handleHomeCanvasCreated}
          >
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
              <Canvas
                key={nameCanvasKey}
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={isMobileWebglMode ? [1, 1.2] : [1, 2]}
                gl={{
                  antialias: !isMobileWebglMode,
                  powerPreference: isMobileWebglMode
                    ? "low-power"
                    : "high-performance",
                }}
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
            <Suspense fallback={null}>
              <RotatingModel
                rotationZ={modelZRotation}
                isHovered={isModelHovered || isModelHeld}
              />
            </Suspense>
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
                    <SkillModelSlot cardName={card.name} />

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

      <section id="projects" className="projects-section">
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

      <section id="resume" className="resume-section">
        <div className="resume-shell">
          <p className="resume-kicker">Career Snapshot</p>
          <h2 className="resume-title">Resume</h2>
          <p className="resume-subtitle">
            View my latest resume online or download a copy directly.
          </p>

          <div className="resume-actions">
            <a
              href={resumeViewUrl}
              target="_blank"
              rel="noreferrer"
              className="resume-btn"
            >
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
            <form
              className="resume-email-form"
              onSubmit={handleResumeEmailSubmit}
            >
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

      <section id="contact" className="contact-section">
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

                <button
                  type="submit"
                  className="contact-submit"
                  disabled={isContactSubmitting}
                >
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

          <aside
            className="contact-casual-card"
            aria-label="Casual resonance panel"
          >
            <div
              className="contact-orrery-panel"
              aria-label="Interactive celestial resonance canvas"
            >
              <ResonanceOrrery />
            </div>
          </aside>
        </div>
      </section>
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
useGLTF.preload("/models/numpy.glb");
useGLTF.preload("/models/pandas.glb");
useGLTF.preload("/models/html.glb");
useGLTF.preload("/models/css.glb");
useGLTF.preload("/models/js.glb");
useGLTF.preload("/models/nodejs.glb");
useGLTF.preload("/models/docker.glb");
useGLTF.preload("/models/kubernetes.glb");
useGLTF.preload("/models/postmanapi.glb");
