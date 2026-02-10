"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as d3 from "d3";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getRoleForXp, getRoleClass, Task } from "@/lib/types";
import { TaskModal } from "./TaskModal";

// Color constants matching the home page aesthetic
const PAUSEAI_ORANGE = "#FF9416";
const CARD_BG = "#1e1e2e";

const LAYOUT = {
  width: 1200,
  height: 900,
  centerX: 600,
  centerY: 450,
  circleRadii: { 0: 150, 1: 300, 2: 450, 3: 600 },
  nodeRadius: 35,
};

const DISCORD_ICON_PATH = "M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z";

// Discord icon component to avoid duplication
function DiscordIcon({ size = "w-5 h-5" }: { size?: string }) {
  return (
    <svg className={size} viewBox="0 0 24 24" fill="currentColor">
      <path d={DISCORD_ICON_PATH} />
    </svg>
  );
}

const LUCIDE_BASE = "https://unpkg.com/lucide-static@latest/icons/";

const LUCIDE_MAP: Record<string, string> = {
  book: "book-open",
  "capitol": "landmark",
  "conversation": "message-circle",
  "double-star": "award",
  envelope: "mail",
  handshake: "handshake",
  newspaper: "newspaper",
  "person-add": "user-plus",
  player: "user",
  podium: "presentation",
  "round-table": "users",
  "scroll-signed": "scroll-text",
  share: "share-2",
  smartphone: "smartphone",
  star: "star",
  talk: "megaphone",
  "triple-star": "trophy",
  "video-conference": "video",
};

// Icon cache for preloaded SVG icons
const iconCache = new Map<string, SVGElement>();

async function preloadIcons() {
  const uniqueIcons = [...new Set(Object.values(LUCIDE_MAP))];
  const promises = uniqueIcons.map(async (iconName) => {
    try {
      const url = `${LUCIDE_BASE}${iconName}.svg`;
      const response = await fetch(url);
      const svgText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = doc.documentElement as unknown as SVGElement;
      iconCache.set(iconName, svgElement);
    } catch (err) {
      console.warn(`Failed to load icon: ${iconName}`, err);
    }
  });
  await Promise.all(promises);
}

