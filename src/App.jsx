// import { useState, useEffect } from "react";
// import Header from "./components/Header";
// import MapView from "./components/MapView";
// import ChartsPanel from "./components/ChartsPanel";
// import ResultsPanel from "./components/ResultsPanel";
// import ErrorPanel from "./components/ErrorPanel";
// import { loadCSVData } from "./utils/dataLoader";
// import "./App.css";

// export default function App() {
//   const [csvLoaded, setCsvLoaded] = useState(false);
//   const [csvData, setCsvData] = useState(null);
//   const [csvError, setCsvError] = useState(null);
//   const [selectedPoint, setSelectedPoint] = useState(null);
//   const [chartsData, setChartsData] = useState(null);
//   const [modelResults, setModelResults] = useState(null);

//   // Load CSV on mount
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         const result = await loadCSVData();
//         setCsvData(result.data);
//         setCsvLoaded(true);
//         console.log('✅ CSV Loaded:', result.report);
        
//         // Show warnings if any
//         if (result.warnings && result.warnings.length > 0) {
//           console.warn('⚠️ CSV Warnings:', result.warnings);
//         }
//       } catch (error) {
//         console.error('❌ CSV Load Failed:', error);
//         setCsvError(error.message);
//       }
//     };

//     initializeData();
//   }, []);

//   const handleDataInputComplete = (data) => {
//     setSelectedPoint(data.point);
//     setChartsData({
//       rainfallInput: data.rainfallInput,
//       runoffInput: data.runoffInput,
//       matchResult: data.matchResult,
//       timestamp: data.timestamp,
//     });
//   };

//   const handleRunModels = (results) => {
//     setModelResults(results);
//   };

//   const handleReset = () => {
//     setSelectedPoint(null);
//     setChartsData(null);
//     setModelResults(null);
//   };

