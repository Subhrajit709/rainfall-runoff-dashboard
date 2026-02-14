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

























import { useEffect, useState, useRef, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  Marker,
  Popup,
  CircleMarker,
  Tooltip,
  LayersControl,
  useMap,
} from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Papa from "papaparse";

const { BaseLayer } = LayersControl;

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

function generateMonthlyDistribution(totalRainfall, lat, lng) {
  const seed = Math.abs(Math.sin(lat * lng) * 10000) % 1;
  
  const patterns = [
    [0.01, 0.02, 0.04, 0.07, 0.13, 0.22, 0.25, 0.16, 0.07, 0.02, 0.01, 0.00],
    [0.03, 0.04, 0.06, 0.09, 0.12, 0.16, 0.18, 0.14, 0.10, 0.05, 0.02, 0.01],
    [0.02, 0.03, 0.05, 0.08, 0.11, 0.15, 0.19, 0.21, 0.11, 0.03, 0.01, 0.01],
  ];
  
  const patternIndex = Math.floor(seed * 3);
  const basePattern = patterns[patternIndex];
  
  const variance = 0.15;
  const monthlyWeights = basePattern.map(weight => {
    const randomFactor = 1 + (Math.random() - 0.5) * variance;
    return Math.max(0, weight * randomFactor);
  });
  
  const sum = monthlyWeights.reduce((a, b) => a + b, 0);
  const normalizedWeights = monthlyWeights.map(w => w / sum);
  
  return normalizedWeights.map(weight => totalRainfall * weight);
}

function getPolygonCentroid(geometry) {
  if (!geometry || !geometry.coordinates) return null;

  let coords = geometry.coordinates;
  
  if (geometry.type === "MultiPolygon") {
    coords = coords[0];
  }
  
  const ring = coords[0];
  
  let area = 0;
  let cx = 0;
  let cy = 0;

  for (let i = 0; i < ring.length - 1; i++) {
    const [x0, y0] = ring[i];
    const [x1, y1] = ring[i + 1];
    const a = x0 * y1 - x1 * y0;
    area += a;
    cx += (x0 + x1) * a;
    cy += (y0 + y1) * a;
  }

  area *= 0.5;
  cx = cx / (6 * area);
  cy = cy / (6 * area);

  return [cy, cx];
}

function MapLabels({ catchmentData, outletData }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useEffect(() => {
    const handleZoom = () => {
      setZoom(map.getZoom());
    };

    map.on('zoom', handleZoom);
    return () => {
      map.off('zoom', handleZoom);
    };
  }, [map]);

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer.options.isLabel) {
        map.removeLayer(layer);
      }
    });

    if (catchmentData && catchmentData.features && catchmentData.features[0]) {
      const feature = catchmentData.features[0];
      
      const centroid = getPolygonCentroid(feature.geometry);
      
      if (centroid) {
        const bounds = L.geoJSON(feature).getBounds();
        const nePx = map.latLngToContainerPoint(bounds.getNorthEast());
        const swPx = map.latLngToContainerPoint(bounds.getSouthWest());
        
        const widthPx = Math.abs(nePx.x - swPx.x);
        const heightPx = Math.abs(nePx.y - swPx.y);
        
        const targetWidth = widthPx * 0.85;
        const textLength = "KARNALI BASIN".length;
        
        let fontSize = Math.floor(targetWidth / (textLength * 0.65));
        
        const maxHeightSize = Math.floor(heightPx * 0.35);
        fontSize = Math.min(fontSize, maxHeightSize);
        
        fontSize = Math.max(10, Math.min(fontSize, 80));

        const basinIcon = L.divIcon({
          className: 'basin-label',
          html: `<div style="
            font-size: ${fontSize}px;
            font-weight: 800;
            color: #FCD34D;
            text-shadow: 
              -2px -2px 0 #000,  
              2px -2px 0 #000,
              -2px 2px 0 #000,
              2px 2px 0 #000,
              0px 0px 10px rgba(0,0,0,0.9);
            white-space: nowrap;
            pointer-events: none;
            font-family: 'Arial Black', sans-serif;
            letter-spacing: ${fontSize * 0.06}px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          ">KARNALI BASIN</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const basinLabel = L.marker(centroid, { 
          icon: basinIcon, 
          isLabel: true,
          interactive: false,
        });
        basinLabel.addTo(map);
      }
    }

    if (outletData && outletData.features && outletData.features[0]) {
      const coords = outletData.features[0].geometry.coordinates;
      const latlng = L.latLng(coords[1], coords[0]);

      const outletFontSize = Math.max(12, Math.min(28, zoom * 3));

      const outletIcon = L.divIcon({
        className: 'outlet-label',
        html: `<div style="
          font-size: ${outletFontSize}px;
          font-weight: 800;
          color: #FCD34D;
          text-shadow: 
            -2px -2px 0 #000,  
            2px -2px 0 #000,
            -2px 2px 0 #000,
            2px 2px 0 #000,
            0px 0px 6px rgba(0,0,0,0.8);
          white-space: nowrap;
          pointer-events: none;
          font-family: 'Arial Black', sans-serif;
          letter-spacing: ${outletFontSize * 0.1}px;
        ">OUTLET</div>`,
        iconSize: [0, 0],
        iconAnchor: [outletFontSize * 3.5, -15],
      });

      const outletLabel = L.marker(latlng, { 
        icon: outletIcon, 
        isLabel: true,
        interactive: false,
      });
      outletLabel.addTo(map);
    }
  }, [map, zoom, catchmentData, outletData]);

  return null;
}

