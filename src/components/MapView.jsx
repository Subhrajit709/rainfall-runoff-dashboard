import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function ClickHandler({ onPointSelect }) {
  useMapEvents({
    click(e) {
      onPointSelect(e.latlng);
    },
  });
  return null;
}

export default function MapView({ onDataInputComplete }) {
  const [point, setPoint] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [inputStep, setInputStep] = useState("initial");
  const [rainfallValue, setRainfallValue] = useState("");
  const [runoffValue, setRunoffValue] = useState("");
  const popupRef = useRef(null);

  const handlePointSelect = (latlng) => {
    setPoint(latlng);
    setShowPopup(true);
    setInputStep("initial");
    setRainfallValue("");
    setRunoffValue("");
  };

  const handleStartRainfall = () => {
    setInputStep("rainfall-input");
  };

  const handleRainfallSubmit = (e) => {
    if (e.key === "Enter" && rainfallValue) {
      setInputStep("runoff-initial");
    }
  };

  const handleStartRunoff = () => {
    setInputStep("runoff-input");
  };

  const handleRunoffSubmit = (e) => {
    if (e.key === "Enter" && runoffValue) {
      setInputStep("complete");
    }
  };

  const handleLoadData = () => {
    if (rainfallValue && runoffValue && point) {
      onDataInputComplete({
        point,
        rainfallInput: parseFloat(rainfallValue),
        runoffInput: parseFloat(runoffValue),
        timestamp: new Date().toISOString(),
      });
      setShowPopup(false);
      setInputStep("initial");
      setRainfallValue("");
      setRunoffValue("");
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setInputStep("initial");
    setRainfallValue("");
    setRunoffValue("");
  };

  const handlePopupClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleButtonClick = (callback) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    callback();
  };

  return (
    <MapContainer 
      center={[20.5, 82.5]} 
      zoom={5} 
      className="map"
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <ClickHandler onPointSelect={handlePointSelect} />

      {point && (
        <Marker position={[point.lat, point.lng]}>
          {showPopup && (
            <Popup 
              ref={popupRef}
              closeButton={true}
              onClose={handleClosePopup}
              className="map-popup"
              position={[point.lat, point.lng]}
            >
              <div className="popup-inner" onClick={handlePopupClick}>
                    {inputStep === "initial" && (
                      <>
                        <h4>Enter Data Values</h4>
                        <p className="popup-subtitle">Click below to input data</p>
                        <div className="popup-buttons">
                          <button 
                            className="popup-btn rainfall-btn"
                            onClick={handleButtonClick(handleStartRainfall)}
                          >
                            🌧️ Enter Rainfall
                          </button>
                          <button 
                            className="popup-btn runoff-btn"
                            onClick={handleStartRunoff}
                            disabled
                            style={{ opacity: 0.5, cursor: "not-allowed" }}
                          >
                            💧 Enter Runoff (Complete rainfall first)
                          </button>
                        </div>
                      </>
                    )}

                {/* Rainfall Input Step */}
                {inputStep === "rainfall-input" && (
                  <>
                    <h4>🌧️ Rainfall Value</h4>
                    <p className="popup-subtitle">Enter rainfall in mm</p>
                    <input
                      type="number"
                      placeholder="Enter value (mm)"
                      value={rainfallValue}
                      onChange={(e) => setRainfallValue(e.target.value)}
                      onKeyPress={handleRainfallSubmit}
                      className="popup-input"
                      autoFocus
                      step="0.1"
                      min="0"
                    />
                    <p className="popup-hint">Press Enter to continue</p>
                    <button 
                      className="popup-continue-btn"
                      onClick={handleButtonClick(() => handleRainfallSubmit({ key: "Enter" }))}
                      disabled={!rainfallValue}
                    >
                      ✓ Continue
                    </button>
                    <button 
                      className="popup-back-btn"
                      onClick={handleButtonClick(() => setInputStep("initial"))}
                    >
                      ← Back
                    </button>
                  </>
                )}

                {/* Runoff Selection (after rainfall entered) */}
                {inputStep === "runoff-initial" && (
                  <>
                    <h4>✓ Rainfall: {rainfallValue} mm</h4>
                    <p className="popup-subtitle">Now enter runoff value</p>
                    <div className="popup-buttons">
                      <button 
                        className="popup-btn runoff-btn"
                        onClick={handleButtonClick(handleStartRunoff)}
                      >
                        💧 Enter Runoff
                      </button>
                    </div>
                    <button 
                      className="popup-back-btn"
                      onClick={handleButtonClick(() => setInputStep("rainfall-input"))}
                    >
                      ← Change Rainfall
                    </button>
                  </>
                )}

                {/* Runoff Input Step */}
                {inputStep === "runoff-input" && (
                  <>
                    <h4>💧 Runoff Value</h4>
                    <p className="popup-subtitle">Enter runoff in m³/s</p>
                    <input
                      type="number"
                      placeholder="Enter value (m³/s)"
                      value={runoffValue}
                      onChange={(e) => setRunoffValue(e.target.value)}
                      onKeyPress={handleRunoffSubmit}
                      className="popup-input"
                      autoFocus
                      step="0.1"
                      min="0"
                    />
                    <p className="popup-hint">Press Enter to continue</p>
                    <button 
                      className="popup-continue-btn"
                      onClick={handleButtonClick(() => handleRunoffSubmit({ key: "Enter" }))}
                      disabled={!runoffValue}
                    >
                      ✓ Continue
                    </button>
                    <button 
                      className="popup-back-btn"
                      onClick={handleButtonClick(() => setInputStep("runoff-initial"))}
                    >
                      ← Back
                    </button>
                  </>
                )}

                {/* Summary & Load Step */}
                {inputStep === "complete" && (
                  <>
                    <h4>Data Summary</h4>
                    <div className="popup-summary">
                      <div className="summary-row">
                        <span className="summary-label">🌧️ Rainfall:</span>
                        <span className="summary-value">{rainfallValue} mm</span>
                      </div>
                      <div className="summary-row">
                        <span className="summary-label">💧 Runoff:</span>
                        <span className="summary-value">{runoffValue} m³/s</span>
                      </div>
                    </div>
                    <button 
                      className="popup-load-btn"
                      onClick={handleButtonClick(handleLoadData)}
                    >
                      ▶ Load Data
                    </button>
                    <button 
                      className="popup-back-btn"
                      onClick={handleButtonClick(() => setInputStep("runoff-input"))}
                    >
                      ← Change Runoff
                    </button>
                  </>
                )}
              </div>
            </Popup>
          )}
        </Marker>
      )}
    </MapContainer>
  );
}
