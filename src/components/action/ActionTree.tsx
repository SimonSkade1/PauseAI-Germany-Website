"use client";

import { useEffect, useRef, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import * as d3 from "d3";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getRoleForXp, getRoleClass } from "@/lib/types";
import { TaskModal } from "./TaskModal";

// Use CSS variables from globals.css
const PAUSEAI_ORANGE = "var(--pause-orange)";
const DARK_BG = "var(--pause-gray-dark)";
const CARD_BG = "#1e1e2e";

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
  const { data: session, status: sessionStatus } = useSession();
  const svgRef = useRef<SVGSVGElement>(null);

  // Convex queries
  const tasks = useQuery(api.tasks.list);
  const userData = useQuery(
    api.users.getMe,
    session?.user?.discordId ? { discordId: session.user.discordId } : "skip"
  );

  const [selectedTask, setSelectedTask] = useState<{
    _id: string;
    _creationTime: number;
    id: string;
    name: string;
    path: "onboarding" | "outreach" | "lobbying" | "special";
    level: number;
    xp: number;
    icon: string;
    repeatable: boolean;
    link?: string;
  } | null>(null);
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
  const calculateOverallGlow = () => {
    if (!tasks || tasks.length === 0) return 0;
    const mainTasks = tasks.filter((t: typeof tasks[number]) => t.path !== "special");
    const completedCount = mainTasks.filter((t: typeof tasks[number]) => completedTasks.has(t.id)).length;
    return Math.min(completedCount / mainTasks.length, 1);
  };

  // Draw the tree using D3
  useEffect(() => {
    if (!svgRef.current || !iconsLoaded || !tasks) return;

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
        .attr("stroke", ["#4a4a4a", "#3a3a3a", "#2a2a2a", "#1a1a1a"][level])
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

    // Discord profile image or fallback icon
    if (session?.user?.image) {
      // Use Discord avatar as clipPath
      const defs = userGroup.append("defs");
      const clipId = `avatar-clip-${centerX}-${centerY}`;
      defs.append("clipPath")
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
      // Fallback to user icon
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
      .attr("y", 65)
      .attr("fill", "white")
      .attr("font-size", "14px")
      .attr("font-weight", "bold")
      .text(`${totalXp} XP`);

    // Draw tasks by level
    for (let level = 0; level <= 3; level++) {
      const radius = circleRadii[level as keyof typeof circleRadii];
      const levelTasks = tasks.filter((t: typeof tasks[number]) => t.level === level && t.path !== "special");

      if (levelTasks.length === 0) continue;

      const angleStep = (2 * Math.PI) / levelTasks.length;
      const startAngle = -Math.PI / 2;

      levelTasks.forEach((task: typeof tasks[number], index: number) => {
        const angle = startAngle + index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const isCompleted = completedTasks.has(task.id);
        const status = isCompleted ? "completed" : "available";

        const colors = {
          completed: PAUSEAI_ORANGE,
          available: "#4a4a4a",
          locked: "#2a2a2a"
        };

        const group = zoomLayer.append("g")
          .attr("transform", `translate(${x}, ${y})`)
          .style("cursor", "pointer")
          .on("click", () => setSelectedTask(task as typeof selectedTask));

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
          .attr("fill", "white")
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
      { color: "#888888", label: "Verfügbar" }
    ];

    // Check if mobile viewport for responsive legend
    const isMobile = window.innerWidth < 640;
    const legendSpacing = isMobile ? 140 : 140;
    const legendFontSize = isMobile ? 22 : 14;
    const legendCircleSize = isMobile ? 8 : 10;

    legendItems.forEach((item, i) => {
      legend.append("circle")
        .attr("cx", i * legendSpacing)
        .attr("cy", 0)
        .attr("r", legendCircleSize)
        .attr("fill", item.color);

      legend.append("text")
        .attr("x", i * legendSpacing + 18)
        .attr("y", isMobile ? 4 : 5)
        .attr("fill", "white")
        .attr("font-size", `${legendFontSize}px`)
        .attr("font-weight", "500")
        .text(item.label);
    });

  }, [tasks, completedTasks, totalXp, iconsLoaded]);

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
    <section className="bg-pause-gray-dark py-8 md:py-12 pt-20 md:pt-28">
      <div className="max-w-6xl mx-auto px-6">
        {/* Login prompt if not logged in */}
        {!session && (
          <div className="mb-6 text-center flex items-center justify-center gap-4">
            <span className="font-body text-gray-300">
              Logge dich mit Discord ein, um Aufgaben zu erledigen und Punkte zu sammeln
            </span>
            <button
              onClick={() => signIn("discord")}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-4 py-2 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Login
            </button>
          </div>
        )}

        {/* User info if logged in */}
        {session && (
          <div className="mb-6 flex flex-wrap justify-center items-center gap-4">
            {session.user?.image && (
              <img
                src={session.user.image}
                alt="Discord Avatar"
                className="w-10 h-10 rounded-full"
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
                  <span className="font-body text-pause-orange text-sm">
                    {userData.total_xp} XP
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/action' })}
              className="flex items-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-4 py-2 text-sm transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              Logout
            </button>
          </div>
        )}

        {/* SVG Container */}
        <div className="bg-[#1e1e2e] overflow-hidden border-2 border-pause-orange relative" style={{ aspectRatio: "4/3" }}>
          <svg
            ref={svgRef}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 p-4 border-l-2 border-pause-orange">
          <p className="font-body text-gray-300 text-sm md:text-base">
            <span className="text-pause-orange font-headline">Anleitung:</span> Klicke auf Aufgaben, um sie zu erledigen. Wiederholbare Aufgaben bringen dir jedes Mal Punkte. Sammle Punkte und steige in den Rollen auf, um Teil unseres Teams zu werden und PauseAI Germany aktiv mitzugestalten!
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
