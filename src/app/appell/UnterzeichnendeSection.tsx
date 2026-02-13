"use client";

import { useState, useId } from "react";
import signatories from "./signatories.json";
import "./unterzeichnende.css";

const universities = [
  { key: "tum", label: "TUM" },
  { key: "bonn", label: "Bonn" },
  { key: "heidelberg", label: "Heidelberg" },
];

export default function UnterzeichnendeSection() {
  const tabsId = useId();
  const [activeTab, setActiveTab] = useState<string>("alle");

  return (
    <>
      <span className="appell-accent-line" />
      <h2 className="appell-section-heading">Unterzeichnende</h2>

      {/* Tab buttons */}
      <div
        className="unterzeichnende-tabs"
        role="tablist"
        aria-label="Universitäten filtern"
      >
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
        {universities.map((uni) => (
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
        <ul className="unterzeichnende-list">
          {signatories.map((signatory, index) => (
            <li key={index} className="unterzeichnende-item">
              <span className="unterzeichnende-name">{signatory.name}</span>
              <span className="unterzeichnende-chair">{signatory.chair}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* University-specific views */}
      {universities.map((uni) => {
        const uniSignatories = signatories.filter(
          (s) => s.university === uni.key
        );
        return (
          <div
            key={uni.key}
            role="tabpanel"
            id={`${tabsId}-panel-${uni.key}`}
            aria-labelledby={`${tabsId}-tab-${uni.key}`}
            className="unterzeichnende-panel"
            data-active={activeTab === uni.key ? "true" : undefined}
            hidden={activeTab !== uni.key}
          >
            {uniSignatories.length > 0 ? (
              <ul className="unterzeichnende-list">
                {uniSignatories.map((signatory, index) => (
                  <li key={index} className="unterzeichnende-item">
                    <span className="unterzeichnende-name">
                      {signatory.name}
                    </span>
                    <span className="unterzeichnende-chair">
                      {signatory.chair}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="unterzeichnende-note">
                Keine Unterzeichnenden für {uni.label} vorhanden.
              </p>
            )}
          </div>
        );
      })}
    </>
  );
}
