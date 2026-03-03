"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Task } from "@/lib/types";
import { DynamicIcon } from "@/components/ui/DynamicIcon";

interface NotionBlock {
  type: string;
  plainText?: string;
  text?: Array<{ content: string; annotations?: any; href?: string }>;
  checked?: boolean;
  icon?: string;
  language?: string;
}

interface TaskModalProps {
  task: Task | null;
  completedTasks?: string[];
  onClose: () => void;
}

function renderNotionBlock(block: NotionBlock, index: number) {
  const baseClasses = "font-body text-gray-300 leading-relaxed mb-4";

  switch (block.type) {
    case "paragraph":
      return (
        <p key={index} className={baseClasses}>
          {renderInlineContent(block.text)}
        </p>
      );

    case "heading_1":
      return (
        <h1 key={index} className="font-headline text-2xl text-white font-bold mt-8 mb-4 tracking-wide">
          {block.plainText}
        </h1>
      );

    case "heading_2":
      return (
        <h2 key={index} className="font-headline text-xl text-white font-bold mt-6 mb-3 tracking-wide">
          {block.plainText}
        </h2>
      );

    case "heading_3":
      return (
        <h3 key={index} className="font-headline text-lg text-white font-semibold mt-5 mb-3 tracking-wide">
          {block.plainText}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li key={index} className="font-body text-gray-300 ml-6 mb-2 list-disc leading-relaxed">
          {renderInlineContent(block.text)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li key={index} className="font-body text-gray-300 ml-6 mb-2 list-decimal leading-relaxed">
          {renderInlineContent(block.text)}
        </li>
      );

    case "to_do":
      return (
        <div key={index} className="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            checked={block.checked || false}
            readOnly
            className="mt-1.5 w-4 h-4 rounded border-gray-600 bg-transparent text-[#FF9416] focus:ring-[#FF9416] focus:ring-offset-0"
          />
          <span className="font-body text-gray-300 flex-1 leading-relaxed">
            {renderInlineContent(block.text)}
          </span>
        </div>
      );

    case "quote":
      return (
        <blockquote key={index} className="border-l-4 border-[#FF9416] pl-5 py-3 my-5 italic text-gray-300 bg-[#FF9416]/5 rounded-r">
          {renderInlineContent(block.text)}
        </blockquote>
      );

    case "callout":
      return (
        <div key={index} className="bg-[#FF9416]/10 border border-[#FF9416]/30 rounded-lg p-5 my-4 flex items-start gap-3">
          {block.icon && <span className="text-2xl flex-shrink-0">{block.icon}</span>}
          <p className="font-body text-gray-200 flex-1 leading-relaxed">{renderInlineContent(block.text)}</p>
        </div>
      );

    case "code":
      return (
        <pre key={index} className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-4 my-4 overflow-x-auto">
          <code className="font-mono text-sm text-gray-300">{block.plainText}</code>
        </pre>
      );

    case "divider":
      return <hr key={index} className="border-gray-700 my-6" />;

    case "toggle":
      return (
        <details key={index} className="mb-4 group">
          <summary className="cursor-pointer font-body text-[#FF9416] hover:text-[#FF9416]/80 transition-colors">
            {block.plainText}
          </summary>
        </details>
      );

    default:
      return null;
  }
}

function renderInlineContent(texts?: Array<{ content: string; annotations?: any; href?: string }>) {
  if (!texts) return null;

  return texts.map((text, i) => {
    const { content, annotations, href } = text;

    let element = <span key={i}>{content}</span>;

    // Apply text styles based on annotations
    if (annotations) {
      let className = "";
      const style: React.CSSProperties = {};

      if (annotations.bold) className += " font-bold";
      if (annotations.italic) className += " italic";
      if (annotations.underline) style.textDecoration = "underline";
      if (annotations.strikethrough) style.textDecoration = "line-through";
      if (annotations.code) {
        return (
          <code key={i} className="bg-[#0a0a0a] px-2 py-0.5 rounded text-sm text-[#FF9416] font-mono">
            {content}
          </code>
        );
      }
      if (annotations.color && annotations.color !== "default") {
        className += ` text-${annotations.color}`;
      }

      if (className) {
        element = <span key={i} className={className.trim() || undefined} style={style}>{content}</span>;
      } else if (Object.keys(style).length > 0) {
        element = <span key={i} style={style}>{content}</span>;
      }
    }

    // Wrap in link if href exists
    if (href) {
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#FF9416] hover:text-[#FFAB76] underline underline-offset-2 transition-colors"
        >
          {element}
        </a>
      );
    }

    return element;
  });
}

