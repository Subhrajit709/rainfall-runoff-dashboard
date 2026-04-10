import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import ChartsPanel from "./components/ChartsPanel";
import ResultsPanel from "./components/ResultsPanel";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [modelResults, setModelResults] = useState(null);
  const [averageRainfall, setAverageRainfall] = useState(null);
  const [pointFileMemory, setPointFileMemory] = useState({});
  const [isPolygonAverage, setIsPolygonAverage] = useState(false);

  const handleDataInputComplete = (data) => {
    setSelectedPoint(data.point);
    setCsvData(data.csvData);
    setShowCharts(true);
    setModelResults(null);
    setIsPolygonAverage(data.isPolygonAverage || false);
    setAverageRainfall(data.averageValue || null);

    const key = `${data.point.lat.toFixed(4)},${data.point.lng.toFixed(4)}`;

    setPointFileMemory((prev) => ({
      ...prev,
      [key]: {
        file: data.file,
        fileName: data.fileName,
      },
    }));
  };

  const handleRunModels = (results) => {
    setModelResults(results);
  };

  const handleReset = () => {
    setSelectedPoint(null);
    setCsvData(null);
    setShowCharts(false);
    setModelResults(null);
    setAverageRainfall(null);
    setIsPolygonAverage(false);
  };

  return (
    <div className="app">
      <Header />

      <main
        className="dashboard"
        style={{
          display: "grid",
          gridTemplateColumns: "55% 45%", // ✅ EXACT RATIO
          gap: "12px",
          padding: "12px",
          height: "calc(100vh - 90px)",
        }}
      >
        {/* ✅ MAP SECTION (55%) */}
        <div
          className="map-card"
          style={{
            height: "100%",
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <MapView
            onDataInputComplete={handleDataInputComplete}
            pointFileMemory={pointFileMemory}
          />
        </div>

        {/* ✅ PANEL SECTION (45%) */}
        <div
          className="side-panel"
          style={{
            height: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {!showCharts && !modelResults && (
          <div className="glass-card">
  <div className="empty-state">
    
    <div className="empty-icon">
      <img
        src="https://cdn-icons-png.flaticon.com/512/5654/5654592.png"
        alt="Location Icon"
        style={{
          width: "120px",
          height: "120px",
          marginBottom: "110px"
        }}
      />
    </div>

    <p className="empty-title">Select Outlet on the Map</p>

    <p className="empty-text">
      Click on the map to place a marker, then upload a CSV file to
      visualize rainfall–runoff data. Or click any blue CHIRPS point to
      view monthly rainfall.
    </p>

    <div className="csv-info-badge">
      📂 Upload CSV or use CHIRPS rainfall data points
    </div>

  </div>
</div>
          )}

          {showCharts && !modelResults && (
            <div className="glass-card">
              <ChartsPanel
                selectedPoint={selectedPoint}
                csvData={csvData}
                onRunModels={handleRunModels}
                averageRainfall={averageRainfall}
                isPolygonAverage={isPolygonAverage}
              />
            </div>
          )}

          {modelResults && (
            <div className="glass-card">
              <ResultsPanel
                selectedPoint={selectedPoint}
                modelResults={modelResults}
                onReset={handleReset}
              />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}