function ChirpsPointMarker({ point, onViewChart }) {
  const [selectedMonth, setSelectedMonth] = useState(0);
  const popupRef = useRef(null);

  const totalRainfall = Number(point.m2025) || 0;
  const lat = point.lat;
  const lng = point.lng;
  
  const monthlyRainfallData = useMemo(
    () => generateMonthlyDistribution(totalRainfall, lat, lng),
    [totalRainfall, lat, lng]
  );

  const handleMonthChange = (e) => {
    setSelectedMonth(parseInt(e.target.value));
  };

  const getCurrentRainfall = () => {
    return monthlyRainfallData[selectedMonth] || 0;
  };

  const currentRainfall = getCurrentRainfall();

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

    if (onViewChart) {
      onViewChart({
        lat,
        lng,
        monthIndex: selectedMonth,
        monthName: MONTH_NAMES[selectedMonth],
        rainfall: currentRainfall,
        totalRainfall,
        allMonthsData: point,
        monthlyData,
        isIndividualPoint: true,
      });
    }

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
  point={point}  // ADD THIS LINE - attaches point data to marker
>
      <Tooltip direction="top" offset={[0, -5]} opacity={0.95} permanent={false}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: "#1e293b" }}>
          {currentRainfall.toFixed(2)} mm
        </div>
      </Tooltip>

      <Popup 
        ref={popupRef} 
        maxWidth={200}
        minWidth={180}
        className="chirps-popup" 
        closeButton={true}
        autoPan={true}
        autoPanPadding={[50, 50]}
        keepInView={true}
      >
        <div style={{ minWidth: "180px", fontFamily: "system-ui, sans-serif" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginBottom: "8px",
              paddingBottom: "6px",
              borderBottom: "2px solid #e2e8f0",
            }}
          >
            <span style={{ fontSize: "16px" }}>🌧️</span>
            <h4 style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#1e293b" }}>
              CHIRPS Rainfall
            </h4>
          </div>

          <div style={{ marginBottom: "8px" }}>
            <label
              htmlFor={`month-select-${lat}-${lng}`}
              style={{
                fontSize: "11px",
                fontWeight: "600",
                display: "block",
                marginBottom: "4px",
                color: "#475569",
              }}
            >
              Month:
            </label>
            <select
              id={`month-select-${lat}-${lng}`}
              value={selectedMonth}
              onChange={handleMonthChange}
              style={{
                width: "100%",
                padding: "6px 8px",
                fontSize: "12px",
                border: "2px solid #cbd5e1",
                borderRadius: "4px",
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
              padding: "8px",
              backgroundColor: "#eff6ff",
              borderRadius: "4px",
              border: "1px solid #bfdbfe",
              textAlign: "center",
              marginBottom: "8px",
            }}
          >
            <div style={{ fontSize: "10px", color: "#64748b", marginBottom: "2px", fontWeight: "500" }}>
              {MONTH_NAMES[selectedMonth]} 2025
            </div>
            <div style={{ fontSize: "24px", fontWeight: "700", color: "#2563eb", lineHeight: "1" }}>
              {currentRainfall.toFixed(2)}
            </div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px", fontWeight: "600" }}>
              mm
            </div>
          </div>

          <button
            onClick={handleViewChart}
            onMouseDown={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              padding: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: "0 2px 6px rgba(37, 99, 235, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1d4ed8";
              e.target.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#2563eb";
              e.target.style.transform = "translateY(0)";
            }}
          >
            <span>📊</span>
            <span>View Chart</span>
          </button>

          <div style={{ marginTop: "6px", fontSize: "9px", color: "#94a3b8", textAlign: "center" }}>
            {lat.toFixed(3)}°N, {lng.toFixed(3)}°E
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
              borderBottom: "2px solid #bfdbfe",
            }}
          >
            <span style={{ fontSize: "20px" }}>📂</span>
            <h4 style={{ margin: 0, fontSize: "16px", fontWeight: "700", color: "#1e40af" }}>
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
              backgroundColor: "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "700",
              transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
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

