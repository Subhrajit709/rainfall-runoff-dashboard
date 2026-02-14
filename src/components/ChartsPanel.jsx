// import { useState, useEffect } from "react";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
// import { calculateModelMetrics } from "../utils/dataLoader";

// export default function ChartsPanel({ selectedPoint, chartsData, csvData, onRunModels }) {
//   const [isRunning, setIsRunning] = useState(false);
//   const [animatingChart, setAnimatingChart] = useState(null);

//   useEffect(() => {
//     if (chartsData) {
//       setAnimatingChart('both');
//       const timer = setTimeout(() => setAnimatingChart(null), 600);
//       return () => clearTimeout(timer);
//     }
//   }, [chartsData]);

//   if (!chartsData) {
//     return null;
//   }

//   const { matchResult, rainfallInput, runoffInput } = chartsData;

//   // Use either window data or full CSV
//   const displayData = matchResult.found ? matchResult.windowData : csvData.slice(0, 500);
//   const rainfallSeries = displayData;
//   const runoffSeries = displayData;

//   const handleRunModels = async () => {
//     setIsRunning(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Split data for training/testing (80/20)
//     const splitIndex = Math.floor(csvData.length * 0.8);
//     const trainData = csvData.slice(0, splitIndex);
//     const testData = csvData.slice(splitIndex);

//     // Calculate REAL metrics based on CSV data
//     const models = calculateModelMetrics(trainData, testData);

//     const results = {
//       models: models,
//       rainfall: rainfallSeries,
//       runoff: runoffSeries,
//       matchInfo: matchResult,
//       trainSize: trainData.length,
//       testSize: testData.length
//     };

//     onRunModels(results);
//     setIsRunning(false);
//   };

//   return (
//     <div className="charts-panel">
//       <div className="panel-header">
//         <div className="location-info">
//           <span className="info-badge">📍 Location</span>
//           <span className="info-value">{selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
//           <span className="info-badge">📊 Input Values</span>
//           <span className="info-value">Rainfall: {rainfallInput}mm | Runoff: {runoffInput}m³/s</span>
//         </div>
        
//         {matchResult.found && (
//           <div className="match-info-banner">
//             ✓ {matchResult.message}
//           </div>
//         )}
//       </div>

//       <div className="charts-dual-container">
//         {/* Rainfall Chart */}
//         <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
//           <div className="chart-header">
//             <h3>🌧️ Rainfall Data</h3>
//             <span className="chart-unit">(mm)</span>
//           </div>
//           <ResponsiveContainer width="100%" height={320}>
//             <LineChart data={rainfallSeries}>
//               <defs>
//                 <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
//                   <stop offset="95%" stopColor="#1e90ff" stopOpacity={0.1}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
//               <XAxis 
//                 dataKey="time" 
//                 stroke="#999"
//                 tick={{ fontSize: 11 }}
//                 interval={Math.floor(rainfallSeries.length / 10)}
//               />
//               <YAxis 
//                 stroke="#999"
//                 tick={{ fontSize: 11 }}
//                 width={45}
//               />
//               <Tooltip 
//                 contentStyle={{
//                   backgroundColor: "#f0f5f9",
//                   border: "1px solid #1e90ff",
//                   borderRadius: "6px",
//                   boxShadow: "0 2px 8px rgba(30, 144, 255, 0.2)"
//                 }}
//                 formatter={(value) => value.toFixed(2)}
//                 labelFormatter={(label) => `Time: ${label}`}
//               />
//               <Legend 
//                 verticalAlign="top" 
//                 height={24}
//                 wrapperStyle={{ paddingBottom: "10px" }}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="rainfall"
//                 stroke="#1e90ff" 
//                 dot={false}
//                 strokeWidth={2.5}
//                 name="Rainfall (mm)"
//                 isAnimationActive={true}
//                 animationDuration={800}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//           <div className="chart-stats">
//             <span>Max: {Math.max(...rainfallSeries.map(d => d.rainfall)).toFixed(1)} mm</span>
//             <span>Avg: {(rainfallSeries.reduce((a, b) => a + b.rainfall, 0) / rainfallSeries.length).toFixed(1)} mm</span>
//             <span>Input: {rainfallInput} mm</span>
//           </div>
//         </div>

