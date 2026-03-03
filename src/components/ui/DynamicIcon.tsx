"use client";

import { createElement } from "react";
import * as LucideIcons from "lucide-react";
import { Star } from "lucide-react";
import { toPascalCase } from "@/lib/icons";

// Cache for converted icon names
const iconCache = new Map<string, React.ComponentType<any>>();

/**
 * Get a Lucide icon component by name
 * @param iconName - The kebab-case icon name (e.g., "book-open", "message-circle")
 * @returns The Lucide icon component, or Star as fallback
 */
export function getLucideIcon(iconName: string): React.ComponentType<any> {
  // Check cache first
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  // Convert to PascalCase and look up in lucide-react
  const pascalName = toPascalCase(iconName);
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<any>>)[pascalName] || Star;

  // Cache for future use
  iconCache.set(iconName, IconComponent);

  return IconComponent;
}

/**
 * Dynamic icon component that renders a Lucide icon by name
 *
 * @example
 * <DynamicIcon name="book-open" className="w-6 h-6 text-orange-500" />
 */
export function DynamicIcon({
  name,
  size,
  className,
  ...props
}: {
  name: string;
  size?: number;
  className?: string;
  [key: string]: any;
}) {
  const IconComponent = getLucideIcon(name);

  return createElement(IconComponent, {
    size,
    className,
    ...props,
  });
}