export function TaskModal({ task, completedTasks = [], onClose }: TaskModalProps) {
  const { data: session } = useSession();
  const completeTask = useMutation(api.completions.completeTask);
  const assignRole = useAction(api.discord.assignRole);
  const notifyTaskComplete = useAction(api.discord.notifyTaskComplete);
  const getPageContent = useAction(api.notion.getPageContent);

  const [comment, setComment] = useState("");
  const [shareOnDiscord, setShareOnDiscord] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notionContent, setNotionContent] = useState<NotionBlock[] | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  // Check if task is already completed and not repeatable
  const isCompleted = task?.id ? completedTasks.includes(task.id) : false;
  const isTaskCompletedAndNotRepeatable = isCompleted && !task?.repeatable;

  useEffect(() => {
    if (task?.id) {
      setIsLoadingContent(true);
      getPageContent({ pageId: task.id })
        .then((content: Record<string, any>[]) => {
          setNotionContent(content as NotionBlock[]);
        })
        .catch((err) => {
          console.error("Failed to load Notion content:", err);
        })
        .finally(() => setIsLoadingContent(false));
    }
  }, [task?.id, getPageContent]);

  if (!task) return null;

  const isLoggedIn = !!session;

  const handleSubmit = async () => {
    if (!isLoggedIn || !session.user.discordId) {
      signIn("discord");
      return;
    }

    // Validate comment if required
    if (task.kommentarNoetig && comment.length < 100) {
      setError("Bitte füge einen Kommentar mit mindestens 100 Zeichen hinzu.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeTask({
        taskId: task.id,
        discordId: session.user.discordId,
        discordName: session.user.name || "Unknown",
        xp: task.xp,
        comment: comment || undefined,
        repeatable: task.repeatable,
      });

      // Only notify in Discord if user opted in
      if (shareOnDiscord) {
        await notifyTaskComplete({
          discordId: session.user.discordId,
          discordName: session.user.name || "Unknown",
          taskName: task.name,
          xp: result.xpEarned,
          totalXp: result.totalXp,
          comment: comment || undefined,
        });
      }

      await assignRole({
        discordId: session.user.discordId,
        oldXp: result.oldXp,
        newXp: result.totalXp,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Fehler beim Speichern");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-[#1e1e2e] to-[#141414] p-6 md:p-8 max-w-3xl w-full border-2 border-[#FF9416] shadow-[0_0_60px_rgba(255,148,22,0.3)] my-8 max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9416]/10 to-[#FF6B9D]/10 pointer-events-none"></div>

        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-4 relative flex-shrink-0">
          <div className="w-12 h-12 bg-[#FF9416]/20 flex items-center justify-center border border-[#FF9416]/50 flex-shrink-0">
            <DynamicIcon name={task.icon || "star"} className="w-6 h-6 text-[#FF9416]" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-headline text-xl md:text-2xl text-white uppercase">{task.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 flex-shrink-0"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-4 text-sm relative flex items-center gap-2 flex-shrink-0">
          <span className="px-3 py-1 bg-[#FF9416]/20 text-[#FF9416] font-body-bold border border-[#FF9416]/30">
            +{task.xp} XP
          </span>
          {task.wichtig && (
            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 font-body-bold border border-yellow-500/30">
              Wichtig
            </span>
          )}
          {task.repeatable && (
            <span className="px-3 py-1 bg-orange-500/20 text-orange-400 font-body-bold border border-orange-500/30">
              Wiederholbar
            </span>
          )}
          {task.kommentarNoetig && (
            <span className="px-3 py-1 bg-red-500/20 text-red-400 font-body-bold border border-red-500/30">
              Kommentar erforderlich
            </span>
          )}
        </div>

        {/* Notion Content Section */}
        <div className="flex-1 overflow-y-auto pr-2 relative mb-6 min-h-0 modal-content-scroll">
          {isLoadingContent ? (
            <div className="flex items-center justify-center py-8">
              <div className="flex flex-col items-center gap-4">
                {/* Pause icon loading animation */}
                <svg
                  className="w-16 h-16"
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
                <span className="text-gray-400 text-sm">Lade Inhalt...</span>
              </div>
            </div>
          ) : notionContent && notionContent.length > 0 ? (
            <div className="space-y-1">
              {notionContent.map((block, index) => renderNotionBlock(block, index))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">Keine zusätzlichen Informationen verfügbar.</p>
          )}
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-6 relative flex-shrink-0">
            <p className="font-body text-gray-300 mb-4">
              Logge dich mit Discord ein, um diese Aufgabe als erledigt zu markieren und Punkte zu sammeln!
            </p>
            <button
              onClick={() => signIn("discord")}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-6 py-3 transition-all uppercase tracking-wider hover:scale-105"
            >
              Login mit Discord
            </button>
          </div>
        ) : (
          <>
            <div className="relative flex-shrink-0 mb-4">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={task.kommentarNoetig
                  ? "Bitte beschreibe kurz was du gemacht hast (min. 100 Zeichen)..."
                  : "Optional: Beschreibe kurz was du gemacht hast..."
                }
                className={`w-full px-4 py-3 bg-[#0a0a0a] text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#FF9416] resize-y min-h-[80px] font-body transition-all ${
                  task.kommentarNoetig && comment.length > 0 && comment.length < 100
                    ? "border-red-500"
                    : "border-gray-700"
                } focus:border-[#FF9416]`}
              />
              {task.kommentarNoetig && (
                <div className={`absolute bottom-2 right-2 text-xs font-body ${
                  comment.length >= 100 ? "text-green-400" : "text-gray-500"
                }`}>
                  {comment.length}/100
                </div>
              )}
            </div>

            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={shareOnDiscord}
                onChange={(e) => setShareOnDiscord(e.target.checked)}
                className="w-4 h-4 rounded border-gray-600 accent-[#FF9416]"
              />
              <span className="font-body text-gray-300 text-sm group-hover:text-gray-200 transition-colors">
                Aufgabe inklusive Kommentar im Discord teilen
              </span>
            </label>

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-300 text-sm font-body relative">
                {error}
              </div>
            )}

            <div className="flex gap-3 relative flex-shrink-0">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-2 border-gray-600 text-gray-400 font-headline py-3 px-6 hover:border-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || isTaskCompletedAndNotRepeatable || (task.kommentarNoetig && comment.length < 100)}
                className="flex-1 bg-gradient-to-r from-[#FF9416] to-[#FFAB76] text-white font-headline py-3 px-6 hover:from-[#e88510] hover:to-[#FF9416] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_20px_rgba(255,148,22,0.4)]"
              >
                {isSubmitting
                  ? "Wird gespeichert..."
                  : isTaskCompletedAndNotRepeatable
                    ? "Bereits erledigt"
                    : task.kommentarNoetig && comment.length < 100
                      ? `Noch ${100 - comment.length} Zeichen...`
                      : "Erledigt!"
                }
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
