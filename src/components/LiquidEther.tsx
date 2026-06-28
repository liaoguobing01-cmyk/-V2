import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import * as THREE from "three";

import "./LiquidEther.css";

type LiquidEtherProps = {
  BFECC?: boolean;
  autoDemo?: boolean;
  autoIntensity?: number;
  autoRampDuration?: number;
  autoResumeDelay?: number;
  autoSpeed?: number;
  className?: string;
  colors?: string[];
  cursorSize?: number;
  dt?: number;
  isBounce?: boolean;
  isViscous?: boolean;
  iterationsPoisson?: number;
  iterationsViscous?: number;
  mouseForce?: number;
  resolution?: number;
  style?: CSSProperties;
  takeoverDuration?: number;
  viscous?: number;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform sampler2D uPalette;
uniform vec2 uPointer;
uniform vec2 uVelocity;
uniform float uMouseForce;
uniform float uCursorRadius;

varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);

  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));

  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for (int i = 0; i < 5; i++) {
    value += amplitude * noise(p);
    p = mat2(1.62, 1.18, -1.18, 1.62) * p;
    amplitude *= 0.52;
  }

  return value;
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
  vec2 pointer = vec2((uPointer.x - 0.5) * aspect, uPointer.y - 0.5);
  vec2 toPointer = p - pointer;

  float pointerGlow = exp(-dot(toPointer, toPointer) / max(uCursorRadius * uCursorRadius, 0.0001));
  vec2 velocity = vec2(uVelocity.x * aspect, -uVelocity.y) * uMouseForce;

  float t = uTime;
  vec2 drift = vec2(
    fbm(p * 2.0 + vec2(t * 0.11, -t * 0.08)),
    fbm(p * 2.0 + vec2(-t * 0.09, t * 0.13) + 8.7)
  ) - 0.5;

  vec2 flow = p + drift * 0.84 + velocity * pointerGlow * 0.13;
  float ribbonA = sin(flow.x * 8.6 + flow.y * 2.4 + t * 0.72);
  float ribbonB = cos(flow.y * 7.4 - flow.x * 1.8 - t * 0.56);
  float currents = fbm(flow * 3.35 + vec2(t * 0.05, -t * 0.04));
  float ether = ribbonA * 0.28 + ribbonB * 0.2 + currents * 0.92 + pointerGlow * length(velocity) * 0.22;

  float energy = smoothstep(0.54, 1.18, ether);
  float veins = smoothstep(0.72, 0.98, abs(sin((flow.x + flow.y) * 12.0 + currents * 3.0 + t * 0.45)));
  float value = clamp(energy * 0.86 + veins * energy * 0.18, 0.0, 1.0);

  vec3 color = texture2D(uPalette, vec2(value, 0.5)).rgb;
  color *= 0.72 + currents * 0.34;

  float vignette = smoothstep(0.0, 0.08, uv.x) *
    smoothstep(1.0, 0.92, uv.x) *
    smoothstep(0.0, 0.08, uv.y) *
    smoothstep(1.0, 0.92, uv.y);
  float alpha = value * (0.34 + pointerGlow * 0.12) * vignette;

  gl_FragColor = vec4(color, alpha);
}
`;

const makePaletteTexture = (colors: string[]) => {
  const palette = colors.length > 1 ? colors : [colors[0] ?? "#ffffff", colors[0] ?? "#ffffff"];
  const data = new Uint8Array(palette.length * 4);

  palette.forEach((hex, index) => {
    const color = new THREE.Color(hex);
    data[index * 4] = Math.round(color.r * 255);
    data[index * 4 + 1] = Math.round(color.g * 255);
    data[index * 4 + 2] = Math.round(color.b * 255);
    data[index * 4 + 3] = 255;
  });

  const texture = new THREE.DataTexture(data, palette.length, 1, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  return texture;
};

export default function LiquidEther({
  autoDemo = true,
  autoIntensity = 2.2,
  autoRampDuration = 0.6,
  autoResumeDelay = 1000,
  autoSpeed = 0.5,
  className = "",
  colors = ["#5227FF", "#FF9FFC", "#B497CF"],
  cursorSize = 100,
  dt = 0.014,
  mouseForce = 20,
  resolution = 0.5,
  style = {},
  takeoverDuration = 0.25,
}: LiquidEtherProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.autoClear = true;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    container.prepend(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const paletteTexture = makePaletteTexture(colors);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPalette: { value: paletteTexture },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uVelocity: { value: new THREE.Vector2(0, 0) },
      uMouseForce: { value: mouseForce },
      uCursorRadius: { value: 0.12 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(plane);

    let width = 1;
    let height = 1;
    let animationFrame = 0;
    let resizeFrame = 0;
    let visible = true;
    let running = true;
    let lastTime = performance.now();
    let lastUserInteraction = performance.now();
    let autoActivationTime = performance.now();
    let autoTarget = new THREE.Vector2(0.5, 0.5);
    const pointer = new THREE.Vector2(0.5, 0.5);
    const previousPointer = new THREE.Vector2(0.5, 0.5);
    const targetPointer = new THREE.Vector2(0.5, 0.5);
    const smoothedVelocity = new THREE.Vector2(0, 0);

    const pickAutoTarget = () => {
      autoTarget.set(0.18 + Math.random() * 0.64, 0.18 + Math.random() * 0.64);
    };

    const isInside = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
    };

    const setPointerFromEvent = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetPointer.set((clientX - rect.left) / rect.width, (clientY - rect.top) / rect.height);
      lastUserInteraction = performance.now();
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isInside(event.clientX, event.clientY)) return;
      setPointerFromEvent(event.clientX, event.clientY);
    };

    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const touch = event.touches[0];
      if (!isInside(touch.clientX, touch.clientY)) return;
      setPointerFromEvent(touch.clientX, touch.clientY);
    };

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      const renderWidth = Math.max(1, Math.floor(width * resolution));
      const renderHeight = Math.max(1, Math.floor(height * resolution));
      renderer.setSize(renderWidth, renderHeight, false);
      uniforms.uResolution.value.set(renderWidth, renderHeight);
      uniforms.uCursorRadius.value = Math.max(8, cursorSize) / Math.max(1, Math.min(width, height));
    };

    const render = (time: number) => {
      if (!running) return;
      animationFrame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;

      const delta = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000 || dt));
      lastTime = time;
      uniforms.uTime.value += delta;

      if (autoDemo && time - lastUserInteraction > autoResumeDelay) {
        const activationAge = (time - autoActivationTime) / Math.max(1, autoRampDuration * 1000);
        const ramp = Math.min(1, Math.max(0, activationAge));
        const autoStep = autoSpeed * delta * (0.25 + ramp * 0.75);
        targetPointer.lerp(autoTarget, Math.min(1, autoStep));
        if (targetPointer.distanceTo(autoTarget) < 0.015) {
          pickAutoTarget();
        }
      } else {
        autoActivationTime = time;
      }

      pointer.lerp(targetPointer, Math.min(1, 0.08 + takeoverDuration * 0.08));
      const velocity = pointer.clone().sub(previousPointer).multiplyScalar(autoDemo ? autoIntensity : 1);
      previousPointer.copy(pointer);
      smoothedVelocity.lerp(velocity, 0.18);
      uniforms.uPointer.value.copy(pointer);
      uniforms.uVelocity.value.copy(smoothedVelocity);

      renderer.render(scene, camera);
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        visible = Boolean(entries[0]?.isIntersecting);
      },
      { threshold: [0, 0.01, 0.1] },
    );

    const resizeObserver = new ResizeObserver(() => {
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(resize);
    });

    const onVisibilityChange = () => {
      visible = !document.hidden;
    };

    pickAutoTarget();
    resize();
    intersectionObserver.observe(container);
    resizeObserver.observe(container);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    animationFrame = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(animationFrame);
      if (resizeFrame) cancelAnimationFrame(resizeFrame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scene.remove(plane);
      plane.geometry.dispose();
      material.dispose();
      paletteTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [autoDemo, autoIntensity, autoRampDuration, autoResumeDelay, autoSpeed, colors, cursorSize, dt, mouseForce, resolution, takeoverDuration]);

  return <div ref={mountRef} className={`liquid-ether-container ${className}`.trim()} style={style} />;
}