//         {/* Runoff Chart */}
//         <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
//           <div className="chart-header">
//             <h3>💧 Runoff Data</h3>
//             <span className="chart-unit">(m³/s)</span>
//           </div>
//           <ResponsiveContainer width="100%" height={320}>
//             <LineChart data={runoffSeries}>
//               <defs>
//                 <linearGradient id="runoffGradient" x1="0" y1="0" x2="0" y2="1">
//                   <stop offset="5%" stopColor="#00a86b" stopOpacity={0.8}/>
//                   <stop offset="95%" stopColor="#00a86b" stopOpacity={0.1}/>
//                 </linearGradient>
//               </defs>
//               <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
//               <XAxis 
//                 dataKey="time" 
//                 stroke="#999"
//                 tick={{ fontSize: 11 }}
//                 interval={Math.floor(runoffSeries.length / 10)}
//               />
//               <YAxis 
//                 stroke="#999"
//                 tick={{ fontSize: 11 }}
//                 width={45}
//               />
//               <Tooltip 
//                 contentStyle={{
//                   backgroundColor: "#f0f5f9",
//                   border: "1px solid #00a86b",
//                   borderRadius: "6px",
//                   boxShadow: "0 2px 8px rgba(0, 168, 107, 0.2)"
//                 }}
//                 formatter={(value) => value.toFixed(2)}
//                 labelFormatter={(label) => `Time: ${label}`}
//               />
//               <Legend 
//                 verticalAlign="top" 
//                 height={24}
//                 wrapperStyle={{ paddingBottom: "10px" }}
//               />
//               <Line 
//                 type="monotone" 
//                 dataKey="runoff"
//                 stroke="#00a86b" 
//                 dot={false}
//                 strokeWidth={2.5}
//                 name="Runoff (m³/s)"
//                 isAnimationActive={true}
//                 animationDuration={800}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//           <div className="chart-stats">
//             <span>Max: {Math.max(...runoffSeries.map(d => d.runoff)).toFixed(1)} m³/s</span>
//             <span>Avg: {(runoffSeries.reduce((a, b) => a + b.runoff, 0) / runoffSeries.length).toFixed(1)} m³/s</span>
//             <span>Input: {runoffInput} m³/s</span>
//           </div>
//         </div>
//       </div>

//       <div className="panel-actions">
//         <button 
//           className="run-button"
//           onClick={handleRunModels}
//           disabled={isRunning}
//         >
//           {isRunning ? (
//             <>
//               <span className="spinner"></span>
//               Running Analysis on CSV Data...
//             </>
//           ) : (
//             <>
//               🚀 Run Model Comparison
//             </>
//           )}
//         </button>
//       </div>

//       <div className="data-info">
//         <p>📈 Showing {displayData.length} data points from CSV | Total dataset: {csvData.length} points</p>
//         {matchResult.found && (
//           <p className="match-detail">🎯 Matched {matchResult.matchCount} similar points in dataset</p>
//         )}
//       </div>
//     </div>
//   );
// }








// --------------------------------------------------------------------------------------------------------------------------
//                         <-------------- FOR BOTH SECONDARY & SEPARATE CHART VIEWS -------------->
// -------------------------------------------------------------------------------------------------------------------------


// import { useState, useEffect, useMemo } from "react";
// import {
//   ComposedChart,
//   Line,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import { calculateModelMetrics } from "../utils/dataLoader";

// export default function ChartsPanel({
//   selectedPoint,
//   chartsData,
//   csvData,
//   onRunModels,
// }) {
//   const [isRunning, setIsRunning] = useState(false);
//   const [animatingChart, setAnimatingChart] = useState(null);

//   useEffect(() => {
//     if (chartsData) {
//       setAnimatingChart("both");
//       const timer = setTimeout(() => setAnimatingChart(null), 600);
//       return () => clearTimeout(timer);
//     }
//   }, [chartsData]);

//   if (!chartsData) return null;

//   const { matchResult, rainfallInput, runoffInput } = chartsData;

//   // ============================
//   // Decide what data to show
//   // ============================
//   const displayData = useMemo(() => {
//     if (matchResult?.found && Array.isArray(matchResult.windowData)) {
//       return matchResult.windowData;
//     }
//     return Array.isArray(csvData) ? csvData.slice(0, 500) : [];
//   }, [matchResult, csvData]);

