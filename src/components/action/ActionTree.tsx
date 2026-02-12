"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as d3 from "d3";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getRoleForXp, getRoleClass, type Task } from "@/lib/types";
import { getLucideForEmoji } from "@/lib/emojiToIcon";
import { TaskModal } from "./TaskModal";

// Color constants matching the home page aesthetic
const PAUSEAI_ORANGE = "#FF9416";
const CARD_BG = "#1e1e2e";

const LAYOUT = {
  width: 1200,
  height: 900,
  centerX: 600,
  centerY: 450,
  minRadius: 200,
  maxRadius: 700,
  nodeRadius: 35,
} as const;

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

async function preloadIcons(
  iconNames: string[],
  iconCache: Map<string, SVGElement>
): Promise<void> {
  const uniqueIcons = [...new Set(iconNames)];
  const promises = uniqueIcons.map(async (iconName) => {
    if (iconCache.has(iconName)) return;
    try {
      const url = `${LUCIDE_BASE}${iconName}.svg`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const svgText = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgText, "image/svg+xml");
      const svgElement = doc.documentElement;

      // Validate that we actually got an SVG element
      if (!(svgElement instanceof SVGElement)) {
        throw new Error("Parsed element is not an SVGElement");
      }

      iconCache.set(iconName, svgElement);
    } catch (err) {
      console.warn(`Failed to load icon: ${iconName}`, err);
    }
  });
  await Promise.all(promises);
}

// XP tier definitions with visible circles (like planets)
const XP_TIERS = [
  { maxXp: 10, radius: 200, label: "0-10" },
  { maxXp: 25, radius: 270, label: "10-25" },
  { maxXp: 50, radius: 340, label: "25-50" },
  { maxXp: 100, radius: 410, label: "50-100" },
  { maxXp: 200, radius: 480, label: "100-200" },
  { maxXp: 400, radius: 550, label: "200-400" },
  { maxXp: 600, radius: 620, label: "400-600" },
  { maxXp: Infinity, radius: 690, label: "600+" },
];

