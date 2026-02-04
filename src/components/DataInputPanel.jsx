// import { useState } from "react";

// export default function DataInputPanel({ selectedPoint, selectedVariable, onSubmit }) {
//   const [rainfallValue, setRainfallValue] = useState(50);
//   const [runoffValue, setRunoffValue] = useState(30);
//   const [isLoading, setIsLoading] = useState(false);
  
//   const rainfallOptions = [
//     { id: 1, value: 25, label: "Low (25 mm)" },
//     { id: 2, value: 50, label: "Medium (50 mm)" },
//     { id: 3, value: 75, label: "High (75 mm)" },
//     { id: 4, value: 100, label: "Very High (100 mm)" },
//     { id: 5, value: 150, label: "Extreme (150 mm)" },
//   ];

//   const runoffOptions = [
//     { id: 1, value: 15, label: "Low (15 m³/s)" },
//     { id: 2, value: 30, label: "Medium (30 m³/s)" },
//     { id: 3, value: 50, label: "High (50 m³/s)" },
//     { id: 4, value: 80, label: "Very High (80 m³/s)" },
//     { id: 5, value: 120, label: "Extreme (120 m³/s)" },
//   ];

//   const handleLoadData = async () => {
//     setIsLoading(true);
    
//     await new Promise(resolve => setTimeout(resolve, 800));

//     const data = {
//       rainfallInput: rainfallValue,
//       runoffInput: runoffValue,
//       timestamp: new Date().toLocaleTimeString(),
//     };

//     onSubmit(data);
//     setIsLoading(false);
//   };

//   return (
//     <div className="data-input-panel">
//       <div className="panel-header">
//         <h2> Input Data Values</h2>
//         <p className="subtitle">Select stored data from the model for this location</p>
//       </div>

//       <div className="location-badge">
//         <span className="badge-item"> {selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
//       </div>

//       <form className="input-form">
//         {/* Rainfall Input */}
//         <div className="input-section">
//           <div className="section-header">
//             <h3> Rainfall Data</h3>
//             <span className="section-description">Select stored rainfall value</span>
//           </div>

//           <div className="input-group">
//             <label className="input-label">Stored Rainfall Values (mm)</label>
//             <select 
//               className="input-select"
//               value={rainfallValue}
//               onChange={(e) => setRainfallValue(parseFloat(e.target.value))}
//             >
//               {rainfallOptions.map(opt => (
//                 <option key={opt.id} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="input-preview">
//               <span className="preview-label">Selected:</span>
//               <span className="preview-value">{rainfallValue} mm</span>
//             </div>

//             <div className="slider-container">
//               <input 
//                 type="range"
//                 min="0"
//                 max="200"
//                 step="10"
//                 value={rainfallValue}
//                 onChange={(e) => setRainfallValue(parseFloat(e.target.value))}
//                 className="slider"
//               />
//               <div className="slider-labels">
//                 <span>0</span>
//                 <span>200 mm</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Runoff Input */}
//         <div className="input-section">
//           <div className="section-header">
//             <h3> Runoff Data</h3>
//             <span className="section-description">Select stored runoff value</span>
//           </div>

//           <div className="input-group">
//             <label className="input-label">Stored Runoff Values (m³/s)</label>
//             <select 
//               className="input-select"
//               value={runoffValue}
//               onChange={(e) => setRunoffValue(parseFloat(e.target.value))}
//             >
//               {runoffOptions.map(opt => (
//                 <option key={opt.id} value={opt.value}>
//                   {opt.label}
//                 </option>
//               ))}
//             </select>

//             <div className="input-preview">
//               <span className="preview-label">Selected:</span>
//               <span className="preview-value">{runoffValue} m³/s</span>
//             </div>

//             <div className="slider-container">
//               <input 
//                 type="range"
//                 min="0"
//                 max="150"
//                 step="5"
//                 value={runoffValue}
//                 onChange={(e) => setRunoffValue(parseFloat(e.target.value))}
//                 className="slider"
//               />
//               <div className="slider-labels">
//                 <span>0</span>
//                 <span>150 m³/s</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Summary */}
//         <div className="input-summary">
//           <h4> Summary</h4>
//           <div className="summary-grid">
//             <div className="summary-item">
//               <span className="summary-label">Rainfall Input:</span>
//               <span className="summary-value">{rainfallValue} mm</span>
//             </div>
//             <div className="summary-item">
//               <span className="summary-label">Runoff Input:</span>
//               <span className="summary-value">{runoffValue} m³/s</span>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="form-actions">
//           <button 
//             type="button"
//             className="load-button"
//             onClick={handleLoadData}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <>
//                 <span className="spinner"></span>
//                 Loading Data...
//               </>
//             ) : (
//               <>
//                 ✓ Load Data
//               </>
//             )}
//           </button>
//         </div>
//       </form>

//       <div className="info-box">
//         <p> <strong>Next Step:</strong> After clicking "Load Data", the rainfall and runoff graphs will appear, then you can run the model comparison.</p>
//       </div>
//     </div>
//   );
// }