//   // ============================
//   // Normalize chart data
//   // (force numeric + time)
//   // ============================
//   const chartData = useMemo(() => {
//     return displayData
//       .map((row, idx) => ({
//         time: Number(row.time ?? idx + 1),
//         rainfall: Number(row.rainfall),
//         runoff: Number(row.runoff),
//       }))
//       .filter(
//         (r) =>
//           Number.isFinite(r.time) &&
//           Number.isFinite(r.rainfall) &&
//           Number.isFinite(r.runoff)
//       );
//   }, [displayData]);

//   // ============================
//   // Safe Stats (avoid NaN crash)
//   // ============================
//   const rainfallStats = useMemo(() => {
//     if (!chartData.length) return { max: 0, avg: 0 };
//     const max = Math.max(...chartData.map((d) => d.rainfall));
//     const avg =
//       chartData.reduce((sum, d) => sum + d.rainfall, 0) / chartData.length;
//     return { max, avg };
//   }, [chartData]);

//   const runoffStats = useMemo(() => {
//     if (!chartData.length) return { max: 0, avg: 0 };
//     const max = Math.max(...chartData.map((d) => d.runoff));
//     const avg =
//       chartData.reduce((sum, d) => sum + d.runoff, 0) / chartData.length;
//     return { max, avg };
//   }, [chartData]);

//   // ============================
//   // Run Models (CSV based)
//   // ============================
//   const handleRunModels = async () => {
//     if (!Array.isArray(csvData) || csvData.length < 10) {
//       alert("CSV dataset is missing or too small. Please check your CSV file.");
//       return;
//     }

//     setIsRunning(true);
//     await new Promise((resolve) => setTimeout(resolve, 1200));

//     // Train/Test split 80/20
//     const splitIndex = Math.floor(csvData.length * 0.8);
//     const trainData = csvData.slice(0, splitIndex);
//     const testData = csvData.slice(splitIndex);

//     // REAL metrics based on CSV
//     const models = calculateModelMetrics(trainData, testData);

//     const results = {
//       models,
//       rainfall: chartData, // now same combined window
//       runoff: chartData,
//       matchInfo: matchResult,
//       trainSize: trainData.length,
//       testSize: testData.length,
//     };

//     onRunModels(results);
//     setIsRunning(false);
//   };

//   return (
//     <div className="charts-panel">
//       <div className="panel-header">
//         <div className="location-info">
//           <span className="info-badge">📍 Location</span>
//           <span className="info-value">
//             {selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E
//           </span>

//           <span className="info-badge">📊 Input Values</span>
//           <span className="info-value">
//             Rainfall: {rainfallInput}mm | Runoff: {runoffInput}m³/s
//           </span>
//         </div>

//         {matchResult?.found && (
//           <div className="match-info-banner">✓ {matchResult.message}</div>
//         )}
//       </div>

//       {/* ============================
//           Combined Chart
//       ============================ */}
//       <div className={`chart-section ${animatingChart ? "animating" : ""}`}>
//         <div className="chart-header">
//           <h3>📈 Rainfall–Runoff Hydrograph</h3>
//           <span className="chart-unit">(Dual Axis)</span>
//         </div>

//         <ResponsiveContainer width="100%" height={380}>
//           <ComposedChart data={chartData}>
//             <CartesianGrid
//               strokeDasharray="3 3"
//               stroke="#e8ecf0"
//               vertical={false}
//             />

//             <XAxis
//               dataKey="time"
//               stroke="#999"
//               tick={{ fontSize: 11 }}
//               interval={Math.floor(chartData.length / 10)}
//             />

//             {/* Left Y axis: Rainfall */}
//             <YAxis
//               yAxisId="left"
//               stroke="#999"
//               tick={{ fontSize: 11 }}
//               width={55}
//               label={{
//                 value: "Rainfall (mm)",
//                 angle: -90,
//                 position: "insideLeft",
//                 offset: 0,
//               }}
//             />

//             {/* Right Y axis: Runoff */}
//             <YAxis
//               yAxisId="right"
//               orientation="right"
//               stroke="#999"
//               tick={{ fontSize: 11 }}
//               width={55}
//               label={{
//                 value: "Runoff (m³/s)",
//                 angle: 90,
//                 position: "insideRight",
//                 offset: 0,
//               }}
//             />

