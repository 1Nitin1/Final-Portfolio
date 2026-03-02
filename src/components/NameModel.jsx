import React from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Color } from "three";

const LETTER_NAME_REGEX = /^txt\.?\d+$/i;

export function NameModel(props) {
  const { mobileHoldActive = false, ...restProps } = props;
  const { scene } = useGLTF("/models/name.glb");
  const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

  const [hoveredLetterId, setHoveredLetterId] = React.useState(null);
  const [heldLetterId, setHeldLetterId] = React.useState(null);
  const [pulsedLetterId, setPulsedLetterId] = React.useState(null);
  const [isMobileView, setIsMobileView] = React.useState(false);

  const letterMeshesRef = React.useRef([]);
  const letterMeshIdsRef = React.useRef(new Set());
  const linearPulseIndexRef = React.useRef(0);
  const baseColorByMeshRef = React.useRef(new Map());
  const hoverColorRef = React.useRef(new Color("#95ffc2"));
  const pulseColorRef = React.useRef(new Color("#95ffc2"));

  const resolveInteractiveMesh = React.useCallback((object) => {
    let cursor = object;
    while (cursor) {
      if (cursor.isMesh && letterMeshIdsRef.current.has(cursor.uuid)) {
        return cursor;
      }
      cursor = cursor.parent;
    }
    return null;
  }, []);

  React.useEffect(() => {
    letterMeshesRef.current = [];
    letterMeshIdsRef.current.clear();
    baseColorByMeshRef.current.clear();

    const allMeshes = [];
    const namedLetterMeshes = [];

    clonedScene.traverse((child) => {
      if (!child?.isMesh) {
        return;
      }

      allMeshes.push(child);

      if (LETTER_NAME_REGEX.test(child.name || "")) {
        namedLetterMeshes.push(child);
      }
    });

    const interactiveMeshes = namedLetterMeshes.length
      ? namedLetterMeshes
      : allMeshes;

    for (const mesh of interactiveMeshes) {
      if (!Array.isArray(mesh.material) && mesh.material) {
        mesh.material = mesh.material.clone();
        if (mesh.material.color) {
          baseColorByMeshRef.current.set(
            mesh.uuid,
            mesh.material.color.clone(),
          );
        }
      }

      mesh.userData.__baseScale = [mesh.scale.x, mesh.scale.y, mesh.scale.z];
      letterMeshesRef.current.push(mesh);
      letterMeshIdsRef.current.add(mesh.uuid);
    }
  }, [clonedScene]);

  React.useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof window.matchMedia !== "function"
    ) {
      return;
    }

    const mediaQuery = window.matchMedia(
      "(max-width: 760px) and (pointer: coarse)",
    );
    const syncMobileState = () => {
      setIsMobileView(mediaQuery.matches);
    };

    syncMobileState();

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", syncMobileState);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(syncMobileState);
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", syncMobileState);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(syncMobileState);
      }
    };
  }, []);

  React.useEffect(() => {
    const shouldPulseLinear = isMobileView && mobileHoldActive;
    if (!shouldPulseLinear) {
      setPulsedLetterId(null);
      linearPulseIndexRef.current = 0;
      return;
    }

    const pulse = () => {
      const letters = letterMeshesRef.current;
      if (!letters.length) {
        return;
      }

      const linearIndex = linearPulseIndexRef.current % letters.length;
      const letter = letters[letters.length - 1 - linearIndex];
      setPulsedLetterId(letter?.uuid || null);
      linearPulseIndexRef.current = linearIndex + 1;
    };

    linearPulseIndexRef.current = 0;
    pulse();
    const intervalId = window.setInterval(pulse, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isMobileView, mobileHoldActive]);

  useFrame((_, delta) => {
    const letters = letterMeshesRef.current;
    if (!letters.length) {
      return;
    }

    const linearPulseMode = isMobileView && mobileHoldActive;
    const activeId = linearPulseMode
      ? pulsedLetterId
      : heldLetterId || hoveredLetterId;
    const activeColor = linearPulseMode
      ? pulseColorRef.current
      : hoverColorRef.current;
    const activeScaleMultiplier = linearPulseMode ? 1.18 : 1.1;
    const easing = Math.min(1, delta * 10);

    for (const mesh of letters) {
      const baseScale = mesh.userData.__baseScale || [1, 1, 1];
      const isActive = mesh.uuid === activeId;
      const targetMultiplier = isActive ? activeScaleMultiplier : 1;

      mesh.scale.x += (baseScale[0] * targetMultiplier - mesh.scale.x) * easing;
      mesh.scale.y += (baseScale[1] * targetMultiplier - mesh.scale.y) * easing;
      mesh.scale.z += (baseScale[2] * targetMultiplier - mesh.scale.z) * easing;

      const material = mesh.material;
      if (Array.isArray(material) || !material?.color) {
        continue;
      }

      const baseColor = baseColorByMeshRef.current.get(mesh.uuid);
      if (!baseColor) {
        continue;
      }

      const targetColor = isActive ? activeColor : baseColor;
      material.color.lerp(targetColor, easing);
    }
  });

  return (
    <group
      {...restProps}
      dispose={null}
      onPointerMove={(event) => {
        const mesh = resolveInteractiveMesh(event.object);
        setHoveredLetterId(mesh?.uuid || null);
      }}
      onPointerDown={(event) => {
        const mesh = resolveInteractiveMesh(event.object);
        if (!mesh) {
          return;
        }

        setHeldLetterId(mesh.uuid);
        setHoveredLetterId(mesh.uuid);
      }}
      onPointerUp={() => {
        setHeldLetterId(null);
      }}
      onPointerCancel={() => {
        setHeldLetterId(null);
      }}
      onPointerLeave={() => {
        setHoveredLetterId(null);
        setHeldLetterId(null);
      }}
    >
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/name.glb");
