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
        className="bg-[#16213e] rounded-xl p-6 md:p-8 max-w-md w-full border border-[#FF9416] shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-section text-xl text-white mb-4">{task.name}</h2>

        <div className="flex gap-4 mb-4 text-sm">
          <span className="text-[#FF9416] font-semibold">+{task.xp} XP</span>
          <span className="text-gray-400">
            {task.repeatable ? "🔄 Wiederholbar" : "Einmalig"}
          </span>
        </div>

        {!isLoggedIn ? (
          <div className="text-center py-4">
            <p className="text-gray-300 mb-4">
              Bitte logge dich ein, um diese Aufgabe zu erledigen.
            </p>
            <button
              onClick={() => signIn("discord")}
              className="w-full bg-[#FF9416] text-white font-section py-3 px-6 rounded-lg hover:bg-[#e88510] transition-colors"
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
              className="w-full px-4 py-3 bg-[#0f0f1a] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#FF9416] resize-y min-h-[80px] mb-4"
            />

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300 text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 bg-transparent border border-gray-500 text-gray-400 font-section py-3 px-6 rounded-lg hover:border-gray-400 hover:text-gray-300 transition-colors disabled:opacity-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-[#FF9416] text-white font-section py-3 px-6 rounded-lg hover:bg-[#e88510] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
