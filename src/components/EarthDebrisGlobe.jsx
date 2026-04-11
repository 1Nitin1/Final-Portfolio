import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

const ORBITS_ENDPOINT = "/api/orbits?limit=1200";

const EARTH_RADIUS = 2.2;
const EARTH_REAL_RADIUS_KM = 6371;

function toCartesian(lat, lon, altitudeKm = 0) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  const radius = EARTH_RADIUS * (1 + altitudeKm / EARTH_REAL_RADIUS_KM);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function OrbitalPoints({ points, color = "#fca5a5", size = 0.04 }) {
  const positions = React.useMemo(() => {
    const values = new Float32Array(points.length * 3);
    points.forEach((point, index) => {
      const [x, y, z] = toCartesian(point.lat, point.lon, point.altitudeKm);
      const start = index * 3;
      values[start] = x;
      values[start + 1] = y;
      values[start + 2] = z;
    });
    return values;
  }, [points]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} sizeAttenuation />
    </points>
  );
}

function Scene({ satellitePoints, debrisPoints }) {
  return (
    <>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} />

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial
          color="#1d4ed8"
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[EARTH_RADIUS * 1.01, 64, 64]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
        />
      </mesh>

      <OrbitalPoints points={satellitePoints} color="#86efac" size={0.032} />
      <OrbitalPoints points={debrisPoints} color="#fca5a5" size={0.024} />

      <Stars
        radius={120}
        depth={40}
        count={2000}
        factor={3}
        saturation={0}
        fade
      />
      <OrbitControls
        enablePan={false}
        minDistance={4.2}
        maxDistance={9.5}
        autoRotate
        autoRotateSpeed={0.45}
      />
    </>
  );
}

export function EarthDebrisGlobe() {
  const [points, setPoints] = React.useState([]);
  const [counts, setCounts] = React.useState({
    total: 0,
    satellites: 0,
    debris: 0,
  });
  const [status, setStatus] = React.useState("loading");
  const [errorMessage, setErrorMessage] = React.useState("");

  const satellitePoints = React.useMemo(
    () => points.filter((point) => point.type === "satellite"),
    [points],
  );

  const debrisPoints = React.useMemo(
    () => points.filter((point) => point.type === "debris"),
    [points],
  );

  React.useEffect(() => {
    const controller = new AbortController();

    async function fetchOrbitCatalog() {
      try {
        setStatus("loading");
        setErrorMessage("");

        const response = await fetch(ORBITS_ENDPOINT, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Orbit API request failed with ${response.status}`);
        }

        const payload = await response.json();

        if (!payload?.success || !Array.isArray(payload.points)) {
          throw new Error("Orbit API returned invalid payload.");
        }

        setPoints(payload.points);
        setCounts(
          payload.counts || {
            total: payload.points.length,
            satellites: payload.points.filter(
              (point) => point.type === "satellite",
            ).length,
            debris: payload.points.filter((point) => point.type === "debris")
              .length,
          },
        );
        setStatus("success");
      } catch (error) {
        if (error?.name === "AbortError") {
          return;
        }

        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Unable to load orbit catalog.",
        );
      }
    }

    fetchOrbitCatalog();

    return () => controller.abort();
  }, []);

  return (
    <section id="orbit" className="orbit-section">
      <div className="orbit-shell">
        <p className="orbit-kicker">Orbital Visualization</p>
        <h2 className="orbit-title">Earth + Live Satellite/Debris Orbits</h2>
        <p className="orbit-subtitle">
          Tiny spheres are plotted from live orbital elements and propagated to
          current latitude, longitude, and altitude. Green points represent
          active satellites, red points represent debris.
        </p>

        <div className="orbit-canvas-shell">
          <Canvas camera={{ position: [0, 0, 6.6], fov: 48 }} dpr={[1, 1.6]}>
            <Scene
              satellitePoints={satellitePoints}
              debrisPoints={debrisPoints}
            />
          </Canvas>
        </div>

        <div className="orbit-status">
          {status === "loading" ? "Loading live orbit catalog..." : null}
          {status === "success"
            ? `Loaded ${counts.total} orbital objects (${counts.satellites} satellites, ${counts.debris} debris).`
            : null}
          {status === "error" ? `Orbit API error: ${errorMessage}` : null}
        </div>
      </div>
    </section>
  );
}
