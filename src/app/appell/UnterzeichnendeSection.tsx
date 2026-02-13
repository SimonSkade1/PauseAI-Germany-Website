"use client";

import { useState, useId } from "react";
import "./unterzeichnende.css";

export default function UnterzeichnendeSection() {
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<string>("alle");

  return (
    <>
      <span className="appell-accent-line" />
      <h2 className="appell-section-heading">Unterzeichnende</h2>

      {/* Tab buttons - only top 3 unis + Alle anzeigen */}
      <div className="unterzeichnende-tabs" role="tablist" aria-label="Universitäten filtern">
        <button
          role="tab"
          aria-selected={activeTab === "alle"}
          aria-controls={`${tabsId}-panel-alle`}
          id={`${tabsId}-tab-alle`}
          className="unterzeichnende-tab"
          data-active={activeTab === "alle" ? "true" : undefined}
          onClick={() => setActiveTab("alle")}
          type="button"
        >
          Alle anzeigen
        </button>
      </div>

      {/* All signatories view */}
      <div
        role="tabpanel"
        id={`${tabsId}-panel-alle`}
        aria-labelledby={`${tabsId}-tab-alle`}
        className="unterzeichnende-panel"
        data-active={activeTab === "alle" ? "true" : undefined}
        hidden={activeTab !== "alle"}
      >
        <p className="unterzeichnende-note">Unterzeichnende werden in Kürze hinzugefügt.</p>
      </div>
    </>
  );
}
