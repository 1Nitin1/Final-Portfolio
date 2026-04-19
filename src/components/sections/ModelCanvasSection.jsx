import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Model } from "../Model";
import styles from "./ModelCanvasSection.module.css";

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

export const ModelCanvasSection = React.memo(function ModelCanvasSection({
  useConservativeWebglMode,
}) {
  const [modelZRotation, setModelZRotation] = React.useState(0);
  const [isModelHovered, setIsModelHovered] = React.useState(false);
  const [isModelHeld, setIsModelHeld] = React.useState(false);
  const isModelHeldRef = React.useRef(false);

  const handleCanvasMove = React.useCallback((event) => {
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
  }, []);

  const handleCanvasLeave = React.useCallback((event) => {
    event.currentTarget.style.setProperty("--mx", "50%");
    event.currentTarget.style.setProperty("--my", "50%");
    setModelZRotation(0);
    setIsModelHovered(false);
    setIsModelHeld(false);
    isModelHeldRef.current = false;
  }, []);

  const handleCanvasPointerDown = React.useCallback((event) => {
    setIsModelHeld(true);
    setIsModelHovered(true);
    isModelHeldRef.current = true;

    if (typeof event.currentTarget.setPointerCapture === "function") {
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  }, []);

  const handleCanvasPointerUp = React.useCallback((event) => {
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
  }, []);

  const handleCanvasPointerCancel = React.useCallback((event) => {
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
  }, []);

  return (
    <div
      className={`canvas-container ${isModelHovered || isModelHeld ? "active" : ""} ${styles.canvas}`}
      onPointerEnter={() => setIsModelHovered(true)}
      onPointerMove={handleCanvasMove}
      onPointerLeave={handleCanvasLeave}
      onPointerDown={handleCanvasPointerDown}
      onPointerUp={handleCanvasPointerUp}
      onPointerCancel={handleCanvasPointerCancel}
    >
      <span className="canvas-hold-hint">Hold to rotate</span>
      <Canvas
        camera={{ position: [2, 2, 4], fov: 60 }}
        dpr={useConservativeWebglMode ? [0.75, 1] : [1, 1.75]}
        gl={{
          antialias: !useConservativeWebglMode,
          powerPreference: useConservativeWebglMode ? "low-power" : "high-performance",
          stencil: false,
        }}
        performance={{ min: useConservativeWebglMode ? 0.4 : 0.6 }}
      >
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
  );
});