//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "#f0f5f9",
//                 border: "1px solid #d1d8de",
//                 borderRadius: "6px",
//                 boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
//               }}
//               labelStyle={{
//     color: "#cec345",   // ✅ This changes "Time: 123" color
//     fontWeight: "700",
//   }}
//               formatter={(value, name) => {
//                 if (typeof value !== "number") return value;
//                 if (name === "Rainfall (mm)") return [value.toFixed(2), name];
//                 if (name === "Runoff (m³/s)") return [value.toFixed(2), name];
//                 return [value, name];
//               }}
//               labelFormatter={(label) => `Time: ${label}`}
//             />

//             <Legend verticalAlign="top" height={26} />

//             {/* Rainfall bars */}
//             <Bar
//               yAxisId="left"
//               dataKey="rainfall"
//               name="Rainfall (mm)"
//               fill="#1e90ff"
//               opacity={0.7}
//               barSize={10}
//               isAnimationActive={true}
//               animationDuration={800}
//             />

//             {/* Runoff line */}
//             <Line
//               yAxisId="right"
//               type="monotone"
//               dataKey="runoff"
//               name="Runoff (m³/s)"
//               stroke="#00a86b"
//               dot={false}
//               strokeWidth={2.5}
//               isAnimationActive={true}
//               animationDuration={800}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>

//         <div className="chart-stats">
//           <span>
//             Rainfall Max: {rainfallStats.max.toFixed(1)} mm | Avg:{" "}
//             {rainfallStats.avg.toFixed(1)} mm
//           </span>
//           <span>
//             Runoff Max: {runoffStats.max.toFixed(1)} m³/s | Avg:{" "}
//             {runoffStats.avg.toFixed(1)} m³/s
//           </span>
//         </div>
//       </div>

//       <div className="panel-actions">
//         <button
//           className="run-button"
//           onClick={handleRunModels}
//           disabled={isRunning}
//         >
//           {isRunning ? (
//             <>
//               <span className="spinner"></span>
//               Running Analysis on CSV Data...
//             </>
//           ) : (
//             <>🚀 Run Model Comparison</>
//           )}
//         </button>
//       </div>

//       <div className="data-info">
//         <p>
//           📈 Showing {chartData.length} data points from CSV | Total dataset:{" "}
//           {csvData?.length || 0} points
//         </p>
//         {matchResult?.found && (
//           <p className="match-detail">
//             🎯 Matched {matchResult.matchCount} similar points in dataset
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }













// import { useState } from "react";
// import { 
//   ComposedChart, 
//   Bar, 
//   Area, 
//   XAxis, 
//   YAxis, 
//   CartesianGrid, 
//   Tooltip, 
//   Legend, 
//   ResponsiveContainer 
// } from "recharts";
// import { calculateModelMetrics } from "../utils/dataLoader";

// export default function ChartsPanel({ selectedPoint, csvData, onRunModels }) {
//   const [isRunning, setIsRunning] = useState(false);

//   if (!csvData) {
//     return null;
//   }

//   // Use ALL CSV data (3,319 points)
//   const displayData = csvData;

//   const handleRunModels = async () => {
//     setIsRunning(true);
//     await new Promise(resolve => setTimeout(resolve, 1500));
    
//     // Split data for training/testing (80/20)
//     const splitIndex = Math.floor(csvData.length * 0.8);
//     const trainData = csvData.slice(0, splitIndex);
//     const testData = csvData.slice(splitIndex);

//     // Calculate REAL metrics based on CSV data
//     const models = calculateModelMetrics(trainData, testData);

//     const results = {
//       models: models,
//       rainfall: displayData,
//       runoff: displayData,
//       trainSize: trainData.length,
//       testSize: testData.length
//     };

//     onRunModels(results);
//     setIsRunning(false);
//   };

//   // Calculate statistics
//   const rainfallStats = {
//     max: Math.max(...displayData.map(d => d.rainfall)),
//     min: Math.min(...displayData.map(d => d.rainfall)),
//     avg: displayData.reduce((sum, d) => sum + d.rainfall, 0) / displayData.length
//   };

//   const runoffStats = {
//     max: Math.max(...displayData.map(d => d.runoff)),
//     min: Math.min(...displayData.map(d => d.runoff)),
//     avg: displayData.reduce((sum, d) => sum + d.runoff, 0) / displayData.length
//   };

