import { useState, useEffect } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import ChartsPanel from "./components/ChartsPanel";
import ResultsPanel from "./components/ResultsPanel";
import ErrorPanel from "./components/ErrorPanel";
import { loadCSVData } from "./utils/dataLoader";
import "./App.css";

export default function App() {
  const [csvLoaded, setCsvLoaded] = useState(false);
  const [csvData, setCsvData] = useState(null);
  const [csvError, setCsvError] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [modelResults, setModelResults] = useState(null);

  // Load CSV on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const result = await loadCSVData();
        setCsvData(result.data);
        setCsvLoaded(true);
        console.log('✅ CSV Loaded:', result.report);
        
        // Show warnings if any
        if (result.warnings && result.warnings.length > 0) {
          console.warn('⚠️ CSV Warnings:', result.warnings);
        }
      } catch (error) {
        console.error('❌ CSV Load Failed:', error);
        setCsvError(error.message);
      }
    };

    initializeData();
  }, []);

  const handleDataInputComplete = (data) => {
    setSelectedPoint(data.point);
    setChartsData({
      rainfallInput: data.rainfallInput,
      runoffInput: data.runoffInput,
      matchResult: data.matchResult,
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

  // Show loading state
  if (!csvLoaded && !csvError) {
    return (
      <div className="app">
        <Header />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading CSV data...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (csvError) {
    return (
      <div className="app">
        <Header />
        <ErrorPanel error={csvError} />
      </div>
    );
  }

  return (
    <div className="app">
      <Header />

      <div className="main-layout">
        <MapView 
          onDataInputComplete={handleDataInputComplete}
          csvData={csvData}
        />
        <div className="right-panel">
          {!chartsData && !modelResults && (
            <div className="empty-state">
              <div className="empty-icon">📍</div>
              <p className="empty-title">Select Location</p>
              <p className="empty-text">Click on the map to place a marker and enter rainfall/runoff values</p>
              <div className="csv-info-badge">
                ✅ CSV Loaded: {csvData?.length || 0} data points
              </div>
            </div>
          )}

          {chartsData && !modelResults && (
            <ChartsPanel 
              selectedPoint={selectedPoint}
              chartsData={chartsData}
              csvData={csvData}
              onRunModels={handleRunModels}
            />
          )}

          {modelResults && (
            <ResultsPanel 
              selectedPoint={selectedPoint}
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
