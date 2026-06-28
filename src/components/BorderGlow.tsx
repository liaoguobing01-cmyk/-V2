import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

import "./BorderGlow.css";

type BorderGlowProps = {
  animated?: boolean;
  backgroundColor?: string;
  borderRadius?: number;
  children: ReactNode;
  className?: string;
  colors?: string[];
  coneSpread?: number;
  edgeSensitivity?: number;
  fillOpacity?: number;
  glowColor?: string;
  glowIntensity?: number;
  glowRadius?: number;
};

const GRADIENT_POSITIONS = ["80% 55%", "69% 34%", "8% 6%", "41% 38%", "86% 85%", "82% 18%", "51% 4%"];
const GRADIENT_KEYS = [
  "--gradient-one",
  "--gradient-two",
  "--gradient-three",
  "--gradient-four",
  "--gradient-five",
  "--gradient-six",
  "--gradient-seven",
];
const COLOR_MAP = [0, 1, 2, 0, 1, 2, 1];

const parseHSL = (hsl: string) => {
  const match = hsl.match(/([\d.]+)\s*([\d.]+)%?\s*([\d.]+)%?/);
  if (!match) return { h: 186, s: 46, l: 70 };

  return {
    h: Number.parseFloat(match[1]),
    l: Number.parseFloat(match[3]),
    s: Number.parseFloat(match[2]),
  };
};

const buildGlowVars = (glowColor: string, intensity: number) => {
  const { h, l, s } = parseHSL(glowColor);
  const base = `${h}deg ${s}% ${l}%`;
  const opacities = [100, 60, 50, 40, 30, 20, 10];
  const keys = ["", "-60", "-50", "-40", "-30", "-20", "-10"];
  const vars: Record<string, string> = {};

  opacities.forEach((opacity, index) => {
    vars[`--glow-color${keys[index]}`] = `hsl(${base} / ${Math.min(opacity * intensity, 100)}%)`;
  });

  return vars;
};

const buildGradientVars = (colors: string[]) => {
  const palette = colors.length ? colors : ["#8ccfd8", "#5b5873", "#d7a24a"];
  const vars: Record<string, string> = {};

  GRADIENT_KEYS.forEach((key, index) => {
    const color = palette[Math.min(COLOR_MAP[index], palette.length - 1)];
    vars[key] = `radial-gradient(at ${GRADIENT_POSITIONS[index]}, ${color} 0, transparent 50%)`;
  });
  vars["--gradient-base"] = `linear-gradient(${palette[0]} 0 100%)`;

  return vars;
};

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInCubic = (x: number) => x * x * x;

function animateValue({
  delay = 0,
  duration = 1000,
  ease = easeOutCubic,
  end = 100,
  onEnd,
  onUpdate,
  start = 0,
}: {
  delay?: number;
  duration?: number;
  ease?: (value: number) => number;
  end?: number;
  onEnd?: () => void;
  onUpdate: (value: number) => void;
  start?: number;
}) {
  let frameId = 0;
  const timeoutId = window.setTimeout(() => {
    const startedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / duration, 1);
      onUpdate(start + (end - start) * ease(progress));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        onEnd?.();
      }
    };
    frameId = requestAnimationFrame(tick);
  }, delay);

  return () => {
    window.clearTimeout(timeoutId);
    if (frameId) cancelAnimationFrame(frameId);
  };
}

export default function BorderGlow({
  animated = false,
  backgroundColor = "#121516",
  borderRadius = 8,
  children,
  className = "",
  colors = ["#8ccfd8", "#5b5873", "#d7a24a"],
  coneSpread = 25,
  edgeSensitivity = 30,
  fillOpacity = 0.36,
  glowColor = "186 46 70",
  glowIntensity = 0.9,
  glowRadius = 28,
}: BorderGlowProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const getCenterOfElement = useCallback((element: HTMLElement) => {
    const { height, width } = element.getBoundingClientRect();
    return [width / 2, height / 2] as const;
  }, []);

  const getEdgeProximity = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenterOfElement(element);
      const dx = x - centerX;
      const dy = y - centerY;
      const kx = dx === 0 ? Number.POSITIVE_INFINITY : centerX / Math.abs(dx);
      const ky = dy === 0 ? Number.POSITIVE_INFINITY : centerY / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    },
    [getCenterOfElement],
  );

  const getCursorAngle = useCallback(
    (element: HTMLElement, x: number, y: number) => {
      const [centerX, centerY] = getCenterOfElement(element);
      const dx = x - centerX;
      const dy = y - centerY;
      if (dx === 0 && dy === 0) return 0;
      const radians = Math.atan2(dy, dx);
      const degrees = radians * (180 / Math.PI) + 90;
      return degrees < 0 ? degrees + 360 : degrees;
    },
    [getCenterOfElement],
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const edge = getEdgeProximity(card, x, y);
      const angle = getCursorAngle(card, x, y);

      card.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
      card.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
    },
    [getCursorAngle, getEdgeProximity],
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!animated || !card) return;

    const cleanup: Array<() => void> = [];
    const angleStart = 110;
    const angleEnd = 465;
    card.classList.add("sweep-active");
    card.style.setProperty("--cursor-angle", `${angleStart}deg`);
    cleanup.push(animateValue({ duration: 500, onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`) }));
    cleanup.push(
      animateValue({
        duration: 1500,
        ease: easeInCubic,
        end: 50,
        onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
      }),
    );
    cleanup.push(
      animateValue({
        delay: 1500,
        duration: 2250,
        ease: easeOutCubic,
        end: 100,
        onUpdate: (value) => card.style.setProperty("--cursor-angle", `${(angleEnd - angleStart) * (value / 100) + angleStart}deg`),
        start: 50,
      }),
    );
    cleanup.push(
      animateValue({
        delay: 2500,
        duration: 1500,
        ease: easeInCubic,
        end: 0,
        onEnd: () => card.classList.remove("sweep-active"),
        onUpdate: (value) => card.style.setProperty("--edge-proximity", `${value}`),
        start: 100,
      }),
    );

    return () => cleanup.forEach((clean) => clean());
  }, [animated]);

  return (
    <div
      ref={cardRef}
      className={`border-glow-card ${className}`.trim()}
      onPointerMove={handlePointerMove}
      style={
        {
          "--border-radius": `${borderRadius}px`,
          "--card-bg": backgroundColor,
          "--cone-spread": coneSpread,
          "--edge-sensitivity": edgeSensitivity,
          "--fill-opacity": fillOpacity,
          "--glow-padding": `${glowRadius}px`,
          ...buildGlowVars(glowColor, glowIntensity),
          ...buildGradientVars(colors),
        } as CSSProperties
      }
    >
      <span className="edge-light" />
      <div className="border-glow-inner">{children}</div>
    </div>
  );
}