//   // Custom tooltip
//   const CustomTooltip = ({ active, payload }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="custom-tooltip">
//           <p className="tooltip-label">Day {payload[0].payload.time}</p>
//           <p className="tooltip-rainfall">
//             🌧️ Rainfall: {payload[0].payload.rainfall.toFixed(2)} mm
//           </p>
//           <p className="tooltip-runoff">
//             💧 Runoff: {payload[0].payload.runoff.toFixed(2)} m³/s
//           </p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="charts-panel">
//       <div className="panel-header">
//         <div className="location-info">
//           <span className="info-badge">📍 Location</span>
//           <span className="info-value">
//             {selectedPoint.lat.toFixed(4)}°N, {selectedPoint.lng.toFixed(4)}°E
//           </span>
//           <span className="info-badge">📊 Dataset</span>
//           <span className="info-value">
//             Complete Time Series ({displayData.length} days)
//           </span>
//         </div>
//       </div>

//       {/* Combined Chart Section */}
//       <div className="combined-chart-section">
//         <div className="chart-header">
//           <h3>🌧️ Rainfall-Runoff Combined Analysis</h3>
//           <p className="chart-description">
//             Rainfall (inverted bars) and Runoff (area chart) over entire observation period
//           </p>
//         </div>

//         <ResponsiveContainer width="100%" height={600}>
//           <ComposedChart 
//             data={displayData}
//             margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//           >
//             <defs>
//               {/* Gradient for runoff area */}
//               <linearGradient id="runoffAreaGradient" x1="0" y1="0" x2="0" y2="1">
//                 <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
//                 <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
//               </linearGradient>
//             </defs>

//             <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            
//             {/* X-Axis: Time (days) */}
//             <XAxis 
//               dataKey="time" 
//               stroke="#64748b"
//               tick={{ fontSize: 11 }}
//               label={{ value: 'Time (days)', position: 'insideBottom', offset: -10, fontSize: 12 }}
//               interval={Math.floor(displayData.length / 20)} // Show ~20 labels
//             />
            
//             {/* Left Y-Axis: Rainfall (INVERTED) */}
//             <YAxis 
//               yAxisId="rainfall"
//               orientation="left"
//               reversed={true}  // INVERTED for rainfall (rain falls down)
//               stroke="#10b981"
//               tick={{ fontSize: 11 }}
//               label={{ 
//                 value: 'Rainfall (mm) ↓', 
//                 angle: -90, 
//                 position: 'insideLeft',
//                 style: { fontSize: 12, fill: '#10b981' }
//               }}
//               domain={[0, rainfallStats.max * 1.1]} // Add 10% padding
//             />
            
//             {/* Right Y-Axis: Runoff */}
//             <YAxis 
//               yAxisId="runoff"
//               orientation="right"
//               stroke="#3b82f6"
//               tick={{ fontSize: 11 }}
//               label={{ 
//                 value: 'Runoff (m³/s)', 
//                 angle: 90, 
//                 position: 'insideRight',
//                 style: { fontSize: 12, fill: '#3b82f6' }
//               }}
//               domain={[0, runoffStats.max * 1.1]} // Add 10% padding
//             />
            
//             <Tooltip content={<CustomTooltip />} />
            
//             <Legend 
//               verticalAlign="top" 
//               height={36}
//               iconType="square"
//             />
            
//             {/* Rainfall as INVERTED BARS (top, falling down) */}
//             <Bar 
//               yAxisId="rainfall"
//               dataKey="rainfall"
//               fill="#10b981"
//               opacity={0.7}
//               name="Rainfall (mm)"
//               isAnimationActive={true}
//               animationDuration={1000}
//             />
            
//             {/* Runoff as AREA CHART (bottom) */}
//             <Area 
//               yAxisId="runoff"
//               type="monotone"
//               dataKey="runoff"
//               stroke="#3b82f6"
//               strokeWidth={2}
//               fill="url(#runoffAreaGradient)"
//               name="Runoff (m³/s)"
//               isAnimationActive={true}
//               animationDuration={1000}
//             />
//           </ComposedChart>
//         </ResponsiveContainer>

//         {/* Statistics Display */}
//         <div className="chart-stats-grid">
//           <div className="stats-column">
//             <h4>🌧️ Rainfall Statistics</h4>
//             <div className="stat-row">
//               <span className="stat-label">Maximum:</span>
//               <span className="stat-value">{rainfallStats.max.toFixed(2)} mm</span>
//             </div>
//             <div className="stat-row">
//               <span className="stat-label">Minimum:</span>
//               <span className="stat-value">{rainfallStats.min.toFixed(2)} mm</span>
//             </div>
//             <div className="stat-row">
//               <span className="stat-label">Average:</span>
//               <span className="stat-value">{rainfallStats.avg.toFixed(2)} mm</span>
//             </div>
//           </div>