//   // Show loading state
//   if (!csvLoaded && !csvError) {
//     return (
//       <div className="app">
//         <Header />
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading CSV data...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (csvError) {
//     return (
//       <div className="app">
//         <Header />
//         <ErrorPanel error={csvError} />
//       </div>
//     );
//   }

//   return (
//     <div className="app">
//       <Header />

//       <div className="main-layout">
//         <MapView 
//           onDataInputComplete={handleDataInputComplete}
//           csvData={csvData}
//         />
//         <div className="right-panel">
//           {!chartsData && !modelResults && (
//             <div className="empty-state">
//               <div className="empty-icon">📍</div>
//               <p className="empty-title">Select Location</p>
//               <p className="empty-text">Click on the map to place a marker and enter rainfall/runoff values</p>
//               <div className="csv-info-badge">
//                 ✅ CSV Loaded: {csvData?.length || 0} data points
//               </div>
//             </div>
//           )}

//           {chartsData && !modelResults && (
//             <ChartsPanel 
//               selectedPoint={selectedPoint}
//               chartsData={chartsData}
//               csvData={csvData}
//               onRunModels={handleRunModels}
//             />
//           )}

//           {modelResults && (
//             <ResultsPanel 
//               selectedPoint={selectedPoint}
//               chartsData={chartsData}
//               modelResults={modelResults}
//               onReset={handleReset}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






















// import { useState, useEffect } from "react";
// import Header from "./components/Header";
// import MapView from "./components/MapView";
// import ChartsPanel from "./components/ChartsPanel";
// import ResultsPanel from "./components/ResultsPanel";
// import ErrorPanel from "./components/ErrorPanel";
// import { loadCSVData } from "./utils/dataLoader";
// import "./App.css";

// export default function App() {
//   const [csvLoaded, setCsvLoaded] = useState(false);
//   const [csvData, setCsvData] = useState(null);
//   const [csvError, setCsvError] = useState(null);
//   const [selectedPoint, setSelectedPoint] = useState(null);
//   const [showCharts, setShowCharts] = useState(false);
//   const [modelResults, setModelResults] = useState(null);

//   // Load CSV on mount
//   useEffect(() => {
//     const initializeData = async () => {
//       try {
//         const result = await loadCSVData();
//         setCsvData(result.data);
//         setCsvLoaded(true);
//         console.log('✅ CSV Loaded:', result.report);
        
//         // Show warnings if any (but don't block)
//         if (result.warnings && result.warnings.length > 0) {
//           console.warn('⚠️ CSV Warnings:', result.warnings.length, 'warnings');
//           // Only show first 5 warnings to avoid console spam
//           console.warn('Sample warnings:', result.warnings.slice(0, 5));
//         }
//       } catch (error) {
//         console.error('❌ CSV Load Failed:', error);
//         setCsvError(error.message);
//       }
//     };

//     initializeData();
//   }, []);

//   const handleDataInputComplete = (data) => {
//     setSelectedPoint(data.point);
//     setShowCharts(true);
//     setModelResults(null); // Reset model results when loading new data
//   };

//   const handleRunModels = (results) => {
//     setModelResults(results);
//   };

//   const handleReset = () => {
//     setSelectedPoint(null);
//     setShowCharts(false);
//     setModelResults(null);
//   };

//   // Show loading state
//   if (!csvLoaded && !csvError) {
//     return (
//       <div className="app">
//         <Header />
//         <div className="loading-container">
//           <div className="loading-spinner"></div>
//           <p>Loading CSV data...</p>
//           <p className="loading-subtext">Reading {csvData?.length || 3319} observations...</p>
//         </div>
//       </div>
//     );
//   }

//   // Show error state
//   if (csvError) {
//     return (
//       <div className="app">
//         <Header />
//         <ErrorPanel error={csvError} />
//       </div>
//     );
//   }

//   return (
//     <div className="app">
//       <Header />

//       <div className="main-layout">
//         <MapView 
//           onDataInputComplete={handleDataInputComplete}
//           csvData={csvData}
//         />
//         <div className="right-panel">
//           {!showCharts && !modelResults && (
//             <div className="empty-state">
//               <div className="empty-icon">📍</div>
//               <p className="empty-title">Select Location</p>
//               <p className="empty-text">
//                 Click on the map to place a marker and load the complete rainfall-runoff dataset
//               </p>
//               <div className="csv-info-badge">
//                 ✅ Click and Select the point on the Map and again click on “Load Data” to visualize: {csvData?.length || 0} data points
//               </div>
//               <div className="empty-features">
//                 <div className="feature-item">
//                   <span className="feature-icon">🌧️</span>
//                   <span className="feature-text">Rainfall data (inverted bars)</span>
//                 </div>
//                 <div className="feature-item">
//                   <span className="feature-icon">💧</span>
//                   <span className="feature-text">Runoff data (area chart)</span>
//                 </div>
//                 <div className="feature-item">
//                   <span className="feature-icon">📊</span>
//                   <span className="feature-text">Combined visualization</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {showCharts && !modelResults && (
//             <ChartsPanel 
//               selectedPoint={selectedPoint}
//               csvData={csvData}
//               onRunModels={handleRunModels}
//             />
//           )}

//           {modelResults && (
//             <ResultsPanel 
//               selectedPoint={selectedPoint}
//               modelResults={modelResults}
//               onReset={handleReset}
//             />
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






















import { useState } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import ChartsPanel from "./components/ChartsPanel";
import ResultsPanel from "./components/ResultsPanel";
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
    console.log("✅ Data input complete:", data);

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

      <div className="main-layout">
        <MapView
          onDataInputComplete={handleDataInputComplete}
          pointFileMemory={pointFileMemory}
        />

        <div className="right-panel">
          {!showCharts && !modelResults && (
            <div className="empty-state">
             <div className="empty-icon">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/5654/5654592.png" 
          alt="Location Icon" 
          style={{ width: "210px", height: "210px" ,  margin: "0 auto -60px"}}
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

              <div className="empty-features">
                <div className="feature-item">
                  {/* <span className="feature-icon">🌧️</span> */}
                  {/* <span className="feature-text">Rainfall data visualization</span> */}
                </div>
                <div className="feature-item">
                  {/* <span className="feature-icon">💧</span> */}
                  {/* <span className="feature-text">Runoff hydrograph</span> */}
                </div>
                <div className="feature-item">
                  {/* <span className="feature-icon">📊</span> */}
                  {/* <span className="feature-text">Model comparison</span> */}
                </div>
              </div>
            </div>
          )}

          {showCharts && !modelResults && (
            <ChartsPanel
              selectedPoint={selectedPoint}
              csvData={csvData}
              onRunModels={handleRunModels}
              averageRainfall={averageRainfall}
              isPolygonAverage={isPolygonAverage}
            />
          )}

          {modelResults && (
            <ResultsPanel
              selectedPoint={selectedPoint}
              modelResults={modelResults}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
}