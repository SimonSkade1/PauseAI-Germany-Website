import React from "react";

// ============================================
// DESIGN CONFIGURATION - Adjust these values
// ============================================
const CONFIG = {
  // Icon dimensions
  iconWidth: 22,           // Total width of the pause icon (px)
  iconHeight: 30,          // Total height of the pause icon (px)
  
  // Pause bar proportions (relative to icon dimensions)
  barWidthRatio: 0.35,      // Width of each bar as ratio of iconWidth (0.3 = 30%)
  barGapRatio: 0.3,        // Gap between bars as ratio of iconWidth (0.4 = 40%)
  
  // Lattice spacing
  cellSize: 80,            // Distance between icon centers (px)
  
  // Colors
  iconColor: "#0000000f",    // Light grey for pause icons (more visible)
  backgroundColor: "#f5f5f5", // White background
};
// ============================================

interface PauseIconLatticeProps {
  width?: string;
  height?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function PauseIconLattice({
  width = "100%",
  height = "100%",
  className = "",
  children,
}: PauseIconLatticeProps) {
  const {
    iconWidth,
    iconHeight,
    barWidthRatio,
    barGapRatio,
    cellSize,
    iconColor,
    backgroundColor,
  } = CONFIG;

  // Calculate bar dimensions
  const barWidth = iconWidth * barWidthRatio;
  const barGap = iconWidth * barGapRatio;
  
  // Calculate bar positions (centered within icon)
  const totalBarsWidth = barWidth * 2 + barGap;
  const startX = (iconWidth - totalBarsWidth) / 2;
  const bar1X = startX;
  const bar2X = startX + barWidth + barGap;
  
  // Center icon in cell
  const iconOffsetX = (cellSize - iconWidth) / 2;
  const iconOffsetY = (cellSize - iconHeight) / 2;

  // Create SVG pattern for the lattice
  const patternId = "pause-icon-pattern";
  
  return (
    <div
      className={className}
      style={{
        backgroundColor,
      }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMinYMin"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={cellSize}
            height={cellSize}
            patternUnits="userSpaceOnUse"
          >
            {/* First bar */}
            <rect
              x={iconOffsetX + bar1X}
              y={iconOffsetY}
              width={barWidth}
              height={iconHeight}
              fill={iconColor}
              rx={barWidth * 0.15}
            />
            {/* Second bar */}
            <rect
              x={iconOffsetX + bar2X}
              y={iconOffsetY}
              width={barWidth}
              height={iconHeight}
              fill={iconColor}
              rx={barWidth * 0.15}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      
      {/* Children rendered on top of the pattern */}
      {children && (
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      )}
    </div>
  );
}