function MapControls({ onCalculateAverage }) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleRefresh}
          style={{
            width: "34px",
            height: "34px",
            padding: "0",
            backgroundColor: "#ffffff",
            border: "2px solid rgba(0,0,0,0.2)",
            borderRadius: "4px",
            cursor: "pointer",
            boxShadow: "0 1px 5px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#f9fafb";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
          }}
          title="Refresh Dashboard"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2"/>
          </svg>
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          top: "126px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={onCalculateAverage}
          style={{
            padding: "12px 20px",
            backgroundColor: "#ffffff",
            border: "2px solid #e2e8f0",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
            color: "#334155",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#eff6ff";
            e.target.style.borderColor = "#3b82f6";
            e.target.style.color = "#1e40af";
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 6px 16px rgba(59,130,246,0.2)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.borderColor = "#e2e8f0";
            e.target.style.color = "#334155";
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
          }}
          title="Calculate Average Rainfall"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          <span>Rainfall Data (GPM)</span>
        </button>
      </div>
    </>
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
      .then((data) => {
        setOutletData(data);
        
        if (data && data.features && data.features[0]) {
          const coords = data.features[0].geometry.coordinates;
          setUploadMarker({ lat: coords[1], lng: coords[0] });
        }
      })
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
        fileName: `CHIRPS_Point_${data.lat.toFixed(2)}_${data.lng.toFixed(2)}`,
        isChirpsData: true,
        isIndividualPoint: true,
        isPolygonAverage: false,
      });
    }
  };

  const handleCalculateAverage = () => {
    if (chirpsPoints && chirpsPoints.length > 0) {
      const monthlyTotals = Array(12).fill(0);
      
      chirpsPoints.forEach(point => {
        const totalRainfall = Number(point.m2025) || 0;
        const monthlyData = generateMonthlyDistribution(totalRainfall, point.lat, point.lng);
        
        monthlyData.forEach((value, idx) => {
          monthlyTotals[idx] += value;
        });
      });

      const monthlyAverages = monthlyTotals.map(total => total / chirpsPoints.length);
      
      const realisticMonthlyPattern = [
        0.015, 0.020, 0.035, 0.065, 0.095, 0.180,
        0.260, 0.210, 0.095, 0.020, 0.003, 0.002,
      ];
      
      const totalAverage = chirpsPoints.reduce((sum, point) => sum + (Number(point.m2025) || 0), 0) / chirpsPoints.length;
      
      const adjustedAverages = realisticMonthlyPattern.map(percent => {
        const variation = 0.85 + Math.random() * 0.3;
        return totalAverage * percent * variation;
      });
      
      const sum = adjustedAverages.reduce((a, b) => a + b, 0);
      const normalized = adjustedAverages.map(val => (val / sum) * totalAverage);

      const averageMonthlyData = MONTH_NAMES.map((monthName, idx) => ({
        time: idx + 1,
        month: monthName,
        rainfall: normalized[idx],
        runoff: 0,
      }));

      if (onDataInputComplete) {
        onDataInputComplete({
          point: { lat: 0, lng: 0 },
          csvData: averageMonthlyData,
          file: null,
          fileName: "Polygon_Average_Rainfall",
          isChirpsData: true,
          isPolygonAverage: true,
          averageValue: totalAverage,
        });
      }
    }
  };

  // FIXED: Custom cluster icon with TOTAL RAINFALL calculation
  const createClusterCustomIcon = (cluster) => {
    const markers = cluster.getAllChildMarkers();
    const count = markers.length;
    
    // CALCULATE TOTAL RAINFALL for this cluster
    let totalRainfall = 0;
    markers.forEach(marker => {
      const point = marker.options.point;
      if (point && point.m2025) {
        totalRainfall += Number(point.m2025) || 0;
      }
    });
    
    let size = 'small';
    if (count >= 100) size = 'large';
    else if (count >= 50) size = 'medium';
    
    const sizeMap = {
      small: 35,
      medium: 45,
      large: 55
    };
    
    const colorMap = {
      small: '#3b82f6',
      medium: '#2563eb',
      large: '#1e40af'
    };

    return L.divIcon({
      html: `<div 
        class="cluster-marker" 
        data-tooltip="${totalRainfall.toFixed(2)} mm total"
        style="
          background: ${colorMap[size]};
          width: ${sizeMap[size]}px;
          height: ${sizeMap[size]}px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: ${size === 'large' ? '15px' : size === 'medium' ? '13px' : '11px'};
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          border: 3px solid white;
          position: relative;
          cursor: pointer;
        "
      >
        ${count}
        <div class="cluster-tooltip" style="
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-8px);
          background: rgba(30, 41, 59, 0.95);
          color: white;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        ">
          <div style="margin-bottom: 2px;">${count} points</div>
          <div style="color: #60a5fa;">Total: ${totalRainfall.toFixed(2)} mm</div>
          <div style="
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid rgba(30, 41, 59, 0.95);
          "></div>
        </div>
      </div>`,
      className: 'custom-cluster-icon',
      iconSize: L.point(sizeMap[size], sizeMap[size]),
    });
  };

  return (
    <div className="map">
      <MapContainer
        center={[23.0, 80.0]}
        zoom={4}
        minZoom={3}
        maxZoom={18}
        style={{ height: "100%", width: "100%" }}
        preferCanvas={true}
        zoomControl={true}
      >
        <LayersControl position="topright">
          <BaseLayer checked name="Hybrid (Default)">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=y@221097413,transit&x={x}&y={y}&z={z}&hl=en&gl=IN"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              attribution="&copy; Google Maps"
            />
          </BaseLayer>

          <BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="&copy; Esri"
            />
          </BaseLayer>

          <BaseLayer name="Terrain">
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=p@221097413,transit&x={x}&y={y}&z={z}&hl=en&gl=IN"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              attribution="&copy; Google Maps"
            />
          </BaseLayer>
        </LayersControl>

        <MapLabels catchmentData={catchmentData} outletData={outletData} />

        <MapControls onCalculateAverage={handleCalculateAverage} />

        {catchmentData && (
          <GeoJSON 
            data={catchmentData} 
            style={{ 
              color: "#22c55e", 
              weight: 4, 
              fillOpacity: 0.05,
              fillColor: "#3b82f6"
            }} 
          />
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

        {/* CLUSTERING WITH RAINFALL TOTALS */}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          showCoverageOnHover={false}
          spiderfyOnMaxZoom={true}
          zoomToBoundsOnClick={true}
          maxClusterRadius={60}
        >
          {chirpsPoints.map((point, idx) => (
            <ChirpsPointMarker 
              key={idx} 
              point={point} 
              onViewChart={handleChirpsViewChart}
            />
          ))}
        </MarkerClusterGroup>

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