export function ActionTree() {
  const { data: session, status: sessionStatus } = useSession();
  const svgRef = useRef<SVGSVGElement>(null);

  // Convex queries
  const tasks = useQuery(api.tasks.list);
  const userData = useQuery(
    api.users.getMe,
    session?.user?.discordId ? { discordId: session.user.discordId } : "skip"
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [iconsLoaded, setIconsLoaded] = useState(false);

  const isSessionLoading = sessionStatus === "loading";

  // Preload icons
  useEffect(() => {
    preloadIcons().then(() => setIconsLoaded(true));
  }, []);

  // Extract completed tasks from user data
  const completedTasks = new Set(userData?.completed_tasks || []);
  const totalXp = userData?.total_xp ?? 0;

  // Calculate overall glow based on completed tasks
  function calculateOverallGlow(): number {
    if (!tasks?.length) return 0;
    const completedCount = tasks.filter((t) => completedTasks.has(t.id)).length;
    return Math.min(completedCount / tasks.length, 1);
  }

  // Draw the tree using D3
  useEffect(() => {
    if (!svgRef.current || !iconsLoaded || !tasks) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height, centerX, centerY, circleRadii } = LAYOUT;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");

    const glowIntensity = calculateOverallGlow();
    const completedTaskCount = Array.from(completedTasks).filter(id =>
      tasks.some(t => t.id === id)
    ).length;

    // === FILTERS ===

    // Glow filter for completed nodes
    const glowFilter = defs.append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter.append("feGaussianBlur")
      .attr("stdDeviation", 6)
      .attr("result", "blur");

    const glowMerge = glowFilter.append("feMerge");
    glowMerge.append("feMergeNode").attr("in", "blur");
    glowMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Ambient glow filter
    const ambientGlow = defs.append("filter")
      .attr("id", "ambient-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    ambientGlow.append("feGaussianBlur")
      .attr("stdDeviation", 15 + glowIntensity * 25)
      .attr("result", "ambientBlur");

    const ambientMerge = ambientGlow.append("feMerge");
    ambientMerge.append("feMergeNode").attr("in", "ambientBlur");
    ambientMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // === BACKGROUND ===

    // Deep space base gradient
    const bgGradient = defs.append("radialGradient")
      .attr("id", "bg-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "80%");

    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#0a0a12")
      .attr("stop-opacity", 1);

    bgGradient.append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#050508")
      .attr("stop-opacity", 1);

    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#030305")
      .attr("stop-opacity", 1);

    // Purple nebula gradient
    const purpleNebula = defs.append("radialGradient")
      .attr("id", "purple-nebula")
      .attr("cx", "30%")
      .attr("cy", "40%")
      .attr("r", "50%");

    purpleNebula.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#4a1a6b")
      .attr("stop-opacity", 0.15);

    purpleNebula.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4a1a6b")
      .attr("stop-opacity", 0);

    // Teal nebula gradient
    const tealNebula = defs.append("radialGradient")
      .attr("id", "teal-nebula")
      .attr("cx", "70%")
      .attr("cy", "60%")
      .attr("r", "45%");

    tealNebula.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1a4a5b")
      .attr("stop-opacity", 0.12);

    tealNebula.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#1a4a5b")
      .attr("stop-opacity", 0);

    // Orange ambient glow layer based on completed tasks
    const ambientGlowGradient = defs.append("radialGradient")
      .attr("id", "ambient-glow-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "55%");

    ambientGlowGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.06 + glowIntensity * 0.12);

    ambientGlowGradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.02);

    ambientGlowGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0);

    // Grid pattern definition
    const gridPattern = defs.append("pattern")
      .attr("id", "grid-pattern")
      .attr("x", "0")
      .attr("y", "0")
      .attr("width", "60")
      .attr("height", "60")
      .attr("patternUnits", "userSpaceOnUse");

    gridPattern.append("path")
      .attr("d", "M 60 0 L 0 0 0 60")
      .attr("fill", "none")
      .attr("stroke", "#ffffff")
      .attr("stroke-width", "0.5")
      .attr("stroke-opacity", "0.03");

    // Grid fade mask for edges
    const gridFadeMask = defs.append("mask")
      .attr("id", "grid-fade-mask");

    const gridFadeGradient = defs.append("radialGradient")
      .attr("id", "grid-fade-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    gridFadeGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 1);

    gridFadeGradient.append("stop")
      .attr("offset", "70%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0.4);

    gridFadeGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "white")
      .attr("stop-opacity", 0);

    gridFadeMask.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid-fade-gradient)");

    // Create main group first (before background so background is at the bottom)
    const mainGroup = svg.append("g")
      .attr("class", "main-group");

    // Setup zoom behavior immediately so it applies to everything in mainGroup
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        mainGroup.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Background layers (inside main group so they pan/zoom with the tree)
    const backgroundGroup = mainGroup.append("g").attr("class", "background");

    // Base deep space background
    backgroundGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "#030305");

    backgroundGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#bg-gradient)");

    // Purple nebula layer
    backgroundGroup.append("ellipse")
      .attr("cx", width * 0.3)
      .attr("cy", height * 0.4)
      .attr("rx", width * 0.5)
      .attr("ry", height * 0.5)
      .attr("fill", "url(#purple-nebula)");

    // Teal nebula layer
    backgroundGroup.append("ellipse")
      .attr("cx", width * 0.7)
      .attr("cy", height * 0.6)
      .attr("rx", width * 0.45)
      .attr("ry", height * 0.45)
      .attr("fill", "url(#teal-nebula)");

    // Orange ambient glow layer
    backgroundGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#ambient-glow-gradient)");

    // Subtle grid pattern with fade at edges
    backgroundGroup.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#grid-pattern)")
      .attr("mask", "url(#grid-fade-mask)");

    // === ENHANCED PARTICLE SYSTEM ===

    const particlesGroup = backgroundGroup.append("g").attr("class", "particles");

    // Base star particles (always present, more diverse)
    const baseStarCount = 80;
    for (let i = 0; i < baseStarCount; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const size = Math.random() * 1.5 + 0.3;

      // Random star colors: white, blue-white, or subtle orange
      const colors = ["#ffffff", "#e8f4ff", "#fff4e8", PAUSEAI_ORANGE];
      const starColor = Math.random() > 0.85 ? colors[3] : colors[Math.floor(Math.random() * 3)];

      const star = particlesGroup.append("circle")
        .attr("cx", px)
        .attr("cy", py)
        .attr("r", size)
        .attr("fill", starColor)
        .attr("opacity", Math.random() * 0.4 + 0.1);

      const twinkleDuration = 2000 + Math.random() * 5000;
      star.append("animate")
        .attr("attributeName", "opacity")
        .attr("values", `${Math.random() * 0.15 + 0.05};${Math.random() * 0.5 + 0.2};${Math.random() * 0.15 + 0.05}`)
        .attr("dur", `${twinkleDuration}ms`)
        .attr("repeatCount", "indefinite");
    }

    // Energy particles for completed tasks (pulsing, glowing)
    const energyParticleCount = completedTaskCount * 3;
    for (let i = 0; i < energyParticleCount; i++) {
      const angle = (i / energyParticleCount) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 80 + Math.random() * 450;
      const px = centerX + Math.cos(angle) * distance;
      const py = centerY + Math.sin(angle) * distance;
      const size = Math.random() * 2.5 + 0.8;

      // Energy particle glow filter
      const particleGlowId = `particle-glow-${i}`;
      const particleGlow = defs.append("filter")
        .attr("id", particleGlowId)
        .attr("x", "-100%")
        .attr("y", "-100%")
        .attr("width", "300%")
        .attr("height", "300%");

      particleGlow.append("feGaussianBlur")
        .attr("stdDeviation", 2)
        .attr("result", "blur");

      const particleMerge = particleGlow.append("feMerge");
      particleMerge.append("feMergeNode").attr("in", "blur");
      particleMerge.append("feMergeNode").attr("in", "SourceGraphic");

      const particle = particlesGroup.append("circle")
        .attr("cx", px)
        .attr("cy", py)
        .attr("r", size)
        .attr("fill", PAUSEAI_ORANGE)
        .attr("opacity", Math.random() * 0.5 + 0.2)
        .attr("filter", `url(#${particleGlowId})`);

      // Pulsing animation for size and opacity
      const pulseDuration = 2000 + Math.random() * 3000;
      particle.append("animate")
        .attr("attributeName", "opacity")
        .attr("values", `${Math.random() * 0.2 + 0.1};${Math.random() * 0.6 + 0.3};${Math.random() * 0.2 + 0.1}`)
        .attr("dur", `${pulseDuration}ms`)
        .attr("repeatCount", "indefinite");

      particle.append("animate")
        .attr("attributeName", "r")
        .attr("values", `${size};${size * 1.5};${size}`)
        .attr("dur", `${pulseDuration}ms`)
        .attr("repeatCount", "indefinite");

      // Slow drift animation
      const driftX = px + (Math.random() - 0.5) * 20;
      const driftY = py + (Math.random() - 0.5) * 20;
      particle.append("animate")
        .attr("attributeName", "cx")
        .attr("values", `${px};${driftX};${px}`)
        .attr("dur", `${8000 + Math.random() * 4000}ms`)
        .attr("repeatCount", "indefinite");

      particle.append("animate")
        .attr("attributeName", "cy")
        .attr("values", `${py};${driftY};${py}`)
        .attr("dur", `${8000 + Math.random() * 4000}ms`)
        .attr("repeatCount", "indefinite");
    }

    // Draw circles (outer to inner)
    [3, 2, 1, 0].forEach((level) => {
      const radius = circleRadii[level as keyof typeof circleRadii];
      const levelTasks = tasks.filter(t => t.level === level);
      const levelHasCompletions = levelTasks.filter(t => completedTasks.has(t.id)).length > 0;

      mainGroup.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", levelHasCompletions ? PAUSEAI_ORANGE : "#2a2a2a")
        .attr("stroke-width", 1)
        .attr("stroke-opacity", levelHasCompletions ? 0.5 : 0.2);
    });

    // === USER AVATAR ===

    const userGroup = mainGroup.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Outer glow ring (static, no pulsing)
    if (glowIntensity > 0) {
      userGroup.append("circle")
        .attr("r", 52)
        .attr("fill", "none")
        .attr("stroke", PAUSEAI_ORANGE)
        .attr("stroke-width", 1)
        .attr("opacity", glowIntensity * 0.2)
        .attr("filter", "url(#ambient-glow)");
    }

    userGroup.append("circle")
      .attr("r", 45)
      .attr("fill", CARD_BG)
      .attr("stroke", PAUSEAI_ORANGE)
      .attr("stroke-width", 2);

    // Discord profile image or fallback icon
    if (session?.user?.image) {
      const userDefs = userGroup.append("defs");
      const clipId = `avatar-clip`;
      userDefs.append("clipPath")
        .attr("id", clipId)
        .append("circle")
        .attr("r", 40)
        .attr("cx", 0)
        .attr("cy", 0);

      userGroup.append("image")
        .attr("href", session.user.image)
        .attr("width", 80)
        .attr("height", 80)
        .attr("x", -40)
        .attr("y", -40)
        .attr("clip-path", `url(#${clipId})`)
        .attr("preserveAspectRatio", "xMidYMid slice");
    } else {
      const userIcon = iconCache.get("user");
      if (userIcon) {
        const clonedIcon = userGroup.node()!.appendChild(userIcon.cloneNode(true) as SVGElement);
        d3.select(clonedIcon)
          .attr("width", 50)
          .attr("height", 50)
          .attr("x", -25)
          .attr("y", -25)
          .selectAll("*")
          .attr("fill", "none")
          .attr("stroke", PAUSEAI_ORANGE)
          .attr("stroke-width", "2");
      }
    }

    // XP text below
    userGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 62)
      .attr("fill", PAUSEAI_ORANGE)
      .attr("font-size", "13px")
      .attr("font-weight", "bold")
      .attr("font-family", "var(--font-headline)")
      .text(`${totalXp} XP`);

    // Connection lines from center to completed tasks
    tasks.filter(t => completedTasks.has(t.id)).forEach(task => {
      const radius = circleRadii[task.level as keyof typeof circleRadii];
      const levelTasks = tasks.filter((t) => t.level === task.level);
      const angleStep = (2 * Math.PI) / levelTasks.length;
      const startAngle = -Math.PI / 2;
      const index = levelTasks.findIndex(t => t.id === task.id);
      const angle = startAngle + index * angleStep;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      mainGroup.append("line")
        .attr("x1", centerX)
        .attr("y1", centerY)
        .attr("x2", x)
        .attr("y2", y)
        .attr("stroke", PAUSEAI_ORANGE)
        .attr("stroke-width", 1)
        .attr("opacity", 0.15 + glowIntensity * 0.2)
        .attr("stroke-dasharray", "4,4");
    });

    // === DRAW TASK NODES ===

    for (let level = 0; level <= 3; level++) {
      const radius = circleRadii[level as keyof typeof circleRadii];
      const levelTasks = tasks.filter((t) => t.level === level);

      if (levelTasks.length === 0) continue;

      const angleStep = (2 * Math.PI) / levelTasks.length;
      const startAngle = -Math.PI / 2;

      levelTasks.forEach((task, index: number) => {
        const angle = startAngle + index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const isCompleted = completedTasks.has(task.id);

        const group = mainGroup.append("g")
          .attr("class", "node-group")
          .attr("transform", `translate(${x}, ${y})`)
          .style("cursor", "pointer");

        // Transparent click area circle (no border)
        group.append("circle")
          .attr("class", "click-area")
          .attr("r", LAYOUT.nodeRadius + 5)
          .attr("fill", "transparent")
          .style("pointer-events", "all");

        // Glow effect for completed tasks (behind everything)
        if (isCompleted) {
          group.append("circle")
            .attr("class", "glow-bg")
            .attr("r", LAYOUT.nodeRadius + 6)
            .attr("fill", PAUSEAI_ORANGE)
            .attr("opacity", 0.25)
            .attr("filter", "url(#glow)");
        }

        const iconName = LUCIDE_MAP[task.icon] || "star";
        const cachedIcon = iconCache.get(iconName);
        const iconSize = LAYOUT.nodeRadius * 1.6;

        if (cachedIcon) {
          const clonedIcon = group.node()!.appendChild(cachedIcon.cloneNode(true) as SVGElement);
          d3.select(clonedIcon)
            .attr("class", "task-icon")
            .attr("width", iconSize)
            .attr("height", iconSize)
            .attr("x", -iconSize / 2)
            .attr("y", -iconSize / 2 - 8)
            .selectAll("*")
            .attr("fill", "none")
            .attr("stroke", isCompleted ? PAUSEAI_ORANGE : "#666666")
            .attr("stroke-width", "2");
        }

        // XP text
        group.append("text")
          .attr("class", "xp-text")
          .attr("text-anchor", "middle")
          .attr("y", LAYOUT.nodeRadius - 6)
          .attr("fill", isCompleted ? PAUSEAI_ORANGE : "#888888")
          .attr("font-size", "11px")
          .attr("font-weight", isCompleted ? "bold" : "normal")
          .attr("font-family", "var(--font-headline)")
          .text(`${task.xp} XP`);

        // Hover effect - only scale the icon and text, not the click area
        group.on("mouseenter", function () {
          d3.select(this).select(".task-icon")
            .transition()
            .duration(150)
            .attr("transform", "scale(1.1)");

          d3.select(this).select(".xp-text")
            .transition()
            .duration(150)
            .attr("font-size", "12px");

          if (isCompleted) {
            d3.select(this).select(".glow-bg")
              .transition()
              .duration(150)
              .attr("opacity", 0.4);
          }
        });

        group.on("mouseleave", function () {
          d3.select(this).select(".task-icon")
            .transition()
            .duration(150)
            .attr("transform", "scale(1)");

          d3.select(this).select(".xp-text")
            .transition()
            .duration(150)
            .attr("font-size", "11px");

          if (isCompleted) {
            d3.select(this).select(".glow-bg")
              .transition()
              .duration(150)
              .attr("opacity", 0.25);
          }
        });

        // Click handler
        group.on("click", (event) => {
          event.stopPropagation();
          setSelectedTask(task);
        });
      });
    }

    // === LEGEND (pinned to viewport, not affected by zoom) ===
    const legendGroup = svg.append("g")
      .attr("transform", `translate(50, ${LAYOUT.height - 30})`);

    const legendItems = [
      { color: PAUSEAI_ORANGE, label: "Erledigt", glow: true },
      { color: "#666666", label: "Verfügbar", glow: false }
    ];

    let xOffset = 0;
    legendItems.forEach((item) => {
      // Glow effect for completed items
      if (item.glow) {
        legendGroup.append("circle")
          .attr("cx", xOffset + 6)
          .attr("cy", 0)
          .attr("r", 11)
          .attr("fill", PAUSEAI_ORANGE)
          .attr("opacity", 0.2)
          .attr("filter", "url(#ambient-glow)");
      }

      // Main circle
      legendGroup.append("circle")
        .attr("cx", xOffset + 6)
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", item.color);

      // Text (vertically centered with circle)
      legendGroup.append("text")
        .attr("x", xOffset + 22)
        .attr("y", 1)
        .attr("dy", "0.35em")
        .attr("fill", "rgba(255, 255, 255, 0.7)")
        .attr("font-size", "20px")
        .attr("font-weight", "400")
        .attr("font-family", "var(--font-body)")
        .text(item.label);

      xOffset += 110;
    });

  }, [tasks, completedTasks, totalXp, iconsLoaded, session?.user?.image]);

  const loading = !tasks || !iconsLoaded || isSessionLoading;

  if (loading) {
    return (
      <section className="bg-pause-gray-dark py-12 md:py-16 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-pause-orange border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-gray-400 mt-4">Lade Actions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative bg-[#030305] py-8 md:py-12 pt-20 md:pt-28 overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-headline text-3xl md:text-4xl text-white mb-2">
            Werde jetzt aktiv
          </h1>
          <p className="font-body text-gray-400 text-base md:text-lg">
            Mit diesen Aktionen kannst du unsere Bewegung voranbringen.
          </p>
        </div>

        {/* Login prompt if not logged in */}
        {!session && (
          <div className="mb-6 text-center flex flex-wrap items-center justify-center gap-4 p-4 rounded-xl bg-[#1e1e2e]/50 border border-[#FF9416]/20 backdrop-blur-sm">
            <span className="font-body text-gray-300">
              Wenn du willst, kannst du dich mit Discord einloggen, um deine Fortschritte zu speichern und Punkte zu sammeln.
            </span>
            <button
              onClick={() => signIn("discord")}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-4 py-2 transition-all hover:scale-105"
            >
              <DiscordIcon />
              Login
            </button>
          </div>
        )}

        {/* User info if logged in */}
        {session && (
          <div className="mb-6 flex flex-wrap justify-center items-center gap-4 p-4 rounded-xl bg-[#1e1e2e]/50 border border-[#FF9416]/20 backdrop-blur-sm">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Discord Avatar"
                className="w-12 h-12 rounded-full border-2 border-[#FF9416]"
              />
            )}
            <div className="flex flex-col">
              <span className="font-body text-white font-headline text-sm">
                {session.user?.name || "User"}
              </span>
              {userData && (
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs ${getRoleClass(getRoleForXp(userData.total_xp))}`}>
                    {getRoleForXp(userData.total_xp)}
                  </span>
                  <span className="font-body text-[#FF9416] text-sm font-bold">
                    {userData.total_xp} XP
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/action' })}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-4 py-2 text-sm transition-all hover:scale-105"
            >
              <DiscordIcon size="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        {/* SVG Container with enhanced styling */}
        <div className="relative rounded-xl overflow-hidden border-2 border-[#FF9416]/30 shadow-[0_0_60px_rgba(255,148,22,0.15)] hover:shadow-[0_0_80px_rgba(255,148,22,0.25)] transition-shadow duration-500" style={{ aspectRatio: "4/3" }}>
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 p-5 rounded-xl bg-[#1e1e2e]/50 border-l-4 border-[#FF9416] backdrop-blur-sm">
          <p className="font-body text-gray-300 text-sm md:text-base">
            <span className="text-[#FF9416] font-headline font-bold">Anleitung:</span> Klicke auf Aufgaben, um sie zu erledigen. Wiederholbare Aufgaben bringen dir jedes Mal Punkte. Sammle Punkte und steige in den Rollen auf, um Teil unseres Teams zu werden und PauseAI Germany aktiv mitzugestalten!
          </p>
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </section>
  );
}
