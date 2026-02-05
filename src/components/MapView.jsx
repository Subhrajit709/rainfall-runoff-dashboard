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

























import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  GeoJSON,
  LayersControl,
  useMap,
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { loadCSVFromFile } from "../utils/dataLoader";

/* ---------- Fix Leaflet marker icons ---------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ---------- GeoJSON Styles ---------- */
const catchmentStyle = {
  fillColor: "#00ff88",
  weight: 3,
  opacity: 1,
  color: "#00ff88",
  fillOpacity: 0.15,
};

const riverStyle = {
  color: "#00c8ff",
  weight: 3,
  opacity: 0.9,
};

const outletStyle = {
  radius: 6,
  fillColor: "#ff1744",
  color: "#ffffff",
  weight: 2,
  opacity: 1,
  fillOpacity: 1,
};

/* ---------- Map Click Handler ---------- */
function ClickHandler({ onPointSelect, disabled }) {
  useMapEvents({
    click(e) {
      if (disabled) return;
      onPointSelect(e.latlng);
    },
  });
  return null;
}

/* ============================================================
   🔁 Refresh Button Control (TOP-RIGHT)
   - Does NOT affect Choose File styling
   - Only resets selected point + popup state
============================================================ */
function ResetPointControl({ onReset }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const control = L.control({ position: "topright" });

    control.onAdd = function () {
      const div = L.DomUtil.create("div", "leaflet-bar leaflet-control");

      div.innerHTML = `
        <button
          type="button"
          class="map-reset-btn"
          title="Reset point selection"
          aria-label="Reset point selection"
        >
          ↻
        </button>
      `;

      const btn = div.querySelector("button");

      // Prevent map click/drag
      L.DomEvent.disableClickPropagation(div);
      L.DomEvent.disableScrollPropagation(div);

      // Click handler
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        onReset();
      });

      return div;
    };

    control.addTo(map);

    return () => {
      control.remove();
    };
  }, [map, onReset]);

  return null;
}

