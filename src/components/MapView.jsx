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

export default function MapView({ onDataInputComplete }) {
  const [point, setPoint] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [inputStep, setInputStep] = useState("initial");
  const [rainfallValue, setRainfallValue] = useState("");
  const [runoffValue, setRunoffValue] = useState("");

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
  }, [inputStep, showPopup]);

  /* ---------- Logic ---------- */
  const handlePointSelect = (latlng) => {
    if (point) return;
    setPoint(latlng);
    setShowPopup(true);
    setInputStep("initial");
    setRainfallValue("");
    setRunoffValue("");
  };

  const handleRainfallNext = () => {
    if (rainfallValue) setInputStep("runoff-initial");
  };

  const handleRunoffNext = () => {
    if (runoffValue) setInputStep("complete");
  };

  const handleLoadData = () => {
    onDataInputComplete({
      point,
      rainfallInput: Number(rainfallValue),
      runoffInput: Number(runoffValue),
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

      {/* ---------- Marker & Popup (UNCHANGED) ---------- */}
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
              {/* 🔒 POPUP JSX UNCHANGED */}
              {inputStep === "initial" && (
                <>
                  <h4>Enter Data Values</h4>
                  <div className="popup-buttons">
                    <button
                      className="popup-btn rainfall-btn"
                      onClick={() => setInputStep("rainfall-input")}
                    >
                      🌧️ Enter Rainfall
                    </button>
                    <button
                      className="popup-btn runoff-btn"
                      disabled
                      style={{ opacity: 0.5, cursor: "not-allowed" }}
                    >
                      💧 Enter Runoff (Complete rainfall first)
                    </button>
                  </div>
                </>
              )}

              {inputStep === "rainfall-input" && (
                <>
                  <h4>🌧️ Rainfall Value</h4>
                  <input
                    type="number"
                    className="popup-input"
                    value={rainfallValue}
                    onChange={(e) => setRainfallValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleRainfallNext()
                    }
                    autoFocus
                  />
                  <button
                    className="popup-continue-btn"
                    disabled={!rainfallValue}
                    onClick={handleRainfallNext}
                  >
                    ✓ Continue
                  </button>
                  <button
                    className="popup-back-btn"
                    onClick={() => setInputStep("initial")}
                  >
                    ← Back
                  </button>
                </>
              )}

              {inputStep === "runoff-initial" && (
                <>
                  <button
                    className="popup-btn runoff-btn"
                    onClick={() => setInputStep("runoff-input")}
                  >
                    💧 Enter Runoff
                  </button>
                  <button
                    className="popup-back-btn"
                    onClick={() => setInputStep("rainfall-input")}
                  >
                    ← Change Rainfall
                  </button>
                </>
              )}

              {inputStep === "runoff-input" && (
                <>
                  <h4>💧 Runoff Value</h4>
                  <input
                    type="number"
                    className="popup-input"
                    value={runoffValue}
                    onChange={(e) => setRunoffValue(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleRunoffNext()
                    }
                    autoFocus
                  />
                  <button
                    className="popup-continue-btn"
                    disabled={!runoffValue}
                    onClick={handleRunoffNext}
                  >
                    ✓ Continue
                  </button>
                  <button
                    className="popup-back-btn"
                    onClick={() => setInputStep("runoff-initial")}
                  >
                    ← Back
                  </button>
                </>
              )}

              {inputStep === "complete" && (
                <>
                  <button
                    className="popup-load-btn"
                    onClick={handleLoadData}
                  >
                    ▶ Load Data
                  </button>
                  <button
                    className="popup-back-btn"
                    onClick={() => setInputStep("runoff-input")}
                  >
                    ← Change Runoff
                  </button>
                </>
              )}
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
