// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
//   GeoJSON,
//   LayersControl,
// } from "react-leaflet";
// import { useState, useRef, useEffect } from "react";
// import L from "leaflet";
// import { findMatchingSegment, validateUserInput, getValidationReport } from "../utils/dataLoader";
// import "leaflet/dist/leaflet.css";

// /* ---------- Fix Leaflet marker icons ---------- */
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// /* ---------- GeoJSON Styles ---------- */
// const catchmentStyle = {
//   fillColor: "#00ff88",
//   weight: 3,
//   opacity: 1,
//   color: "#00ff88",
//   fillOpacity: 0.15,
// };

// const riverStyle = {
//   color: "#00c8ff",
//   weight: 3,
//   opacity: 0.9,
// };

// const outletStyle = {
//   radius: 6,
//   fillColor: "#ff1744",
//   color: "#ffffff",
//   weight: 2,
//   opacity: 1,
//   fillOpacity: 1,
// };

// /* ---------- Map Click Handler ---------- */
// function ClickHandler({ onPointSelect, disabled }) {
//   useMapEvents({
//     click(e) {
//       if (disabled) return;
//       onPointSelect(e.latlng);
//     },
//   });
//   return null;
// }

// export default function MapView({ onDataInputComplete, csvData }) {
//   const [point, setPoint] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);
//   const [inputStep, setInputStep] = useState("initial");
//   const [rainfallValue, setRainfallValue] = useState("");
//   const [runoffValue, setRunoffValue] = useState("");
//   const [validationError, setValidationError] = useState(null);

//   const [catchmentData, setCatchmentData] = useState(null);
//   const [riverData, setRiverData] = useState(null);
//   const [outletData, setOutletData] = useState(null);

//   const popupRef = useRef(null);

//   /* ---------- Get CSV ranges for display ---------- */
//   const csvRanges = getValidationReport();

//   /* ---------- GeoJSON Loader ---------- */
//   useEffect(() => {
//     const loadGeoJSON = async () => {
//       try {
//         const [c, r, o] = await Promise.all([
//           fetch("/geojson/catchment.geojson").then((r) => r.json()),
//           fetch("/geojson/river.geojson").then((r) => r.json()),
//           fetch("/geojson/outlet.geojson").then((r) => r.json()),
//         ]);

//         setCatchmentData(c);
//         setRiverData(r);
//         setOutletData(o);

//         console.log("✅ GeoJSON loaded");
//       } catch (err) {
//         console.error("❌ GeoJSON load error:", err);
//       }
//     };
//     loadGeoJSON();
//   }, []);

//   /* ---------- Popup Click Lock ---------- */
//   useEffect(() => {
//     if (popupRef.current?._container) {
//       L.DomEvent.disableClickPropagation(popupRef.current._container);
//       L.DomEvent.disableScrollPropagation(popupRef.current._container);
//     }
//   }, [inputStep, showPopup]);

//   /* ---------- Logic ---------- */
//   const handlePointSelect = (latlng) => {
//     if (point) return;
//     setPoint(latlng);
//     setShowPopup(true);
//     setInputStep("initial");
//     setRainfallValue("");
//     setRunoffValue("");
//     setValidationError(null);
//   };

//   const handleRainfallNext = () => {
//     if (rainfallValue) {
//       setValidationError(null);
//       setInputStep("runoff-initial");
//     }
//   };

//   const handleRunoffNext = () => {
//     if (runoffValue) {
//       setValidationError(null);
//       setInputStep("complete");
//     }
//   };

//   const handleLoadData = () => {
//     const rainfallInput = Number(rainfallValue);
//     const runoffInput = Number(runoffValue);

//     // Validate input against CSV range
//     const validation = validateUserInput(rainfallInput, runoffInput);
    
//     if (!validation.valid) {
//       setValidationError(validation.errors.join('\n'));
//       return;
//     }

//     // Find matching segment in CSV
//     const matchResult = findMatchingSegment(csvData, rainfallInput, runoffInput, 15);

//     if (!matchResult.found) {
//       setValidationError(matchResult.message + '\n\n' + matchResult.suggestion);
//       return;
//     }

//     // Success - pass data to parent
//     onDataInputComplete({
//       point,
//       rainfallInput,
//       runoffInput,
//       matchResult,
//       timestamp: new Date().toISOString(),
//     });
//     setShowPopup(false);
//   };

//   const stop = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//   };

