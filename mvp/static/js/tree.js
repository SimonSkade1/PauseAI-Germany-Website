// === CONFIGURATION ===

const PAUSEAI_ORANGE = "#ff6b35";
const DARK_BG = "#0f0f1a";
const CARD_BG = "#16213e";

const LAYOUT = {
    width: 1200,
    height: 900,
    centerX: 600,
    centerY: 450,
    circleRadii: { 0: 150, 1: 300, 2: 450, 3: 600 },
    nodeRadius: 35
};

const LUCIDE_BASE = "https://unpkg.com/lucide-static@latest/icons/";

const LUCIDE_MAP = {
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
    "triple-star": "trophy"
};

const iconCache = new Map();

async function preloadIcons() {
    const uniqueIcons = [...new Set(Object.values(LUCIDE_MAP))];
    const promises = uniqueIcons.map(iconName => {
        const url = LUCIDE_BASE + iconName + ".svg";
        return d3.xml(url).then(svg => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(new XMLSerializer().serializeToString(svg.documentElement), "image/svg+xml");
            iconCache.set(iconName, doc.documentElement);
        }).catch(err => {
            console.warn(`Failed to load icon: ${iconName}`, err);
        });
    });
    await Promise.all(promises);
}

// === STATE ===

let tasks = [];
let completedTasks = [];
let userData = null;
// Track instances: { taskId: { completed: [instanceId, ...], pending: [instanceId, ...] } }
let taskInstances = {};

// === DATA LOADING ===

async function loadData() {
    try {
        const tasksResponse = await fetch("/api/tasks");
        tasks = await tasksResponse.json();

        await preloadIcons();

        try {
            const meResponse = await fetch("/api/me");
            if (meResponse.ok) {
                userData = await meResponse.json();
                completedTasks = userData.completed_tasks || [];
                // Initialize instances for repeatable tasks already completed
                initializeRepeatableInstances();
                updateUserInfo();
            }
        } catch (e) {
            console.log("Nicht eingeloggt");
        }

        drawTree();
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    }
}

function initializeRepeatableInstances() {
    const completedCounts = {};
    completedTasks.forEach(taskId => {
        completedCounts[taskId] = (completedCounts[taskId] || 0) + 1;
    });

    tasks.forEach(task => {
        if (task.repeatable && completedCounts[task.id]) {
            // For repeatable: completed instances get IDs, spawn one pending instance
            const completedIds = Array.from({ length: completedCounts[task.id] }, (_, i) => `${task.id}-${i}`);
            taskInstances[task.id] = {
                completed: completedIds,
                pending: [`${task.id}-pending`] // one pending instance
            };
        } else if (!task.repeatable && completedCounts[task.id]) {
            // For non-repeatable: just mark as completed
            taskInstances[task.id] = {
                completed: [task.id],
                pending: []
            };
        }
    });
}

function updateUserInfo() {
    const userInfo = document.getElementById("user-info");
    if (userData) {
        userInfo.innerHTML = `
            <span class="user-name">${userData.discord_name}</span>
            <span class="user-xp">${userData.total_xp} XP</span>
            <span class="user-role">${userData.role}</span>
            <a href="/auth/logout" class="logout-btn">Logout</a>
        `;
    } else {
        userInfo.innerHTML = `<a href="/auth/login" class="login-btn">Login mit Discord</a>`;
    }
}

// === TASK STATUS ===

// Get status for a specific instance (or base task for non-repeatables)
function getInstanceStatus(task, instanceId) {
    const instances = taskInstances[task.id];
    if (!instances) return "available";

    // Special tasks (moderator-only)
    if (task.path === "special") {
        return instances.completed?.length > 0 ? "completed" : "locked";
    }

    // Check if this specific instance is in completed or pending
    if (task.repeatable && instanceId) {
        if (instances.completed?.includes(instanceId)) return "completed";
        if (instances.pending?.includes(instanceId)) return "available";
    }

    // Non-repeatable: check if any instances exist
    if (!task.repeatable) {
        return instances.completed?.length > 0 ? "completed" : "available";
    }

    return "available";
}

// Legacy function for popup (checks if task has any pending instances)
function getTaskStatus(task) {
    const instances = taskInstances[task.id];

    // Special tasks (moderator-only)
    if (task.path === "special") {
        return instances?.completed?.length > 0 ? "completed" : "locked";
    }

    // Check if there's a pending instance available
    if (instances?.pending?.length > 0) return "available";

    // Non-repeatable with completion
    if (!task.repeatable && instances?.completed?.length > 0) return "completed";

    return "available";
}

// === GLOW CALCULATION ===

function calculateOverallGlow() {
    const mainTasks = tasks.filter(t => t.path !== "special");
    const totalInstances = mainTasks.reduce((sum, task) => {
        const instances = taskInstances[task.id];
        return sum + (instances?.completed?.length || 0);
    }, 0);
    return Math.min(totalInstances / mainTasks.length, 1);
}

// === DRAWING ===