export default function MapView({ onDataInputComplete, pointFileMemory }) {
  const [point, setPoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [catchmentData, setCatchmentData] = useState(null);
  const [riverData, setRiverData] = useState(null);
  const [outletData, setOutletData] = useState(null);

  const popupRef = useRef(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingCSV, setLoadingCSV] = useState(false);
  const [fileError, setFileError] = useState(null);
  const [fileReport, setFileReport] = useState(null);

  /* ---------- GeoJSON Loader ---------- */
  useEffect(() => {
    const loadGeoJSON = async () => {
      try {
        const [c, r, o] = await Promise.all([
          fetch("/geojson/catchment.geojson").then((r) => r.json()),
          fetch("/geojson/river.geojson").then((r) => r.json()),
          fetch("/geojson/outlet.geojson").then((r) => r.json()),
        ]);

        setCatchmentData(c);
        setRiverData(r);
        setOutletData(o);

        console.log("✅ GeoJSON loaded");
      } catch (err) {
        console.error("❌ GeoJSON load error:", err);
      }
    };
    loadGeoJSON();
  }, []);

  /* ---------- Popup Click Lock (IMPORTANT FIX) ---------- */
  useEffect(() => {
    if (!popupRef.current?._container) return;

    const container = popupRef.current._container;

    // Leaflet disables clicks/scroll inside popup. We allow it.
    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    // Extra: stop Leaflet from blocking file input click
    const stopEvents = (e) => {
      e.stopPropagation();
    };

    // Attach listeners so file input works
    container.addEventListener("mousedown", stopEvents, true);
    container.addEventListener("touchstart", stopEvents, true);
    container.addEventListener("pointerdown", stopEvents, true);

    return () => {
      container.removeEventListener("mousedown", stopEvents, true);
      container.removeEventListener("touchstart", stopEvents, true);
      container.removeEventListener("pointerdown", stopEvents, true);
    };
  }, [showPopup]);

  const stop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handlePointSelect = (latlng) => {
    setPoint(latlng);
    setShowPopup(true);

    // Reset popup state
    setSelectedFile(null);
    setFileError(null);
    setFileReport(null);
  };

  // Key for point memory
  const pointKey = point
    ? `${point.lat.toFixed(4)},${point.lng.toFixed(4)}`
    : null;

  const lastMemory = pointKey ? pointFileMemory?.[pointKey] : null;

  const handleFilePick = async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setFileError(null);
    setFileReport(null);

    setLoadingCSV(true);
    try {
      const validated = await loadCSVFromFile(file);
      setFileReport({
        name: file.name,
        rows: validated.data.length,
        report: validated.report,
      });
    } catch (err) {
      setFileError(err.message);
    } finally {
      setLoadingCSV(false);
    }
  };

  const handleLoadData = async () => {
    if (!selectedFile && !lastMemory) {
      setFileError("Please choose a CSV file first.");
      return;
    }

    const fileToUse = selectedFile || lastMemory?.file;

    if (!fileToUse) {
      setFileError("Previous file not found. Please upload again.");
      return;
    }

    setLoadingCSV(true);
    setFileError(null);

    try {
      const validated = await loadCSVFromFile(fileToUse);

      onDataInputComplete({
        point,
        csvData: validated.data,
        file: fileToUse,
        fileName: fileToUse.name,
      });

      setShowPopup(false);
    } catch (err) {
      setFileError(err.message);
    } finally {
      setLoadingCSV(false);
    }
  };

  // Drag drop
  const handleDrop = (e) => {
    stop(e);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFilePick(file);
  };

  // ✅ RESET HANDLER (for ↻ button)
  const handleResetPoint = () => {
    setPoint(null);
    setShowPopup(false);

    // reset upload states too
    setSelectedFile(null);
    setLoadingCSV(false);
    setFileError(null);
    setFileReport(null);
  };

  return (
    <MapContainer
      center={[20.5, 82.5]}
      zoom={5}
      className="map"
      style={{ height: "100%", width: "100%" }}
    >
      {/* 🔁 Refresh button */}
      <ResetPointControl onReset={handleResetPoint} />

      {/* ---------- Base Maps ---------- */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Hybrid (Default)">
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="© Google Hybrid"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Satellite">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri — World Imagery"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="Terrain">
          <TileLayer
            url="https://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            attribution="© Google Terrain"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* ---------- GeoJSON Layers ---------- */}
      {catchmentData && <GeoJSON data={catchmentData} style={catchmentStyle} />}
      {riverData && <GeoJSON data={riverData} style={riverStyle} />}
      {outletData && (
        <GeoJSON
          data={outletData}
          pointToLayer={(f, latlng) => L.circleMarker(latlng, outletStyle)}
        />
      )}

      <ClickHandler onPointSelect={handlePointSelect} disabled={showPopup} />

      {/* ---------- Upload Popup ---------- */}
      {point && showPopup && (
        <Marker position={[point.lat, point.lng]}>
          <Popup
            ref={popupRef}
            closeOnClick={false}
            autoClose={false}
            closeButton
            className="map-popup"
            autoPan={true}
            keepInView={true}
          >
            <div className="popup-inner" onClick={stop}>
              <div className="popup-header">
                <h4>📂 Upload CSV for This Location</h4>
                <p className="popup-subtitle">
                  Upload any rainfall-runoff CSV file from your storage.
                </p>
              </div>

              <div className="location-display">
                <div className="location-item">
                  <span className="location-label">📍 Selected Location:</span>
                  <span className="location-value">
                    {point.lat.toFixed(4)}°N, {point.lng.toFixed(4)}°E
                  </span>
                </div>

                {lastMemory?.fileName && (
                  <div className="location-item">
                    <span className="location-label">🕒 Last File:</span>
                    <span className="location-value">{lastMemory.fileName}</span>
                  </div>
                )}
              </div>

              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: "2px dashed #94a3b8",
                  borderRadius: 10,
                  padding: 14,
                  background: "#f8fafc",
                  marginBottom: 12,
                  cursor: "pointer",
                }}
              >
                <p style={{ margin: 0, fontSize: 13, color: "#475569" }}>
                  Drag & Drop CSV here, or click below to choose
                </p>
              </div>

              {/* Choose file (NO STYLE CHANGE, but now works) */}
              <input
                type="file"
                accept=".csv"
                onClick={(e) => e.stopPropagation()} // CRITICAL
                onChange={(e) => handleFilePick(e.target.files?.[0])}
                style={{ marginBottom: 12, width: "100%" }}
              />

              {/* Report */}
              {loadingCSV && (
                <div
                  style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}
                >
                  ⏳ Reading CSV...
                </div>
              )}

              {fileReport && (
                <div
                  style={{
                    fontSize: 13,
                    background: "#dcfce7",
                    border: "1px solid #86efac",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                    color: "#166534",
                  }}
                >
                  ✅ Selected: <b>{fileReport.name}</b> <br />
                  Rows: <b>{fileReport.rows}</b>
                </div>
              )}

              {fileError && (
                <div
                  style={{
                    fontSize: 13,
                    background: "#fef2f2",
                    border: "1px solid #fecaca",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 10,
                    color: "#991b1b",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  ❌ {fileError}
                </div>
              )}

              {/* Load */}
              <button
                className="popup-load-btn"
                onClick={handleLoadData}
                disabled={loadingCSV}
              >
                {loadingCSV ? "Loading..." : "✓ Load Data & Visualize"}
              </button>

              <div className="popup-info">
                <p>
                  💡 You can upload a new CSV anytime. The last uploaded file is
                  remembered for this point.
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