//   return (
//     <MapContainer
//       center={[20.5, 82.5]}
//       zoom={5}
//       className="map"
//       style={{ height: "100%", width: "100%" }}
//     >
//       {/* ---------- Base Maps (HYBRID DEFAULT) ---------- */}
//       <LayersControl position="topright">
//         <LayersControl.BaseLayer checked name="Hybrid (Default)">
//           <TileLayer
//             url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
//             subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             attribution="© Google Hybrid"
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Satellite">
//           <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution="© Esri — World Imagery"
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Terrain">
//           <TileLayer
//             url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
//             subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             attribution="© Google Terrain"
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>

//       {/* ---------- GeoJSON Layers ---------- */}
//       {catchmentData && (
//         <GeoJSON data={catchmentData} style={catchmentStyle} />
//       )}
//       {riverData && <GeoJSON data={riverData} style={riverStyle} />}
//       {outletData && (
//         <GeoJSON
//           data={outletData}
//           pointToLayer={(f, latlng) =>
//             L.circleMarker(latlng, outletStyle)
//           }
//         />
//       )}

//       <ClickHandler onPointSelect={handlePointSelect} disabled={showPopup} />

//       {/* ---------- Marker & Popup ---------- */}
//       {point && showPopup && (
//         <Marker position={[point.lat, point.lng]}>
//           <Popup
//             ref={popupRef}
//             closeOnClick={false}
//             autoClose={false}
//             closeButton
//             className="map-popup"
//           >
//             <div className="popup-inner" onClick={stop}>
//               {/* CSV Range Display */}
//               {csvRanges && inputStep === "initial" && (
//                 <div className="csv-range-info">
//                   <div className="range-header">📊 Valid CSV Ranges</div>
//                   <div className="range-item">
//                     🌧️ Rainfall: {csvRanges.rainfall.min.toFixed(1)} - {csvRanges.rainfall.max.toFixed(1)} mm
//                   </div>
//                   <div className="range-item">
//                     💧 Runoff: {csvRanges.runoff.min.toFixed(1)} - {csvRanges.runoff.max.toFixed(1)} m³/s
//                   </div>
//                 </div>
//               )}

//               {/* Validation Error Display */}
//               {validationError && (
//                 <div className="validation-error">
//                   <div className="error-icon">⚠️</div>
//                   <div className="error-text">{validationError}</div>
//                   <button 
//                     className="error-ok-btn"
//                     onClick={() => {
//                       setValidationError(null);
//                       setInputStep("rainfall-input");
//                     }}
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               )}

//               {!validationError && (
//                 <>
//                   {inputStep === "initial" && (
//                     <>
//                       <h4>Enter Data Values</h4>
//                       <div className="popup-buttons">
//                         <button
//                           className="popup-btn rainfall-btn"
//                           onClick={() => setInputStep("rainfall-input")}
//                         >
//                           🌧️ Enter Rainfall
//                         </button>
//                         <button
//                           className="popup-btn runoff-btn"
//                           disabled
//                           style={{ opacity: 0.5, cursor: "not-allowed" }}
//                         >
//                           💧 Enter Runoff (Complete rainfall first)
//                         </button>
//                       </div>
//                     </>
//                   )}

//                   {inputStep === "rainfall-input" && (
//                     <>
//                       <h4>🌧️ Rainfall Value (mm)</h4>
//                       <div className="input-hint">
//                         Range: {csvRanges.rainfall.min.toFixed(1)} - {csvRanges.rainfall.max.toFixed(1)} mm
//                       </div>
//                       <input
//                         type="number"
//                         className="popup-input"
//                         value={rainfallValue}
//                         onChange={(e) => setRainfallValue(e.target.value)}
//                         onKeyPress={(e) =>
//                           e.key === "Enter" && handleRainfallNext()
//                         }
//                         placeholder={`e.g., ${csvRanges.rainfall.mean.toFixed(1)}`}
//                         autoFocus
//                       />
//                       <button
//                         className="popup-continue-btn"
//                         disabled={!rainfallValue}
//                         onClick={handleRainfallNext}
//                       >
//                         ✓ Continue
//                       </button>
//                       <button
//                         className="popup-back-btn"
//                         onClick={() => setInputStep("initial")}
//                       >
//                         ← Back
//                       </button>
//                     </>
//                   )}

