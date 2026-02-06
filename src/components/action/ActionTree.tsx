"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import * as d3 from "d3";
import { getTasks, getMe } from "@/lib/api";
import { Task, User as UserType, getRoleForXp, getRoleClass } from "@/lib/types";
import { TaskModal } from "./TaskModal";

const PAUSEAI_ORANGE = "#ff6b35";
const DARK_BG = "#0f0f1a";
const CARD_BG = "#16213e";

const LAYOUT = {
  width: 1200,
  height: 900,
  centerX: 600,
  centerY: 450,
  circleRadii: { 0: 150, 1: 300, 2: 450, 3: 600 },
  nodeRadius: 35,
};

const LUCIDE_BASE = "https://unpkg.com/lucide-static@latest/icons/";

const LUCIDE_MAP: Record<string, string> = {
  "player": "user",
  "book": "book-open",
  "conversation": "message-circle",
  "share": "share-2",
  "smartphone": "smartphone",
  "talk": "megaphone",
  "person-add": "user-plus",
  "round-table": "users",
  "podium": "presentation",
  "scroll-signed": "scroll-text",
  "envelope": "mail",
  "video-conference": "video",
  "capitol": "landmark",
  "handshake": "handshake",
  "newspaper": "newspaper",
  "star": "star",
  "double-star": "award",
  "triple-star": "trophy",
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
  const { data: session } = useSession();
  const svgRef = useRef<SVGSVGElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userData, setUserData] = useState<UserType | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [iconsLoaded, setIconsLoaded] = useState(false);

  // Load tasks and user data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Preload icons
        await preloadIcons();
        setIconsLoaded(true);

        // Load tasks
        const cookies = document.cookie;
        const tasksData = await getTasks(cookies);
        setTasks(tasksData);

        // Load user data if logged in
        if (session) {
          const userData = await getMe(cookies);
          if (userData) {
            setUserData(userData);
            setCompletedTasks(new Set(userData.completed_tasks));
          }
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [session, refreshKey]);

  // Calculate overall glow based on completed tasks
  const calculateOverallGlow = () => {
    if (tasks.length === 0) return 0;
    const mainTasks = tasks.filter(t => t.path !== "special");
    const completedCount = mainTasks.filter(t => completedTasks.has(t.id)).length;
    return Math.min(completedCount / mainTasks.length, 1);
  };

  // Draw the tree using D3
  useEffect(() => {
    if (!svgRef.current || !iconsLoaded) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height, centerX, centerY, circleRadii } = LAYOUT;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const defs = svg.append("defs");

    // Overall glow filter
    const glowIntensity = calculateOverallGlow();
    const mainFilter = defs.append("filter")
      .attr("id", "main-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    mainFilter.append("feGaussianBlur")
      .attr("stdDeviation", 5 + glowIntensity * 15)
      .attr("result", "coloredBlur");

    const filterMerge = mainFilter.append("feMerge");
    filterMerge.append("feMergeNode").attr("in", "coloredBlur");
    filterMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background gradient
    const bgGradient = defs.append("radialGradient")
      .attr("id", "bg-glow")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0.05 + glowIntensity * 0.15);

    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", PAUSEAI_ORANGE)
      .attr("stop-opacity", 0);

    // Background (not in zoom layer)
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", DARK_BG);

    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#bg-glow)");

    // Create zoom layer
    const zoomLayer = svg.append("g")
      .attr("class", "zoom-layer");

    // Setup zoom behavior on zoom layer
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on("zoom", (event) => {
        zoomLayer.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    // Draw circles (outer to inner)
    [3, 2, 1, 0].forEach((level) => {
      const radius = circleRadii[level as keyof typeof circleRadii];
      zoomLayer.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", ["#666", "#555", "#444", "#333"][level])
        .attr("stroke-width", 1)
        .attr("stroke-opacity", 0.3);
    });

    // Draw user avatar
    const userGroup = zoomLayer.append("g")
      .attr("transform", `translate(${centerX}, ${centerY})`);

    // Background circle with glow
    userGroup.append("circle")
      .attr("r", 50)
      .attr("fill", PAUSEAI_ORANGE)
      .attr("opacity", 0.2)
      .attr("filter", "url(#main-glow)");

    userGroup.append("circle")
      .attr("r", 45)
      .attr("fill", CARD_BG)
      .attr("stroke", PAUSEAI_ORANGE)
      .attr("stroke-width", 2);

    // User icon
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

    // XP text below
    userGroup.append("text")
      .attr("text-anchor", "middle")
      .attr("y", 65)
      .attr("fill", "#fff")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(userData ? `${userData.total_xp} XP` : "Login");

    // Draw tasks by level
    for (let level = 0; level <= 3; level++) {
      const radius = circleRadii[level as keyof typeof circleRadii];
      const levelTasks = tasks.filter(t => t.level === level && t.path !== "special");

      if (levelTasks.length === 0) continue;

      const angleStep = (2 * Math.PI) / levelTasks.length;
      const startAngle = -Math.PI / 2;

      levelTasks.forEach((task, index) => {
        const angle = startAngle + index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const isCompleted = completedTasks.has(task.id);
        const status = isCompleted ? "completed" : "available";

        const colors = {
          completed: PAUSEAI_ORANGE,
          available: "#666",
          locked: "#444"
        };

        const group = zoomLayer.append("g")
          .attr("transform", `translate(${x}, ${y})`)
          .style("cursor", "pointer")
          .on("click", () => setSelectedTask(task));

        const iconName = LUCIDE_MAP[task.icon] || "star";
        const cachedIcon = iconCache.get(iconName);
        const iconSize = LAYOUT.nodeRadius * 1.6;

        if (cachedIcon) {
          const clonedIcon = group.node()!.appendChild(cachedIcon.cloneNode(true) as SVGElement);
          d3.select(clonedIcon)
            .attr("width", iconSize)
            .attr("height", iconSize)
            .attr("x", -iconSize / 2)
            .attr("y", -iconSize / 2 - 8)
            .selectAll("*")
            .attr("fill", "none")
            .attr("stroke", colors[status])
            .attr("stroke-width", "2");
        }

        group.append("circle")
          .attr("r", LAYOUT.nodeRadius)
          .attr("fill", "transparent")
          .attr("style", "pointer-events: all;");

        group.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", LAYOUT.nodeRadius - 8)
          .attr("fill", "#fff")
          .attr("font-size", "11px")
          .attr("font-weight", "bold")
          .text(`${task.xp} XP`);

        // Hover animations
        group.on("mouseenter", function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("transform", `translate(${x}, ${y}) scale(1.15)`);
        });

        group.on("mouseleave", function () {
          d3.select(this)
            .transition()
            .duration(150)
            .attr("transform", `translate(${x}, ${y}) scale(1)`);
        });
      });
    }

    // Legend (not in zoom layer - stays fixed)
    const legend = svg.append("g")
      .attr("transform", `translate(50, ${LAYOUT.height - 40})`);

    const legendItems = [
      { color: PAUSEAI_ORANGE, label: "Erledigt" },
      { color: "#666", label: "Verfügbar" }
    ];

    legendItems.forEach((item, i) => {
      legend.append("circle")
        .attr("cx", i * 120)
        .attr("cy", 0)
        .attr("r", 8)
        .attr("fill", item.color);

      legend.append("text")
        .attr("x", i * 120 + 15)
        .attr("y", 5)
        .attr("fill", "#888")
        .attr("font-size", "12px")
        .text(item.label);
    });

  }, [tasks, completedTasks, userData, iconsLoaded]);

  if (loading) {
    return (
      <section className="bg-pause-gray-dark py-12 md:py-16 min-h-[600px]">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#FF9416] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-body text-gray-400 mt-4">Lade Actions...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-pause-gray-dark py-8 md:py-12 pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Login prompt if not logged in */}
        {!session && (
          <div className="mb-6 text-center">
            <button
              onClick={() => signIn("discord")}
              className="bg-[#FF9416] hover:bg-[#e08315] text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Login mit Discord, um Aufgaben zu erledigen und XP zu sammeln
            </button>
          </div>
        )}

        {/* User info if logged in */}
        {session && userData && (
          <div className="mb-6 flex justify-center items-center gap-4">
            <span className="font-body text-gray-300">
              Hi, {userData.discord_name}. Lass uns an die Arbeit!
            </span>
            <span className={`px-3 py-1 rounded-full text-sm ${getRoleClass(getRoleForXp(userData.total_xp))}`}>
              {getRoleForXp(userData.total_xp)}
            </span>
            <span className="font-body-bold text-[#FF9416]">
              {userData.total_xp} XP
            </span>
          </div>
        )}

        {/* SVG Container */}
        <div className="bg-[#16213e] rounded-xl overflow-hidden border border-gray-700 relative" style={{ aspectRatio: "4/3" }}>
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 bg-[#FF9416]/5 border border-[#FF9416]/20 rounded-lg text-center">
          <p className="font-body text-gray-300 text-sm md:text-base">
            <span className="text-[#FF9416] font-semibold">Anleitung:</span> Klicke auf die Aufgaben im Action Tree,
            um sie zu erledigen. Wiederholbare Aufgaben bringen dir jedes Mal XP.
          </p>
        </div>
      </div>

      {/* Task Modal */}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSuccess={() => setRefreshKey(prev => prev + 1)}
        />
      )}
    </section>
  );
}
