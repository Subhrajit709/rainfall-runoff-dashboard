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


import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  GeoJSON,
  LayersControl,
} from "react-leaflet";
import { useState, useRef, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

export default function MapView({ onDataInputComplete, csvData }) {
  const [point, setPoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const [catchmentData, setCatchmentData] = useState(null);
  const [riverData, setRiverData] = useState(null);
  const [outletData, setOutletData] = useState(null);

  const popupRef = useRef(null);

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

  /* ---------- Popup Click Lock ---------- */
  useEffect(() => {
    if (popupRef.current?._container) {
      L.DomEvent.disableClickPropagation(popupRef.current._container);
      L.DomEvent.disableScrollPropagation(popupRef.current._container);
    }
  }, [showPopup]);

  /* ---------- Logic ---------- */
  const handlePointSelect = (latlng) => {
    if (point) return;
    setPoint(latlng);
    setShowPopup(true);
  };

  const handleLoadData = () => {
    // Pass data to parent - no validation needed
    onDataInputComplete({
      point,
      timestamp: new Date().toISOString(),
    });
    setShowPopup(false);
  };

  const stop = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <MapContainer
      center={[20.5, 82.5]}
      zoom={5}
      className="map"
      style={{ height: "100%", width: "100%" }}
    >
      {/* ---------- Base Maps (HYBRID DEFAULT) ---------- */}
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
      {catchmentData && (
        <GeoJSON data={catchmentData} style={catchmentStyle} />
      )}
      {riverData && <GeoJSON data={riverData} style={riverStyle} />}
      {outletData && (
        <GeoJSON
          data={outletData}
          pointToLayer={(f, latlng) =>
            L.circleMarker(latlng, outletStyle)
          }
        />
      )}

      <ClickHandler onPointSelect={handlePointSelect} disabled={showPopup} />

      {/* ---------- Simplified Popup ---------- */}
      {point && showPopup && (
        <Marker position={[point.lat, point.lng]}>
          <Popup
            ref={popupRef}
            closeOnClick={false}
            autoClose={false}
            closeButton
            className="map-popup"
          >
            <div className="popup-inner" onClick={stop}>
              <div className="popup-header">
                <h4>📊 Load CSV Data for Analysis</h4>
                <p className="popup-subtitle">
                  This will display rainfall-runoff data for all {csvData?.length || 0} time steps
                </p>
              </div>

              <div className="location-display">
                <div className="location-item">
                  <span className="location-label">📍 Selected Location:</span>
                  <span className="location-value">
                    {point.lat.toFixed(4)}°N, {point.lng.toFixed(4)}°E
                  </span>
                </div>
                <div className="location-item">
                  <span className="location-label">📈 Total Data Points:</span>
                  <span className="location-value">{csvData?.length || 0} observations</span>
                </div>
              </div>

              <button
                className="popup-load-btn"
                onClick={handleLoadData}
              >
                ✓ Load Complete Dataset
              </button>

              <div className="popup-info">
                <p>
                  💡 The combined rainfall-runoff graph will show the entire time series
                  with rainfall (inverted bars) and runoff (area chart) together.
                </p>
              </div>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}