//           <div className="stats-column">
//             <h4>💧 Runoff Statistics</h4>
//             <div className="stat-row">
//               <span className="stat-label">Maximum:</span>
//               <span className="stat-value">{runoffStats.max.toFixed(2)} m³/s</span>
//             </div>
//             <div className="stat-row">
//               <span className="stat-label">Minimum:</span>
//               <span className="stat-value">{runoffStats.min.toFixed(2)} m³/s</span>
//             </div>
//             <div className="stat-row">
//               <span className="stat-label">Average:</span>
//               <span className="stat-value">{runoffStats.avg.toFixed(2)} m³/s</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Run Models Button */}
//       <div className="panel-actions">
//         <button 
//           className="run-button"
//           onClick={handleRunModels}
//           disabled={isRunning}
//         >
//           {isRunning ? (
//             <>
//               <span className="spinner"></span>
//               Running Model Analysis on Complete Dataset...
//             </>
//           ) : (
//             <>
//               🚀 Run Model Comparison on {displayData.length} Data Points
//             </>
//           )}
//         </button>
//       </div>

//       <div className="data-info">
//         <p>
//           📈 Displaying complete dataset: <strong>{displayData.length} observations</strong> 
//           | Rainfall shown as inverted bars (rain falling) 
//           | Runoff shown as area chart
//         </p>
//       </div>
//     </div>
//   );
// }





















import { useEffect, useMemo, useRef, useState } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { calculateModelMetrics } from "../utils/dataLoader";

function formatNum(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "0";
  if (num >= 1000) return num.toFixed(0);
  if (num >= 100) return num.toFixed(1);
  return num.toFixed(2);
}

function makeBinnedData(data, binSize = 7) {
  if (data.length <= 12) {
    return data.map((d) => ({
      time: d.time,
      month: d.month,
      rainfall_binned: d.rainfall,
      runoff: d.runoff || 0,
    }));
  }

  const out = [];
  for (let i = 0; i < data.length; i += binSize) {
    const chunk = data.slice(i, i + binSize);

    const sumRain = chunk.reduce((acc, d) => acc + (Number(d.rainfall) || 0), 0);
    const avgRunoff =
      chunk.reduce((acc, d) => acc + (Number(d.runoff) || 0), 0) / chunk.length;

    const midIndex = i + Math.floor(chunk.length / 2);
    const time = Number(data[midIndex]?.time ?? i + 1);

    out.push({
      time,
      rainfall_binned: sumRain,
      runoff: avgRunoff,
    });
  }

  return out;
}

const RenderCustomBarLabel = (props) => {
  const { x, y, width, value } = props;
  
  if (!value || value === 0) return null;
  
  return (
    <text
      x={x + width / 2}
      y={y - 10}
      fill="#1d4ed8"
      textAnchor="middle"
      dominantBaseline="auto"
      fontSize="13"
      fontWeight="700"
      fontFamily="system-ui, sans-serif"
    >
      {value.toFixed(1)}
    </text>
  );
};

