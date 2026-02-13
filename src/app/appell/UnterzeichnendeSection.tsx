"use client";

import { universities } from "./content";
import { useState, useId } from "react";
import "./unterzeichnende.css";

export default function UnterzeichnendeSection() {
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<string>("alle");

  // Show only top 3 universities in tabs, plus "Alle anzeigen"
  const topUniversities = universities.slice(0, 3);

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

        {topUniversities.map((uni) => (
          <button
            key={uni.key}
            role="tab"
            aria-selected={activeTab === uni.key}
            aria-controls={`${tabsId}-panel-${uni.key}`}
            id={`${tabsId}-tab-${uni.key}`}
            className="unterzeichnende-tab"
            data-active={activeTab === uni.key ? "true" : undefined}
            onClick={() => setActiveTab(uni.key)}
            type="button"
          >
            {uni.label}
          </button>
        ))}
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
        {universities.map((uni) => (
          <div key={uni.key} className="unterzeichnende-university-group">
            <h3 className="unterzeichnende-university-heading">{uni.label}</h3>
            <ul className="unterzeichnende-list">
              {uni.signatories.map((signatory, index) => (
                <li key={index} className="unterzeichnende-item">
                  <span className="unterzeichnende-name">{signatory.name}</span>
                  <span className="unterzeichnende-chair">{signatory.chair}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Individual university views - only for top 3 */}
      {topUniversities.map((uni) => (
        <div
          key={uni.key}
          role="tabpanel"
          id={`${tabsId}-panel-${uni.key}`}
          aria-labelledby={`${tabsId}-tab-${uni.key}`}
          className="unterzeichnende-panel"
          data-active={activeTab === uni.key ? "true" : undefined}
          hidden={activeTab !== uni.key}
        >
          <h3 className="unterzeichnende-university-heading">{uni.label}</h3>
          <ul className="unterzeichnende-list">
            {uni.signatories.map((signatory, index) => (
              <li key={index} className="unterzeichnende-item">
                <span className="unterzeichnende-name">{signatory.name}</span>
                <span className="unterzeichnende-chair">{signatory.chair}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