//                   {inputStep === "runoff-initial" && (
//                     <>
//                       <div className="value-confirmed">
//                         ✓ Rainfall: {rainfallValue} mm
//                       </div>
//                       <button
//                         className="popup-btn runoff-btn"
//                         onClick={() => setInputStep("runoff-input")}
//                       >
//                         💧 Enter Runoff
//                       </button>
//                       <button
//                         className="popup-back-btn"
//                         onClick={() => setInputStep("rainfall-input")}
//                       >
//                         ← Change Rainfall
//                       </button>
//                     </>
//                   )}

//                   {inputStep === "runoff-input" && (
//                     <>
//                       <h4>💧 Runoff Value (m³/s)</h4>
//                       <div className="input-hint">
//                         Range: {csvRanges.runoff.min.toFixed(1)} - {csvRanges.runoff.max.toFixed(1)} m³/s
//                       </div>
//                       <input
//                         type="number"
//                         className="popup-input"
//                         value={runoffValue}
//                         onChange={(e) => setRunoffValue(e.target.value)}
//                         onKeyPress={(e) =>
//                           e.key === "Enter" && handleRunoffNext()
//                         }
//                         placeholder={`e.g., ${csvRanges.runoff.mean.toFixed(1)}`}
//                         autoFocus
//                       />
//                       <button
//                         className="popup-continue-btn"
//                         disabled={!runoffValue}
//                         onClick={handleRunoffNext}
//                       >
//                         ✓ Continue
//                       </button>
//                       <button
//                         className="popup-back-btn"
//                         onClick={() => setInputStep("runoff-initial")}
//                       >
//                         ← Back
//                       </button>
//                     </>
//                   )}

//                   {inputStep === "complete" && (
//                     <>
//                       <div className="values-summary">
//                         <div className="value-confirmed">✓ Rainfall: {rainfallValue} mm</div>
//                         <div className="value-confirmed">✓ Runoff: {runoffValue} m³/s</div>
//                       </div>
//                       <button
//                         className="popup-load-btn"
//                         onClick={handleLoadData}
//                       >
//                         ▶ Load & Analyze Data
//                       </button>
//                       <button
//                         className="popup-back-btn"
//                         onClick={() => setInputStep("runoff-input")}
//                       >
//                         ← Change Runoff
//                       </button>
//                     </>
//                   )}
//                 </>
//               )}
//             </div>
//           </Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// }

























// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
//   GeoJSON,
//   LayersControl,
// } from "react-leaflet";
// import { useState, useRef, useEffect } from "react";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// /* ---------- Fix Leaflet marker icons ---------- */
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// /* ---------- GeoJSON Styles ---------- */
// const catchmentStyle = {
//   fillColor: "#00ff88",
//   weight: 3,
//   opacity: 1,
//   color: "#00ff88",
//   fillOpacity: 0.15,
// };

// const riverStyle = {
//   color: "#00c8ff",
//   weight: 3,
//   opacity: 0.9,
// };

// const outletStyle = {
//   radius: 6,
//   fillColor: "#ff1744",
//   color: "#ffffff",
//   weight: 2,
//   opacity: 1,
//   fillOpacity: 1,
// };

// /* ---------- Map Click Handler ---------- */
// function ClickHandler({ onPointSelect, disabled }) {
//   useMapEvents({
//     click(e) {
//       if (disabled) return;
//       onPointSelect(e.latlng);
//     },
//   });
//   return null;
// }

// export default function MapView({ onDataInputComplete, csvData }) {
//   const [point, setPoint] = useState(null);
//   const [showPopup, setShowPopup] = useState(false);

//   const [catchmentData, setCatchmentData] = useState(null);
//   const [riverData, setRiverData] = useState(null);
//   const [outletData, setOutletData] = useState(null);

//   const popupRef = useRef(null);

//   /* ---------- GeoJSON Loader ---------- */
//   useEffect(() => {
//     const loadGeoJSON = async () => {
//       try {
//         const [c, r, o] = await Promise.all([
//           fetch("/geojson/catchment.geojson").then((r) => r.json()),
//           fetch("/geojson/river.geojson").then((r) => r.json()),
//           fetch("/geojson/outlet.geojson").then((r) => r.json()),
//         ]);

//         setCatchmentData(c);
//         setRiverData(r);
//         setOutletData(o);

//         console.log("✅ GeoJSON loaded");
//       } catch (err) {
//         console.error("❌ GeoJSON load error:", err);
//       }
//     };
//     loadGeoJSON();
//   }, []);

//   /* ---------- Popup Click Lock ---------- */
//   useEffect(() => {
//     if (popupRef.current?._container) {
//       L.DomEvent.disableClickPropagation(popupRef.current._container);
//       L.DomEvent.disableScrollPropagation(popupRef.current._container);
//     }
//   }, [showPopup]);

