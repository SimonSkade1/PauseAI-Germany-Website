// Mapping of emojis to Lucide icon names for the action tree
export const EMOJI_TO_LUCIDE: Record<string, string> = {
  // Books & Learning
  "📖": "book-open",
  "📚": "book",
  "✏️": "pencil",
  "✍️": "pen-tool",
  "🎓": "graduation-cap",
  "💡": "lightbulb",
  "🧠": "brain",

  // Communication
  "💬": "message-circle",
  "🗣️": "megaphone",
  "📢": "megaphone",
  "📨": "message-square",
  "✉️": "mail",
  "📧": "mail",
  "📞": "phone",
  "📱": "smartphone",

  // People & Community
  "👥": "users",
  "👋": "hand",
  "🤝": "handshake",
  "🙌": "hands-clapping",
  "👏": "clap",
  "🧑‍🤝‍🧑": "users",

  // Adding people
  "➕": "user-plus",
  "🆕": "plus",

  // Events & Meetings
  "📅": "calendar",
  "📆": "calendar",
  "🗓️": "calendar-days",
  "⏰": "clock",
  "⏱️": "timer",
  "🎯": "target",
  "🏆": "trophy",
  "🏅": "award",

  // Politics & Government
  "🏛️": "landmark",
  "🏢": "building",
  "⚖️": "scale",
  "🗳️": "vote",
  "📜": "scroll-text",
  "📋": "clipboard-list",
  "📑": "file-stack",

  // Media & Content
  "📰": "newspaper",
  "📺": "tv",
  "🎬": "film",
  "🎥": "video",
  "📸": "camera",
  "🖼️": "image",
  "🎨": "palette",
  "🖌️": "paintbrush",
  "🎙️": "mic",

  // Sharing & Social
  "🔗": "link",
  "📤": "share",
  "🔁": "refresh-cw",
  "🔄": "refresh-cw",
  "↗️": "arrow-up-right",
  "🔀": "shuffle",

  // Actions & Activities
  "✅": "check-circle-2",
  "✔️": "check",
  "⭐": "star",
  "💫": "sparkles",
  "🔥": "flame",
  "💪": "arm-flex",
  "🚀": "rocket",
  "⚡": "zap",
  "🎪": "tent",

  // Places & Travel
  "📍": "map-pin",
  "🏠": "home",
  "🏘️": "home",
  "🌍": "globe",
  "🌐": "globe",
  "🗺️": "map",

  // Writing & Documents
  "📄": "file-text",
  "📃": "file",
  "🔖": "bookmark",

  // Tech & Tools
  "💻": "laptop",
  "⌨️": "keyboard",
  "🖥️": "monitor",
  "🖱️": "mouse",
  "🔧": "wrench",
  "⚙️": "settings",
  "🔨": "hammer",

  // Miscellaneous
  "❓": "help-circle",
  "‼️": "alert-circle",
  "⚠️": "alert-triangle",
  "🎉": "party-popper",
  "🎊": "confetti",
  "☕": "coffee",
  "💰": "coin",
  "🎁": "gift",
  "❤️": "heart",
  "🏳️": "flag",
  "🏴": "flag",
  "🚩": "flag",
};

/**
 * Get Lucide icon name for an emoji, or return a default
 */
export function getLucideForEmoji(emoji: string): string {
  const icon = EMOJI_TO_LUCIDE[emoji];
  if (!icon) {
    console.log("[emojiToIcon] No mapping found for emoji:", emoji);
  }
  return icon || "star";
}

/**
 * Get all emojis that have mappings
 */
export function getAllMappedEmojis(): string[] {
  return Object.keys(EMOJI_TO_LUCIDE);
}