function drawTree() {
    const svg = d3.select("#skill-tree");
    svg.selectAll("*").remove();

    const { width, height, centerX, centerY } = LAYOUT;
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
    const zoom = d3.zoom()
        .scaleExtent([0.3, 3])
        .on("zoom", (event) => {
            zoomLayer.attr("transform", event.transform);
        });

    svg.call(zoom);

    // Draw circles
    drawCircle(zoomLayer, 3, "#333", 1);
    drawCircle(zoomLayer, 2, "#444", 1);
    drawCircle(zoomLayer, 1, "#555", 1);
    drawCircle(zoomLayer, 0, "#666", 1);

    // Draw user avatar
    drawUserAvatar(zoomLayer, centerX, centerY);

    // Draw tasks by level
    for (let level = 0; level <= 3; level++) {
        drawLevelTasks(zoomLayer, level);
    }

    // Legend (not in zoom layer - stays fixed)
    drawLegend(svg);
}

function drawCircle(svg, level, color, strokeWidth) {
    const { centerX, centerY, circleRadii } = LAYOUT;
    const radius = circleRadii[level];

    svg.append("circle")
        .attr("cx", centerX)
        .attr("cy", centerY)
        .attr("r", radius)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", strokeWidth)
        .attr("stroke-opacity", 0.3);
}