//   /* ---------- Logic ---------- */
//   const handlePointSelect = (latlng) => {
//     if (point) return;
//     setPoint(latlng);
//     setShowPopup(true);
//   };

//   const handleLoadData = () => {
//     // Pass data to parent - no validation needed
//     onDataInputComplete({
//       point,
//       timestamp: new Date().toISOString(),
//     });
//     setShowPopup(false);
//   };

//   const stop = (e) => {
//     e.stopPropagation();
//     e.preventDefault();
//   };

//   return (
//     <MapContainer
//       center={[20.5, 82.5]}
//       zoom={5}
//       className="map"
//       style={{ height: "100%", width: "100%" }}
//     >
//       {/* ---------- Base Maps (HYBRID DEFAULT) ---------- */}
//       <LayersControl position="topright">
//         <LayersControl.BaseLayer checked name="Hybrid (Default)">
//           <TileLayer
//             url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
//             subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             attribution="© Google Hybrid"
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Satellite">
//           <TileLayer
//             url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
//             attribution="© Esri — World Imagery"
//           />
//         </LayersControl.BaseLayer>

//         <LayersControl.BaseLayer name="Terrain">
//           <TileLayer
//             url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
//             subdomains={["mt0", "mt1", "mt2", "mt3"]}
//             attribution="© Google Terrain"
//           />
//         </LayersControl.BaseLayer>
//       </LayersControl>

//       {/* ---------- GeoJSON Layers ---------- */}
//       {catchmentData && (
//         <GeoJSON data={catchmentData} style={catchmentStyle} />
//       )}
//       {riverData && <GeoJSON data={riverData} style={riverStyle} />}
//       {outletData && (
//         <GeoJSON
//           data={outletData}
//           pointToLayer={(f, latlng) =>
//             L.circleMarker(latlng, outletStyle)
//           }
//         />
//       )}

//       <ClickHandler onPointSelect={handlePointSelect} disabled={showPopup} />

//       {/* ---------- Simplified Popup ---------- */}
//       {point && showPopup && (
//         <Marker position={[point.lat, point.lng]}>
//           <Popup
//             ref={popupRef}
//             closeOnClick={false}
//             autoClose={false}
//             closeButton
//             className="map-popup"
//           >
//             <div className="popup-inner" onClick={stop}>
//               <div className="popup-header">
//                 <h4>📊 Load CSV Data for Analysis</h4>
//                 <p className="popup-subtitle">
//                   This will display rainfall-runoff data for all {csvData?.length || 0} time steps
//                 </p>
//               </div>

//               <div className="location-display">
//                 <div className="location-item">
//                   <span className="location-label">📍 Selected Location:</span>
//                   <span className="location-value">
//                     {point.lat.toFixed(4)}°N, {point.lng.toFixed(4)}°E
//                   </span>
//                 </div>
//                 <div className="location-item">
//                   <span className="location-label">📈 Total Data Points:</span>
//                   <span className="location-value">{csvData?.length || 0} observations</span>
//                 </div>
//               </div>

//               <button
//                 className="popup-load-btn"
//                 onClick={handleLoadData}
//               >
//                 ✓ Load Complete Dataset
//               </button>

//               <div className="popup-info">
//                 <p>
//                   💡 The combined rainfall-runoff graph will show the entire time series
//                   with rainfall (inverted bars) and runoff (area chart) together.
//                 </p>
//               </div>
//             </div>
//           </Popup>
//         </Marker>
//       )}
//     </MapContainer>
//   );
// }

























import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const uploadIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate realistic monthly distribution based on total
function generateMonthlyDistribution(totalRainfall) {
  // Monsoon-heavy distribution pattern for realistic data
  // Higher in June-September, lower in winter months
  const monthlyWeights = [
    0.02, 0.03, 0.05, 0.08, 0.12, 0.18,  // Jan-Jun
    0.22, 0.15, 0.10, 0.03, 0.01, 0.01   // Jul-Dec
  ];
  
  return monthlyWeights.map(weight => totalRainfall * weight);
}

