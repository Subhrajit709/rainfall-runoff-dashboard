import { useState } from "react";
import "./LeftSidebar.css";

export default function LeftSidebar({ onBasemapChange, onLayerToggle, activeLayers, onRegionChange, onDataSourceChange }) {
  const [basemap, setBasemap] = useState("hybrid");
  const [region, setRegion] = useState("all-india");
  const [dataSource, setDataSource] = useState("chirps");
  const [layers, setLayers] = useState({
    chirps: true,
    catchment: true,
    river: true,
    outlet: true,
  });

  const handleBasemapChange = (e) => {
    const val = e.target.value;
    setBasemap(val);
    if (onBasemapChange) onBasemapChange(val);
  };

  const handleRegionChange = (e) => {
    const val = e.target.value;
    setRegion(val);
    if (onRegionChange) onRegionChange(val);
  };

  const handleDataSourceChange = (e) => {
    const val = e.target.value;
    setDataSource(val);
    if (onDataSourceChange) onDataSourceChange(val);
  };

  const toggleLayer = (layerKey) => {
    const updated = { ...layers, [layerKey]: !layers[layerKey] };
    setLayers(updated);
    if (onLayerToggle) onLayerToggle(layerKey, updated[layerKey]);
  };

  return (
    <div className="left-sidebar">

      {/* ── FILTERS CARD ── */}
      <div className="sb-card">
        <div className="sb-card-title">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          Filters
        </div>

        <div className="sb-field">
          <label className="sb-label">Basemap</label>
          <select className="sb-select" value={basemap} onChange={handleBasemapChange}>
            <option value="hybrid">🛰️ Hybrid (Default)</option>
            <option value="satellite">🌍 Satellite</option>
            <option value="terrain">🗻 Terrain</option>
          </select>
        </div>

        <div className="sb-field">
          <label className="sb-label">Region</label>
          <select className="sb-select" value={region} onChange={handleRegionChange}>
            <option value="all-india">All India</option>
            <option value="karnali">Karnali Basin</option>
            <option value="global">Global Map</option>
          </select>
        </div>

        <div className="sb-field" style={{ marginBottom: 0 }}>
          <label className="sb-label">Data Source</label>
          <select className="sb-select" value={dataSource} onChange={handleDataSourceChange}>
            <option value="chirps">CHIRPS 2025</option>
            <option value="gpm">GPM Rainfall</option>
            <option value="imd">IMD Daily</option>
          </select>
        </div>
      </div>

      {/* ── MAP LAYERS CARD ── */}
      <div className="sb-card">
        <div className="sb-card-title">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 2 7 12 12 22 7 12 2"/>
            <polyline points="2 17 12 22 22 17"/>
            <polyline points="2 12 12 17 22 12"/>
          </svg>
          Map Layers
        </div>

        <div className="sb-chips">
          {[
            { key: "chirps",    label: "CHIRPS",    color: "#3b82f6" },
            { key: "catchment", label: "Catchment", color: "#22c55e" },
            { key: "river",     label: "River",     color: "#06b6d4" },
            { key: "outlet",    label: "Outlet",    color: "#ef4444" },
          ].map(({ key, label, color }) => (
            <button
              key={key}
              className={`sb-chip${layers[key] ? " active" : ""}`}
              onClick={() => toggleLayer(key)}
              title={`Toggle ${label} layer`}
            >
              <span className="sb-chip-dot" style={{ background: color }} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── RAINFALL LEGEND CARD ── */}
      <div className="sb-card">
        <div className="sb-card-title">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          Rainfall Legend
        </div>

        <div className="sb-legend">
          <div className="sb-legend-item"><span className="sb-legend-dot" style={{ background: "#1d4ed8" }}/>&gt; 3000 mm &nbsp;Heavy</div>
          <div className="sb-legend-item"><span className="sb-legend-dot" style={{ background: "#3b82f6" }}/>1500–3000 mm &nbsp;Moderate</div>
          <div className="sb-legend-item"><span className="sb-legend-dot" style={{ background: "#60a5fa" }}/>800–1500 mm &nbsp;Light</div>
          <div className="sb-legend-item"><span className="sb-legend-dot" style={{ background: "#bae6fd" }}/>&#60; 800 mm &nbsp;Sparse</div>
        </div>
        <div className="sb-legend-bar" />
        <div className="sb-legend-ends">
          <span>Low</span>
          <span>High</span>
        </div>
      </div>

      {/* Dataset Summary REMOVED — was cut off and redundant with header */}

    </div>
  );
}