// Get consistent hash for ordering tasks within the same tier
function getTaskHash(taskId: string): number {
  let hash = 0;
  for (let i = 0; i < taskId.length; i++) {
    hash = ((hash << 5) - hash) + taskId.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Group tasks by tier and calculate positions
function calculateTierLayout(tasks: Task[]) {
  const tierGroups: Array<{ task: Task; tierIndex: number; angle: number }> = [];

  // First, group tasks by tier
  const tasksByTier: Task[][] = [];
  for (let i = 0; i < XP_TIERS.length; i++) {
    tasksByTier.push([]);
  }

  // Sort tasks by hash for consistent ordering
  const sortedTasks = [...tasks].sort((a, b) => getTaskHash(a.id) - getTaskHash(b.id));

  // Assign each task to its tier
  sortedTasks.forEach((task) => {
    for (let i = 0; i < XP_TIERS.length; i++) {
      if (task.xp <= XP_TIERS[i].maxXp) {
        tasksByTier[i].push(task);
        break;
      }
    }
  });

  // Calculate positions: evenly distribute tasks along each ring
  tasksByTier.forEach((tierTasks, tierIndex) => {
    if (tierTasks.length === 0) return;

    // Start angle offset based on tier index for visual variety
    const startAngle = (tierIndex * Math.PI) / 8;
    const angleStep = (Math.PI * 2) / tierTasks.length;

    tierTasks.forEach((task, i) => {
      const angle = startAngle + i * angleStep;
      tierGroups.push({
        task,
        tierIndex,
        angle,
      });
    });
  });

  return tierGroups;
}

// Calculate position for a task given its angle and tier radius
function getPositionForTier(angle: number, tierRadius: number) {
  const { centerX, centerY } = LAYOUT;
  const x = centerX + tierRadius * Math.cos(angle);
  const y = centerY + tierRadius * Math.sin(angle);
  return { x, y };
}

export function ActionTree() {
  const { data: session, status: sessionStatus } = useSession();
  const svgRef = useRef<SVGSVGElement>(null);
  // Icon cache stored in ref to persist across renders without causing re-renders
  const iconCacheRef = useRef<Map<string, SVGElement>>(new Map());

  // Get tasks from Notion
  const getTasks = useAction(api.notion.getTasks);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userData = useQuery(
    api.users.getMe,
    session?.user?.discordId ? { discordId: session.user.discordId } : "skip"
  );

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);

  const isSessionLoading = sessionStatus === "loading";

  // Fetch tasks from Notion
  useEffect(() => {
    getTasks()
      .then((notionTasks: Task[]) => {
        // Add Lucide icon mapping to each task
        const tasksWithIcons = notionTasks.map((t) => ({
          ...t,
          icon: getLucideForEmoji(t.emoji),
        }));
        setTasks(tasksWithIcons);

        // Preload icons
        const iconNames = tasksWithIcons.map((t) => t.icon);
        return preloadIcons(iconNames, iconCacheRef.current);
      })
      .then(() => {
        setIconsLoaded(true);
      })
      .catch((err) => {
        console.error("Failed to load tasks from Notion:", err);
        setError("Failed to load tasks. Please try again later.");
        setTasks([]);
        setIconsLoaded(true);
      })
      .finally(() => setLoadingTasks(false));
  }, [getTasks]);

  const totalXp = userData?.total_xp ?? 0;

  // Draw the tree using D3
  useEffect(() => {
    if (!svgRef.current || !iconsLoaded || tasks.length === 0) return;

    // Create completedTasks Set inside useEffect to always get fresh data
    const completedTasks = new Set(userData?.completed_tasks || []);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height, centerX, centerY } = LAYOUT;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");

    // Calculate overall glow based on completed tasks
    const glowIntensity = tasks.length > 0
      ? Math.min(tasks.filter((t) => completedTasks.has(t.id)).length / tasks.length, 1)
      : 0;
    const completedTaskCount = Array.from(completedTasks).filter(id =>
      tasks.some(t => t.id === id)
    ).length;

    // === FILTERS ===

    // Radial gradient for completed task glow
    const completedTaskGradient = defs.append("radialGradient")
      .attr("id", "completed-task-glow")
      .attr("cx", "0")
      .attr("cy", "0")
      .attr("r", "35")
      .attr("gradientUnits", "userSpaceOnUse");

    completedTaskGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.8);

    completedTaskGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0);

    // Gradient for connection lines (center to node)
    const lineGradient = defs.append("linearGradient")
      .attr("id", "line-gradient")
      .attr("gradientUnits", "userSpaceOnUse");

    lineGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.8);

    lineGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.1);

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

    // Setup zoom behavior
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

    // === PARTICLE SYSTEM ===

    const particlesGroup = backgroundGroup.append("g").attr("class", "particles");

    // Base star particles
    const baseStarCount = 80;
    for (let i = 0; i < baseStarCount; i++) {
      const px = Math.random() * width;
      const py = Math.random() * height;
      const size = Math.random() * 1.5 + 0.3;

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

    // Energy particles for completed tasks
    const energyParticleCount = completedTaskCount * 3;
    for (let i = 0; i < energyParticleCount; i++) {
      const angle = (i / energyParticleCount) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 80 + Math.random() * 450;
      const px = centerX + Math.cos(angle) * distance;
      const py = centerY + Math.sin(angle) * distance;
      const size = Math.random() * 2.5 + 0.8;

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
    }

    // === DRAW TIER CIRCLES ===

    XP_TIERS.forEach((tier, tierIndex) => {
      mainGroup.append("circle")
        .attr("class", `tier-circle tier-${tierIndex}`)
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", tier.radius)
        .attr("fill", "none")
        .attr("stroke", PAUSEAI_ORANGE)
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.15)
        .attr("stroke-dasharray", "3,3");
    });

    // === DRAW TASK NODES ===

    // Calculate tier layout
    const tierLayout = calculateTierLayout(tasks);

    // Connection lines from center to completed tasks
    tierLayout
      .filter(item => completedTasks.has(item.task.id))
      .forEach(item => {
        const pos = getPositionForTier(item.angle, XP_TIERS[item.tierIndex].radius);

        // Create unique gradient for this line
        const gradientId = `line-gradient-${item.task.id}`;
        const gradient = defs.append("linearGradient")
          .attr("id", gradientId)
          .attr("gradientUnits", "userSpaceOnUse")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", pos.x)
          .attr("y2", pos.y);

        gradient.append("stop")
          .attr("offset", "0%")
          .attr("stop-color", PAUSEAI_ORANGE)
          .attr("stop-opacity", 0.6);

        gradient.append("stop")
          .attr("offset", "100%")
          .attr("stop-color", PAUSEAI_ORANGE)
          .attr("stop-opacity", 0);

        mainGroup.append("line")
          .attr("x1", centerX)
          .attr("y1", centerY)
          .attr("x2", pos.x)
          .attr("y2", pos.y)
          .attr("stroke", `url(#${gradientId})`)
          .attr("stroke-width", 2)
          .attr("stroke-linecap", "round");
      });

    // Draw task nodes
    tierLayout.forEach((item) => {
      const task = item.task;
      const isCompleted = completedTasks.has(task.id);
      const pos = getPositionForTier(item.angle, XP_TIERS[item.tierIndex].radius);

      const group = mainGroup.append("g")
        .attr("class", "node-group")
        .attr("transform", `translate(${pos.x}, ${pos.y})`)
        .style("cursor", "pointer");

      // Transparent click area (larger than icon for easier clicking)
      group.append("circle")
        .attr("class", "click-area")
        .attr("r", 25)
        .attr("fill", "transparent")
        .style("pointer-events", "all");

      // Glow effect for completed tasks
      if (isCompleted) {
        group.append("circle")
          .attr("class", "glow-bg")
          .attr("r", 35)
          .attr("fill", "url(#completed-task-glow)");
      }

      if (!task.icon) return;

      const cachedIcon = iconCacheRef.current.get(task.icon);
      const iconSize = 36;

      if (cachedIcon) {
        const clonedIcon = group.node()!.appendChild(cachedIcon.cloneNode(true) as SVGElement);
        d3.select(clonedIcon)
          .attr("class", "task-icon")
          .attr("width", iconSize)
          .attr("height", iconSize)
          .attr("x", -iconSize / 2)
          .attr("y", -iconSize / 2)
          .selectAll("*")
          .attr("fill", "none")
          .attr("stroke", isCompleted ? PAUSEAI_ORANGE : "#666666")
          .attr("stroke-width", "2");
      }

      // Hover effect
      group.on("mouseenter", function () {
        d3.select(this).select(".task-icon")
          .transition()
          .duration(150)
          .attr("transform", "scale(1.1)");

        if (isCompleted) {
          d3.select(this).select(".glow-bg")
            .transition()
            .duration(150)
            .attr("opacity", 0.9);
        }
      });

      group.on("mouseleave", function () {
        d3.select(this).select(".task-icon")
          .transition()
          .duration(150)
          .attr("transform", "scale(1)");

        if (isCompleted) {
          d3.select(this).select(".glow-bg")
            .transition()
            .duration(150)
            .attr("opacity", 1);
        }
      });

      // Click handler
      group.on("click", (event) => {
        event.stopPropagation();
        setSelectedTask(task);
      });
    });

    // === USER AVATAR (drawn after lines to appear on top) ===

    const userGroup = mainGroup.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Outer glow ring
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
      const userIcon = iconCacheRef.current.get("user");
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

    // === LEGEND ===
    const legendGroup = svg.append("g")
      .attr("transform", `translate(50, ${LAYOUT.height - 30})`);

    const legendItems = [
      { color: PAUSEAI_ORANGE, label: "Erledigt", glow: true },
      { color: "#666666", label: "Verfügbar", glow: false }
    ];

    let xOffset = 0;
    legendItems.forEach((item) => {
      if (item.glow) {
        legendGroup.append("circle")
          .attr("cx", xOffset + 6)
          .attr("cy", 0)
          .attr("r", 11)
          .attr("fill", PAUSEAI_ORANGE)
          .attr("opacity", 0.2)
          .attr("filter", "url(#ambient-glow)");
      }

      legendGroup.append("circle")
        .attr("cx", xOffset + 6)
        .attr("cy", 0)
        .attr("r", 6)
        .attr("fill", item.color);

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
  }, [tasks, userData?.completed_tasks, totalXp, iconsLoaded, session?.user?.image]);

  const loading = loadingTasks || !iconsLoaded || isSessionLoading;

  // Show error state
  if (error) {
    return (
      <section className="bg-pause-gray-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <p className="font-body text-red-400 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#FF9416] hover:bg-[#e08314] text-white font-headline px-6 py-2 transition-all hover:scale-105"
          >
            Erneut versuchen
          </button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="bg-pause-gray-dark min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          {/* Pause icon loading animation */}
          <svg
            className="w-24 h-24"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="50" cy="50" rx="45" ry="45" fill="#FF9416" opacity="0.15" className="animate-pulse" />
            <rect
              x="28"
              y="30"
              width="16"
              height="40"
              rx="2"
              fill="#FF9416"
              className="animate-pulse"
              style={{ animationDelay: '0ms' }}
            />
            <rect
              x="56"
              y="30"
              width="16"
              height="40"
              rx="2"
              fill="#FF9416"
              className="animate-pulse"
              style={{ animationDelay: '150ms' }}
            />
          </svg>
          <p className="font-body text-gray-400 mt-6 text-lg">Lade Aktionen...</p>
        </div>
      </section>
    );
  }

  if (tasks.length === 0) {
    return (
      <section className="bg-pause-gray-dark py-12 md:py-16 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-body text-gray-400">Keine Aufgaben gefunden.</p>
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
            Mit diesen Aktionen kannst du PauseAI voranbringen. Je weiter die Aktion vom Zentrum entfernt ist, desto schwieriger ist sie.
          </p>
        </div>

        {/* Login prompt if not logged in */}
        {!session && (
          <div className="mb-6 text-center flex flex-wrap items-center justify-center gap-4 p-4 bg-[#1e1e2e]/50 border border-[#FF9416]/20 backdrop-blur-sm">
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
          <div className="mb-6 flex flex-wrap justify-center items-center gap-4 p-4 bg-[#1e1e2e]/50 border border-[#FF9416]/20 backdrop-blur-sm">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Discord Avatar"
                className="w-12 h-12 border-2 border-[#FF9416]"
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

        {/* SVG Container */}
        <div className="relative overflow-hidden border-2 border-[#FF9416]/30 shadow-[0_0_60px_rgba(255,148,22,0.15)] hover:shadow-[0_0_80px_rgba(255,148,22,0.25)] transition-shadow duration-500" style={{ aspectRatio: "4/3" }}>
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 p-5 bg-[#1e1e2e]/50 border-l-4 border-[#FF9416] backdrop-blur-sm">
          <p className="font-body text-gray-300 text-sm md:text-base">
            <span className="text-[#FF9416] font-headline font-bold">Anleitung:</span> Klicke auf Aufgaben, um sie zu erledigen. Sammle Punkte und steige in den Rollen auf, um Teil unseres Teams zu werden und PauseAI Germany aktiv mitzugestalten!
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