function drawUserAvatar(svg, x, y) {
    const group = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`);

    // Background circle
    group.append("circle")
        .attr("r", 50)
        .attr("fill", PAUSEAI_ORANGE)
        .attr("opacity", 0.2);

    group.append("circle")
        .attr("r", 45)
        .attr("fill", CARD_BG)
        .attr("stroke", PAUSEAI_ORANGE)
        .attr("stroke-width", 2);

    // User icon
    const userIcon = iconCache.get("user");
    if (userIcon) {
        const clonedIcon = group.node().appendChild(userIcon.cloneNode(true));
        const iconElement = d3.select(clonedIcon)
            .attr("width", 50)
            .attr("height", 50)
            .attr("x", -25)
            .attr("y", -25);

        iconElement.selectAll("*").attr("fill", "none");
        iconElement.selectAll("*").attr("stroke", PAUSEAI_ORANGE);
        iconElement.selectAll("*").attr("stroke-width", "2");
    }

    // XP text below
    group.append("text")
        .attr("text-anchor", "middle")
        .attr("y", 65)
        .attr("fill", "#fff")
        .attr("font-size", "14px")
        .attr("font-weight", "bold")
        .text(userData ? `${userData.total_xp} XP` : "Login");
}

function drawLevelTasks(svg, level) {
    const { centerX, centerY, circleRadii } = LAYOUT;
    const radius = circleRadii[level];

    // Get regular tasks for this level (not special)
    let levelTasks = tasks.filter(t => t.level === level && t.path !== "special");

    // Add special tasks only if they have completed instances
    if (level === 1) {
        const s1 = tasks.find(t => t.id === "s1");
        if (s1 && taskInstances[s1.id]?.completed?.length > 0) levelTasks.push(s1);
    }
    if (level === 2) {
        const s2 = tasks.find(t => t.id === "s2");
        if (s2 && taskInstances[s2.id]?.completed?.length > 0) levelTasks.push(s2);
    }
    if (level === 3) {
        const s3 = tasks.find(t => t.id === "s3");
        if (s3 && taskInstances[s3.id]?.completed?.length > 0) levelTasks.push(s3);
    }

    levelTasks = levelTasks.filter(t => t);

    // Get all instances for this level (completed + pending for repeatables)
    let taskList = [];
    levelTasks.forEach(task => {
        const instances = taskInstances[task.id];
        if (instances) {
            // Add completed instances
            instances.completed?.forEach(instanceId => {
                taskList.push({ task, instanceId, status: "completed" });
            });
            // Add pending instances (repeatable tasks only)
            instances.pending?.forEach(instanceId => {
                taskList.push({ task, instanceId, status: "available" });
            });
        } else {
            // Task never completed - show as available
            taskList.push({ task, instanceId: null, status: "available" });
        }
    });

    if (taskList.length === 0) return;

    const angleStep = (2 * Math.PI) / taskList.length;
    // Start from top ( -90 degrees or -PI/2 )
    const startAngle = -Math.PI / 2;

    taskList.forEach(({ task, instanceId, status }, index) => {
        const angle = startAngle + index * angleStep;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        drawNode(svg, task, x, y, instanceId, status);
    });
}

function drawNode(svg, task, x, y, instanceId = null, status = null) {
    // If status not provided, determine it from instance
    if (status === null) {
        status = getInstanceStatus(task, instanceId);
    }
    const { nodeRadius } = LAYOUT;
    const iconSize = nodeRadius * 1.6;

    const colors = {
        completed: PAUSEAI_ORANGE,
        available: "#666",
        locked: "#444"
    };

    const group = svg.append("g")
        .attr("transform", `translate(${x}, ${y})`)
        .style("cursor", status === "locked" ? "not-allowed" : "pointer")
        .on("click", () => showPopup(task, instanceId));

    const iconName = LUCIDE_MAP[task.icon] || "star";
    const cachedIcon = iconCache.get(iconName);

    if (cachedIcon) {
        const clonedIcon = group.node().appendChild(cachedIcon.cloneNode(true));
        const iconElement = d3.select(clonedIcon)
            .attr("width", iconSize)
            .attr("height", iconSize)
            .attr("x", -iconSize / 2)
            .attr("y", -iconSize / 2 - 8);

        iconElement.selectAll("*").attr("fill", "none");
        iconElement.selectAll("*").attr("stroke", colors[status]);
        iconElement.selectAll("*").attr("stroke-width", "2");
    }

    group.append("circle")
        .attr("r", nodeRadius)
        .attr("fill", "transparent")
        .attr("style", "pointer-events: all;");

    group.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", nodeRadius - 8)
        .attr("fill", status === "locked" ? "#666" : "#fff")
        .attr("font-size", "11px")
        .attr("font-weight", "bold")
        .text(`${task.xp} XP`);

    group.on("mouseenter", function() {
        group.transition().duration(150).attr("transform", `translate(${x}, ${y}) scale(1.15)`);
    });

    group.on("mouseleave", function() {
        group.transition().duration(150).attr("transform", `translate(${x}, ${y}) scale(1)`);
    });
}

function drawLegend(svg) {
    const legend = svg.append("g")
        .attr("transform", `translate(50, ${LAYOUT.height - 40})`);

    const items = [
        { color: PAUSEAI_ORANGE, label: "Erledigt" },
        { color: "#666", label: "Verfügbar" }
    ];

    items.forEach((item, i) => {
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
}

// === POPUP ===

function showPopup(task, instanceId = null) {
    if (!userData) {
        alert("Bitte logge dich zuerst ein!");
        return;
    }

    // For repeatable tasks, only allow completing pending instances
    // For non-repeatable, check if already completed
    const instances = taskInstances[task.id];
    if (task.path === "special" || (!task.repeatable && instances?.completed?.length > 0)) {
        alert(task.path === "special"
            ? "Special Tasks können nur von Moderatoren im Discord vergeben werden."
            : "Diese Aufgabe hast du bereits erledigt.");
        return;
    }

    document.getElementById("popup-title").textContent = task.name;
    document.getElementById("popup-xp").textContent = `+${task.xp} XP`;
    document.getElementById("popup-repeatable").textContent = task.repeatable ? "🔄 Wiederholbar" : "Einmalig";

    const statusEl = document.getElementById("popup-status");
    statusEl.textContent = "";
    statusEl.style.display = "none";

    document.getElementById("popup-comment").value = "";
    document.getElementById("popup-submit").onclick = () => submitTask(task.id, instanceId);

    document.getElementById("popup").classList.add("visible");
}

function hidePopup() {
    document.getElementById("popup").classList.remove("visible");
}

async function submitTask(taskId, instanceId = null) {
    const comment = document.getElementById("popup-comment").value;
    const submitBtn = document.getElementById("popup-submit");

    submitBtn.disabled = true;
    submitBtn.textContent = "Wird gespeichert...";

    try {
        const response = await fetch("/api/complete-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ task_id: taskId, comment })
        });

        const data = await response.json();

        if (response.ok) {
            userData.total_xp = data.total_xp;
            const task = tasks.find(t => t.id === taskId);

            // Initialize instances structure if needed
            if (!taskInstances[taskId]) {
                taskInstances[taskId] = { completed: [], pending: [] };
            }

            // For repeatable tasks: move the pending instance to completed, spawn a new pending one
            if (task.repeatable) {
                // The instance we just completed
                const completedInstanceId = instanceId || `${taskId}-${Date.now()}`;
                taskInstances[taskId].completed.push(completedInstanceId);

                // Remove the pending instance we just completed
                const pendingIndex = taskInstances[taskId].pending.indexOf(instanceId);
                if (pendingIndex > -1) {
                    taskInstances[taskId].pending.splice(pendingIndex, 1);
                }

                // Spawn a new pending instance
                const newPendingId = `${taskId}-${Date.now()}`;
                taskInstances[taskId].pending.push(newPendingId);
            } else {
                // Non-repeatable: just mark as completed
                taskInstances[taskId].completed.push(taskId);
            }

            hidePopup();
            updateUserInfo();
            drawTree();

            showSuccessMessage(`+${data.xp_earned} XP! Gesamt: ${data.total_xp} XP`);
        } else {
            alert(data.detail || "Fehler beim Speichern");
        }
    } catch (error) {
        console.error("Fehler:", error);
        alert("Netzwerkfehler");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Erledigt!";
    }
}

function showSuccessMessage(text) {
    const msg = document.createElement("div");
    msg.className = "success-message";
    msg.textContent = text;
    document.body.appendChild(msg);

    setTimeout(() => msg.classList.add("visible"), 10);
    setTimeout(() => {
        msg.classList.remove("visible");
        setTimeout(() => msg.remove(), 300);
    }, 3000);
}

// === EVENT LISTENERS ===

document.getElementById("popup").addEventListener("click", (e) => {
    if (e.target.id === "popup") hidePopup();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hidePopup();
});

// === INIT ===

loadData();