function ChirpsPointMarker({ point, onViewChart }) {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const popupRef = useRef(null);

  // Generate monthly data from m2025 total
  const monthlyRainfallData = generateMonthlyDistribution(Number(point.m2025) || 0);

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const getCurrentRainfall = () => {
    return monthlyRainfallData[selectedMonth] || 0;
  };

  const currentRainfall = getCurrentRainfall();
  const lat = point.lat;
  const lng = point.lng;

  if (!lat || !lng) return null;

  const handleViewChart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const monthlyData = MONTH_NAMES.map((monthName, idx) => ({
      time: idx + 1,
      month: monthName,
      rainfall: monthlyRainfallData[idx],
      runoff: 0,
    }));

    console.log("📊 Viewing chart:", { lat, lng, monthlyData });

    if (onViewChart) {
      onViewChart({
        lat,
        lng,
        monthIndex: selectedMonth,
        monthName: MONTH_NAMES[selectedMonth],
        rainfall: currentRainfall,
        allMonthsData: point,
        monthlyData,
      });
    }

    // Close popup after a short delay
    setTimeout(() => {
      if (popupRef.current) {
        popupRef.current._close();
      }
    }, 300);
  };

  return (
    <CircleMarker
      center={[lat, lng]}
      radius={5}
      pathOptions={{
        color: "#1e40af",
        fillColor: "#3b82f6",
        fillOpacity: 0.7,
        weight: 1.5,
      }}
    >
      <Tooltip direction="top" offset={[0, -5]} opacity={0.95}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>
          {currentRainfall.toFixed(2)} mm
        </div>
      </Tooltip>

      <Popup ref={popupRef} maxWidth={280} className="chirps-popup" closeButton={true}>
        <div style={{ minWidth: "240px", fontFamily: "system-ui, sans-serif" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: "20px" }}>🌧️</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e293b" }}>
              CHIRPS Rainfall Data
            </h4>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor={`month-select-${lat}-${lng}`}
              style={{
                fontSize: "13px",
                fontWeight: "600",
                display: "block",
                marginBottom: "8px",
                color: "#475569",
              }}
            >
              Select Month:
            </label>
            <select
              id={`month-select-${lat}-${lng}`}
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                border: "2px solid #cbd5e1",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#1e293b",
                cursor: "pointer",
                fontWeight: "500",
                outline: "none",
              }}
            >
              {MONTH_NAMES.map((month, idx) => (
                <option key={idx} value={idx} style={{ color: "#1e293b" }}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div
            style={{
              padding: "16px",
              backgroundColor: "#eff6ff",
              borderRadius: "8px",
              border: "1px solid #bfdbfe",
              textAlign: "center",
              marginBottom: "16px",
            }}
          >
            <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "6px", fontWeight: "500" }}>
              {MONTH_NAMES[selectedMonth]} 2025
            </div>
            <div style={{ fontSize: "32px", fontWeight: "700", color: "#2563eb", lineHeight: "1" }}>
              {currentRainfall.toFixed(2)}
            </div>
            <div style={{ fontSize: "14px", color: "#64748b", marginTop: "6px", fontWeight: "600" }}>
              mm
            </div>
          </div>

          <button
            onClick={handleViewChart}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1d4ed8";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 12px rgba(37, 99, 235, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 8px rgba(37, 99, 235, 0.3)";
            }}
          >
            <span>📊</span>
            <span>View Rainfall Chart</span>
          </button>

          <div style={{ marginTop: "12px", fontSize: "11px", color: "#94a3b8", textAlign: "center" }}>
            Lat: {lat.toFixed(4)} | Lng: {lng.toFixed(4)}
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}

