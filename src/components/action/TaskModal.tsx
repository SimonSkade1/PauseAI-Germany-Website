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
    if (!isLoggedIn) {
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
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1e1e2e] p-6 md:p-8 max-w-md w-full border-2 border-pause-orange shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-headline text-xl text-white mb-4 uppercase">{task.name}</h2>

        <div className="flex gap-4 mb-4 text-sm">
          <span className="text-pause-orange font-body-bold">+{task.xp} XP</span>
          <span className="text-gray-400 font-body">
            {task.repeatable ? "Wiederholbar" : "Einmalig"}
          </span>
        </div>

        {task.link && (
          <a
            href={task.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4 p-3 bg-[#0a0a0a] border-l-4 border-pause-orange text-gray-300 font-body text-sm hover:bg-[#151515] transition-colors"
          >
            <span className="text-pause-orange font-headline uppercase text-xs">Mehr Infos:</span> Hier erfährst du mehr über diese Aufgabe und erhältst Tipps.
          </a>
        )}

        {!isLoggedIn ? (
          <div className="text-center py-4">
            <p className="font-body text-gray-300 mb-4">
              Logge dich mit Discord ein, um diese Aufgabe zu erledigen und Punkte zu sammeln!
            </p>
            <button
              onClick={() => signIn("discord")}
              className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-headline px-6 py-3 transition-all uppercase tracking-wider"
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
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-pause-orange resize-y min-h-[80px] mb-4 font-body"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border-l-4 border-red-500 text-red-300 text-sm font-body">
                {error}
              </div>
            )}

            <div className="flex gap-3">
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
                className="flex-1 bg-pause-orange text-white font-headline py-3 px-6 hover:bg-pause-orange-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
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
