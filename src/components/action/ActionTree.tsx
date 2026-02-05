"use client";

import React from "react";

export function ActionTree() {
  return (
    <section className="bg-pause-gray-dark py-12 md:py-16 min-h-[600px]">
      <div className="max-w-6xl mx-auto px-6">
        {/* Placeholder for D3.js skill tree */}
        <div className="bg-[#16213e] rounded-xl p-8 md:p-12 border border-gray-700 min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-[#FF9416]/20 flex items-center justify-center">
              <svg className="w-12 h-12 text-[#FF9416]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="font-section text-xl md:text-2xl text-white mb-3">
              Action Tree
            </h3>
            <p className="font-body text-gray-400 text-base md:text-lg max-w-md mx-auto">
              Das Skill Tree wird später hier angezeigt. Hier kannst du durch verschiedene Aktionen XP sammeln.
            </p>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-6 bg-[#FF9416]/5 border border-[#FF9416]/20 rounded-lg">
          <p className="font-body text-gray-300 text-sm md:text-base">
            <span className="text-[#FF9416] font-semibold">Anleitung:</span> Klicke auf die Aufgaben im Skill Tree,
            um sie als erledigt zu markieren. Einmalige Aufgaben können nur einmal完成的 werden,
            wiederholbare Aufgaben bringen dir jedes Mal XP.
          </p>
        </div>
      </div>
    </section>
  );
}