function UploadMarker({ position, pointFileMemory, onDataInputComplete }) {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const pointKey = `${position.lat.toFixed(4)},${position.lng.toFixed(4)}`;
  const savedFile = pointFileMemory[pointKey];

  useEffect(() => {
    if (savedFile) {
      setFile(savedFile.file);
    }
  }, [savedFile]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleLoadData = () => {
    if (!file) {
      alert("Please select a CSV file first");
      return;
    }

    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data && results.data.length > 0) {
          const firstRow = results.data[0];
          if (!firstRow.hasOwnProperty("rainfall") || !firstRow.hasOwnProperty("runoff")) {
            alert("CSV must contain 'rainfall' and 'runoff' columns");
            return;
          }

          const processedData = results.data.map((row, idx) => ({
            time: row.time || idx + 1,
            rainfall: Number(row.rainfall) || 0,
            runoff: Number(row.runoff) || 0,
          }));

          onDataInputComplete({
            point: position,
            csvData: processedData,
            file: file,
            fileName: file.name,
          });
        }
      },
      error: (error) => {
        alert("Error parsing CSV: " + error.message);
      },
    });
  };

  return (
    <Marker position={position} icon={uploadIcon}>
      <Popup maxWidth={300} className="upload-popup">
        <div style={{ minWidth: "260px", fontFamily: "system-ui, sans-serif" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "16px",
              paddingBottom: "12px",
              borderBottom: "2px solid #fee2e2",
            }}
          >
            <span style={{ fontSize: "20px" }}>📂</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#991b1b" }}>
              Upload Rainfall-Runoff Data
            </h4>
          </div>

          <div
            style={{
              fontSize: "12px",
              marginBottom: "14px",
              color: "#64748b",
              backgroundColor: "#f8fafc",
              padding: "10px",
              borderRadius: "6px",
            }}
          >
            <strong>Location:</strong><br />
            {position.lat.toFixed(4)}°N, {position.lng.toFixed(4)}°E
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              style={{
                fontSize: "12px",
                width: "100%",
                padding: "8px",
                border: "2px dashed #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            />
          </div>

          {file && (
            <div
              style={{
                fontSize: "12px",
                color: "#15803d",
                marginBottom: "12px",
                padding: "8px 12px",
                backgroundColor: "#f0fdf4",
                borderRadius: "6px",
                border: "1px solid #bbf7d0",
              }}
            >
              ✓ <strong>{file.name}</strong>
            </div>
          )}

          <button
            onClick={handleLoadData}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#dc2626",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#b91c1c";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#dc2626";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Load Data & Visualize
          </button>

          <div style={{ fontSize: "10px", color: "#94a3b8", marginTop: "10px", textAlign: "center" }}>
            CSV must have 'rainfall' and 'runoff' columns
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

export default function MapView({ onDataInputComplete, pointFileMemory }) {
  const [catchmentData, setCatchmentData] = useState(null);
  const [riverData, setRiverData] = useState(null);
  const [outletData, setOutletData] = useState(null);
  const [chirpsPoints, setChirpsPoints] = useState([]);
  const [uploadMarker, setUploadMarker] = useState(null);

  useEffect(() => {
    fetch("/geojson/catchment.geojson")
      .then((res) => res.json())
      .then(setCatchmentData)
      .catch(console.error);

    fetch("/geojson/river.geojson")
      .then((res) => res.json())
      .then(setRiverData)
      .catch(console.error);

    fetch("/geojson/outlet.geojson")
      .then((res) => res.json())
      .then(setOutletData)
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetch("/data/chirps_2025_points.csv")
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("✅ CHIRPS points loaded:", results.data.length);
            setChirpsPoints(results.data);
          },
          error: (error) => {
            console.error("Error loading CHIRPS CSV:", error);
          },
        });
      })
      .catch((error) => {
        console.error("Error fetching CHIRPS CSV:", error);
      });
  }, []);

  const handleOutletClick = (e) => {
    setUploadMarker(e.latlng);
  };

  const handleChirpsViewChart = (data) => {
    if (onDataInputComplete) {
      onDataInputComplete({
        point: { lat: data.lat, lng: data.lng },
        csvData: data.monthlyData,
        file: null,
        fileName: `CHIRPS_2025_Lat${data.lat.toFixed(2)}_Lng${data.lng.toFixed(2)}`,
        isChirpsData: true,
      });
    }
  };

  const center = [7.5, 38.5];

  return (
    <div className="map">
      <MapContainer center={center} zoom={10} style={{ height: "100%", width: "100%" }} preferCanvas={true}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap'
        />

        {catchmentData && (
          <GeoJSON data={catchmentData} style={{ color: "#f59e0b", weight: 2, fillOpacity: 0.05 }} />
        )}

        {riverData && (
          <GeoJSON data={riverData} style={{ color: "#3b82f6", weight: 2.5 }} />
        )}

        {outletData && (
          <GeoJSON
            data={outletData}
            style={{ color: "#dc2626", weight: 5 }}
            pointToLayer={(feature, latlng) => {
              return L.circleMarker(latlng, {
                radius: 10,
                fillColor: "#dc2626",
                color: "#7f1d1d",
                weight: 2,
                opacity: 1,
                fillOpacity: 0.9,
              });
            }}
            eventHandlers={{
              click: handleOutletClick,
            }}
          />
        )}

        {chirpsPoints.map((point, idx) => (
          <ChirpsPointMarker key={idx} point={point} onViewChart={handleChirpsViewChart} />
        ))}

        {uploadMarker && (
          <UploadMarker
            position={uploadMarker}
            pointFileMemory={pointFileMemory}
            onDataInputComplete={onDataInputComplete}
          />
        )}
      </MapContainer>
    </div>
  );
}