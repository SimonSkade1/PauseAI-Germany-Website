"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Task } from "@/lib/types";

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const { data: session } = useSession();
  const completeTask = useMutation(api.tasks.complete);
  const assignRole = useAction(api.discord.assignRole);
  const notifyTaskComplete = useAction(api.discord.notifyTaskComplete);

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!task) return null;

  const isLoggedIn = !!session;

  const handleSubmit = async () => {
    if (!isLoggedIn || !session.user.discordId) {
      signIn("discord");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await completeTask({
        taskId: task.id,
        discordId: session.user.discordId,
        discordName: session.user.name || "Unknown",
        comment: comment || undefined,
      });

      // Send Discord notification
      await notifyTaskComplete({
        discordId: session.user.discordId,
        discordName: session.user.name || "Unknown",
        taskName: result.taskName,
        xp: result.xpEarned,
        totalXp: result.totalXp,
        comment: comment || undefined,
      });

      // Assign role if threshold crossed
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
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-up"
      onClick={onClose}
    >
      <div
        className="relative bg-gradient-to-br from-[#1e1e2e] to-[#141414] p-6 md:p-8 max-w-md w-full border-2 border-[#FF9416] shadow-[0_0_60px_rgba(255,148,22,0.3)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF9416]/10 to-[#FF6B9D]/10 pointer-events-none"></div>

        {/* Header with icon */}
        <div className="flex items-start gap-4 mb-4 relative">
          <div className="w-12 h-12 bg-[#FF9416]/20 flex items-center justify-center border border-[#FF9416]/50">
            <svg className="w-6 h-6 text-[#FF9416]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h2 className="font-headline text-xl text-white uppercase">{task.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex gap-4 mb-4 text-sm relative">
          <span className="px-3 py-1 bg-[#FF9416]/20 text-[#FF9416] font-body-bold border border-[#FF9416]/30">
            +{task.xp} XP
          </span>
          <span className="px-3 py-1 bg-gray-700/50 text-gray-300 font-body border border-gray-600/30">
            {task.repeatable ? "Wiederholbar" : "Einmalig"}
          </span>
        </div>

        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 p-4 bg-[#0a0a0a] border-l-4 border-[#FF9416] text-gray-300 font-body text-sm hover:bg-[#151515] hover:border-[#FF6B9D] transition-all group"
          >
            <span className="text-[#FF9416] font-headline uppercase text-xs">Mehr Infos:</span> Hier erfährst du mehr über diese Aufgabe und erhältst Tipps.
            <span className="ml-2 text-[#FF9416] group-hover:translate-x-1 inline-block transition-transform">→</span>
          </a>
        )}

        {!isLoggedIn ? (
          <div className="text-center py-6 relative">
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
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Optional: Beschreibe kurz was du gemacht hast..."
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9416] focus:ring-1 focus:ring-[#FF9416] resize-y min-h-[80px] mb-4 font-body transition-all"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-300 text-sm font-body">
                {error}
              </div>
            )}

            <div className="flex gap-3 relative">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border-2 border-gray-600 text-gray-400 font-headline py-3 px-6 hover:border-gray-500 hover:text-gray-300 transition-colors disabled:opacity-50 uppercase tracking-wider"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#FF9416] to-[#FFAB76] text-white font-headline py-3 px-6 hover:from-[#e88510] hover:to-[#FF9416] transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_20px_rgba(255,148,22,0.4)]"
              >
                {isSubmitting ? "Wird gespeichert..." : "Erledigt!"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
