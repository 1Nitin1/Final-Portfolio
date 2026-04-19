import React, { Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

const skillCardModelFileMap = {
  "Design Toolkit": ["blender.glb", "figma.glb"],
  "AI/ML Toolkit": ["python.glb", "tensorflow.glb", "fastapi.glb"],
  "Web Dev Toolkit": [
    "react.glb",
    "nodejs.glb",
    "expressjs.glb",
    "docker.glb",
    "kubernetes.glb",
    "aws.glb",
  ],
};

const skillModelOverridesByFile = {
  "blender.glb": { baseScale: 10, position: [0, -0.05, 0] },
  "figma.glb": { baseScale: 11.5, position: [0, 0, 0] },
  "python.glb": { baseScale: 8.4, position: [0, -0.1, 0] },
  "numpy.glb": { baseScale: 8.2, position: [0, -0.14, 0] },
  "pandas.glb": { baseScale: 8.2, position: [0, -0.14, 0] },
  "tensorflow.glb": { baseScale: 9, position: [0, -0.08, 0] },
  "react.glb": { baseScale: 8.4, position: [0, -0.1, 0] },
  "html.glb": { baseScale: 8, position: [0, -0.12, 0] },
  "css.glb": { baseScale: 8, position: [0, -0.12, 0] },
  "expressjs.glb": {
    initialRotation: [0, 0, 0],
    baseScale: 9,
    position: [0, -0.1, 0],
  },
  "nodejs.glb": { baseScale: 7.5, position: [0, -0.12, 0] },
  "docker.glb": { baseScale: 8.1, position: [0, -0.13, 0] },
  "kubernetes.glb": { baseScale: 8, position: [0, -0.14, 0] },
  "postmanapi.glb": { baseScale: 7.5, position: [0, -0.1, 0] },
  "js.glb": { baseScale: 7.5, position: [0, -0.1, 0] },
  "aws.glb": { baseScale: 8, position: [0, -0.12, 0] },
  "fastapi.glb": { baseScale: 7.8, position: [0, -0.1, 0] },
};

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

    const rotationYSpeed = isActive ? 1.7 : 0;
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

export const SkillModelSlot = React.memo(function SkillModelSlot({
  cardName,
  lowSpecMode = false,
}) {
  const modelFileNames = skillCardModelFileMap[cardName] || [];
  const [viewportWidth, setViewportWidth] = React.useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );
  const [isCanvasHeld, setIsCanvasHeld] = React.useState(false);
  const [isCanvasHovered, setIsCanvasHovered] = React.useState(false);

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
        <span className="skill-model-slot-label">3D Model Slot · {cardName}</span>
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

  const cameraFovBoost = viewportWidth <= 560 ? 6 : viewportWidth <= 760 ? 3 : 0;
  const isMobileCanvasView = viewportWidth <= 760;
  const isSharedCanvasActive = isMobileCanvasView
    ? isCanvasHeld
    : isCanvasHovered;
  const useConservativeCanvasMode = isMobileCanvasView || lowSpecMode;

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

  const handleSlotPointerEnter = (event) => {
    if (isMobileCanvasView || event.pointerType === "touch") {
      return;
    }

    setIsCanvasHovered(true);
  };

  const handleSlotPointerLeave = () => {
    setIsCanvasHeld(false);
    setIsCanvasHovered(false);
  };

  return (
    <div
      className={`skill-model-slot ${isMulti ? "multi" : "single"}`}
      aria-hidden="true"
      onPointerDown={handleSlotPointerDown}
      onPointerUp={handleSlotPointerUp}
      onPointerCancel={handleSlotPointerCancel}
      onPointerEnter={handleSlotPointerEnter}
      onPointerLeave={handleSlotPointerLeave}
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
        dpr={useConservativeCanvasMode ? [0.75, 1] : [1, 1.75]}
        gl={{
          antialias: !useConservativeCanvasMode,
          powerPreference: useConservativeCanvasMode
            ? "low-power"
            : "high-performance",
          stencil: false,
        }}
        performance={{ min: useConservativeCanvasMode ? 0.4 : 0.6 }}
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
                forceActive={isSharedCanvasActive}
              />
            );
          })}
        </Suspense>
      </Canvas>
      <span className="skill-model-hint">Hold / Hover</span>
    </div>
  );
});
