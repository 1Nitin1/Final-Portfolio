import React from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Color } from "three";
import Snowfall from "react-snowfall";
import { homeRoleTitles } from "../../data/portfolioData";
import styles from "./HomeHero.module.css";

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

export const HomeHero = React.memo(function HomeHero({
  useConservativeWebglMode,
  attachWebglRecovery,
  theme,
}) {
  const [homeCanvasKey, setHomeCanvasKey] = React.useState(0);
  const [homeRoleIndex, setHomeRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const roleTimer = window.setInterval(() => {
      setHomeRoleIndex((prevIndex) => (prevIndex + 1) % homeRoleTitles.length);
    }, 3000);

    return () => {
      window.clearInterval(roleTimer);
    };
  }, []);

  const handleHomeCanvasCreated = React.useCallback(
    ({ gl }) => {
      attachWebglRecovery(gl?.domElement, () => {
        setHomeCanvasKey((prev) => prev + 1);
      });
    },
    [attachWebglRecovery],
  );

  return (
    <section id="home" className={`home-hero ${styles.hero}`}>
      <div className="home-hero-canvas" aria-hidden="true">
        <Canvas
          key={homeCanvasKey}
          camera={{ position: [0, 0, 8], fov: 50 }}
          dpr={useConservativeWebglMode ? [0.75, 1] : [1, 1.75]}
          gl={{
            antialias: !useConservativeWebglMode,
            powerPreference: useConservativeWebglMode ? "low-power" : "high-performance",
            stencil: false,
          }}
          performance={{ min: useConservativeWebglMode ? 0.4 : 0.6 }}
          onCreated={handleHomeCanvasCreated}
        >
          <ambientLight intensity={0.8} />
          <directionalLight position={[4, 5, 5]} intensity={1.15} />
          <pointLight position={[-4, -2, 3]} intensity={0.85} color="#b487ff" />
          <HomeGeometries />
        </Canvas>
      </div>

      <Snowfall
        className="home-hero-snow"
        snowflakeCount={useConservativeWebglMode ? 35 : 90}
        speed={[0.3, 0.9]}
        wind={[-0.25, 0.35]}
        radius={[0.5, 2.1]}
        color={theme === "light" ? "#ff4d4f" : "#ffffff"}
      />

      <div className="home-hero-content">
        <p className="home-hero-kicker">My Portfolio</p>
        <h1 key={homeRoleIndex} className="home-hero-title home-hero-role">
          {homeRoleTitles[homeRoleIndex]}
        </h1>
        <p className="home-hero-subtitle">
          Hi, I&apos;m Nitin Baranwal - I blend design, code, and 3D to build
          modern digital products.
        </p>
      </div>
    </section>
  );
});
