import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import DataInputPanel from "./components/DataInputPanel";
import ChartsPanel from "./components/ChartsPanel";
import ResultsPanel from "./components/ResultsPanel";
import "./App.css";

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [modelResults, setModelResults] = useState(null);

  const handleDataInputComplete = (data) => {
    setSelectedPoint(data.point);
    setChartsData({
      rainfallInput: data.rainfallInput,
      runoffInput: data.runoffInput,
      timestamp: data.timestamp,
    });
  };

  const handleRunModels = (results) => {
    setModelResults(results);
  };

  const handleReset = () => {
    setSelectedPoint(null);
    setChartsData(null);
    setModelResults(null);
  };

  return (
    <div className="app">
      <Header />

      <div className="main-layout">
        <MapView onDataInputComplete={handleDataInputComplete} />
        <div className="right-panel">
          {!chartsData && !modelResults && (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <p className="empty-title">Select Location</p>
              <p className="empty-text">Click on the map to place a marker and select your data values</p>
            </div>
          )}

          {chartsData && !modelResults && (
            <ChartsPanel 
              selectedPoint={selectedPoint}
              selectedVariable={null}
              chartsData={chartsData}
              onRunModels={handleRunModels}
            />
          )}

          {modelResults && (
            <ResultsPanel 
              selectedPoint={selectedPoint}
              selectedVariable={null}
              chartsData={chartsData}
              modelResults={modelResults}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}