export default function ChartsPanel({ selectedPoint, csvData, onRunModels, averageRainfall, isPolygonAverage }) {
  const [isRunning, setIsRunning] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const lastKeyRef = useRef("");

  if (!csvData || !selectedPoint) return null;

  const rawData = csvData;
  const isMonthlyData = rawData.length === 12 && rawData[0]?.month;

  // Check if this is CHIRPS data (monthly) or uploaded CSV (daily with runoff)
  const isChirpsData = isMonthlyData;
  const isUploadedCSV = !isMonthlyData && rawData.some(d => d.runoff > 0);

  const binSize = useMemo(() => {
    if (isMonthlyData) return 1;
    const n = rawData.length;
    if (n <= 600) return 1;
    if (n <= 1200) return 3;
    if (n <= 2500) return 5;
    return 7;
  }, [rawData.length, isMonthlyData]);

  const chartDataFull = useMemo(
    () => makeBinnedData(rawData, binSize),
    [rawData, binSize]
  );

  const chartData = useMemo(() => {
    if (visibleCount <= 0) return [];
    return chartDataFull.slice(0, visibleCount);
  }, [chartDataFull, visibleCount]);

  const rainfallStats = useMemo(() => {
    const vals = rawData.map((d) => Number(d.rainfall) || 0);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { max, min, avg };
  }, [rawData]);

  const runoffStats = useMemo(() => {
    const vals = rawData.map((d) => Number(d.runoff) || 0);
    const max = Math.max(...vals);
    const min = Math.min(...vals);
    const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
    return { max, min, avg };
  }, [rawData]);

  const tickInterval = useMemo(() => {
    if (isMonthlyData) return 0;
    const desiredLabels = 10;
    const n = Math.max(1, chartDataFull.length);
    return Math.max(1, Math.floor(n / desiredLabels));
  }, [chartDataFull.length, isMonthlyData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload || !payload.length) return null;
    const p = payload[0]?.payload;
    if (!p) return null;

    return (
      <div
        style={{
          background: "white",
          border: "2px solid #2563eb",
          borderRadius: "8px",
          padding: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <p style={{ margin: "0 0 8px 0", fontWeight: "600", color: "#1e293b" }}>
          {isMonthlyData ? p.month : `Day ${label}`}
        </p>

        <p style={{ margin: "4px 0", color: "#2563eb", fontSize: "13px" }}>
          🌧️ Rainfall: {formatNum(p.rainfall_binned)} mm
        </p>

        {p.runoff > 0 && (
          <p style={{ margin: "4px 0", color: "#16a34a", fontSize: "13px" }}>
            💧 Runoff: {formatNum(p.runoff)} m³/s
          </p>
        )}
      </div>
    );
  };

  const datasetKey = `${selectedPoint.lat.toFixed(4)}_${selectedPoint.lng.toFixed(4)}_${rawData.length}_${binSize}_${isPolygonAverage}`;

  useEffect(() => {
    if (lastKeyRef.current === datasetKey) return;
    lastKeyRef.current = datasetKey;

    const total = chartDataFull.length;
    
    setVisibleCount(0);

    let start = null;
    const duration = isMonthlyData ? 1200 : 2200;

    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min(1, (ts - start) / duration);

      const eased = 1 - Math.pow(1 - progress, 3);

      const nextCount = Math.floor(total * eased);

      setVisibleCount(nextCount);

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [datasetKey, chartDataFull.length, isMonthlyData]);

  const handleRunModels = async () => {
    if (isMonthlyData) {
      alert("Model analysis is not available for monthly CHIRPS data");
      return;
    }

    setIsRunning(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const splitIndex = Math.floor(rawData.length * 0.8);
    const trainData = rawData.slice(0, splitIndex);
    const testData = rawData.slice(splitIndex);

    const models = calculateModelMetrics(trainData, testData);

    onRunModels({
      models,
      rainfall: rawData,
      runoff: rawData,
      trainSize: trainData.length,
      testSize: testData.length,
    });

    setIsRunning(false);
  };

  return (
    <div className="charts-panel">
      <div className="panel-header">
        <div className="location-info">
          <span className="info-badge">📍 Location</span>
          <span className="info-value">
            {isPolygonAverage 
              ? "Polygon Average" 
              : `${selectedPoint.lat.toFixed(4)}°N, ${selectedPoint.lng.toFixed(4)}°E`
            }
          </span>

          <span className="info-badge">📊 Dataset</span>
          <span className="info-value">
            {isMonthlyData
              ? "12 months (2025)"
              : `${rawData.length} days (${binSize}-day bins)`}
          </span>
        </div>
      </div>

      <div className="combined-chart-section">
        <div className="chart-header">
          <h3>
            {isPolygonAverage 
              ? "Polygon Average Rainfall (CHIRPS 2025)"
              : isMonthlyData
              ? "Monthly Rainfall (CHIRPS 2025)"
              : "Rainfall–Runoff Hydrograph"
            }
          </h3>
          <p className="chart-description">
            {isPolygonAverage
              ? "Average rainfall across all CHIRPS points in the polygon"
              : isMonthlyData
              ? "Monthly rainfall distribution (estimated from annual total)"
              : "Rainfall (blue, inverted) + Runoff (green)"
            }
          </p>
        </div>

        <div style={{ width: "100%", height: "520px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={chartData}
              margin={{ top: 40, right: 35, left: 35, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />

              <XAxis
                dataKey={isMonthlyData ? "month" : "time"}
                interval={tickInterval}
                tick={{ fontSize: 11, fill: "#64748b" }}
                stroke="#94a3b8"
                angle={isMonthlyData ? -45 : 0}
                textAnchor={isMonthlyData ? "end" : "middle"}
                height={isMonthlyData ? 80 : 30}
                label={
                  !isMonthlyData
                    ? {
                        value: "Time (days)",
                        position: "insideBottom",
                        offset: -10,
                        fill: "#64748b",
                        fontSize: 12,
                      }
                    : undefined
                }
              />

              {runoffStats.max > 0 && (
                <YAxis
                  yAxisId="runoff"
                  domain={[0, Math.max(1, runoffStats.max * 1.1)]}
                  tick={{ fontSize: 11, fill: "#16a34a" }}
                  stroke="#16a34a"
                  width={65}
                  label={{
                    value: "Runoff (m³/s)",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#16a34a",
                    fontSize: 12,
                  }}
                />
              )}

              <YAxis
                yAxisId="rainfall"
                orientation="right"
                reversed={true}
                domain={[0, Math.max(1, rainfallStats.max * 1.3)]}
                tick={{ fontSize: 11, fill: "#2563eb" }}
                stroke="#2563eb"
                width={55}
                label={{
                  value: "Rainfall (mm) ↓",
                  angle: 90,
                  position: "insideRight",
                  fill: "#2563eb",
                  fontSize: 12,
                }}
              />

              <Tooltip content={<CustomTooltip />} />

              <Bar
                yAxisId="rainfall"
                dataKey="rainfall_binned"
                fill="#2563eb"
                opacity={0.9}
                barSize={isMonthlyData ? 28 : 8}
                isAnimationActive={false}
              >
                {/* CRITICAL FIX: Only show labels for CHIRPS data, NOT for uploaded CSV */}
                {isChirpsData && (
                  <LabelList
                    dataKey="rainfall_binned"
                    content={RenderCustomBarLabel}
                  />
                )}
              </Bar>

              {runoffStats.max > 0 && (
                <Line
                  yAxisId="runoff"
                  type="natural"
                  dataKey="runoff"
                  stroke="#16a34a"
                  strokeWidth={2.3}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div style={{ marginTop: 10, fontSize: 13, color: "#475569" }}>
          <strong>Rainfall</strong> Max: {formatNum(rainfallStats.max)} mm | Avg:{" "}
          {formatNum(rainfallStats.avg)} mm
          {runoffStats.max > 0 && (
            <>
              {" "}
              <span style={{ margin: "0 10px" }}>|</span>
              <strong>Runoff</strong> Max: {formatNum(runoffStats.max)} m³/s |
              Avg: {formatNum(runoffStats.avg)} m³/s
            </>
          )}
        </div>
      </div>

      {/* SHOW AVERAGE BELOW CHART FOR POLYGON AVERAGE */}
      {isPolygonAverage && averageRainfall !== null && (
        <div
          style={{
            padding: "20px",
            backgroundColor: "#eff6ff",
            borderRadius: "10px",
            textAlign: "center",
            marginTop: "20px",
            border: "2px solid #bfdbfe",
          }}
        >
          <div style={{ fontSize: "13px", color: "#64748b", marginBottom: "8px", fontWeight: "600" }}>
            Average Annual Rainfall (GPM)
          </div>
          <div style={{ fontSize: "28px", fontWeight: "700", color: "#2563eb" }}>
            {averageRainfall.toFixed(2)} mm
          </div>
        </div>
      )}

      {!isMonthlyData && (
        <div className="panel-actions">
          <button
            className="run-button"
            onClick={handleRunModels}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <span className="spinner"></span>
                Running Model Analysis...
              </>
            ) : (
              <>Run Model Comparison</>
            )}
          </button>
        </div>
      )}

      <div className="data-info">
        <p>
          {isPolygonAverage ? (
            <>
              ✅ Showing <strong>average rainfall</strong> across all CHIRPS points in the polygon
            </>
          ) : isMonthlyData ? (
            <>
              ✅ CHIRPS rainfall data for <strong>2025</strong> (monthly distribution estimated)
            </>
          ) : (
            <>
              ✅ Runoff uses <strong>{rawData.length}</strong> points | Rainfall
              shown as <strong>{binSize}-day bins</strong> for clarity
            </>
          )}
        </p>
      </div>
    </div>
  );
}