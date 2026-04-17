import { useState, useRef } from "react";
import Header from "./components/Header";
import MapView from "./components/MapView";
import ChartsPanel from "./components/ChartsPanel";
import ResultsPanel from "./components/ResultsPanel";
import LeftSidebar from "./components/LeftSidebar";
import AboutSection from "./components/AboutSection";
import GallerySection from "./components/GallerySection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import "./App.css";

export default function App() {
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [csvData, setCsvData] = useState(null);
  const [showCharts, setShowCharts] = useState(false);
  const [modelResults, setModelResults] = useState(null);
  const [averageRainfall, setAverageRainfall] = useState(null);
  const [pointFileMemory, setPointFileMemory] = useState({});
  const [isPolygonAverage, setIsPolygonAverage] = useState(false);

  // Sidebar → MapView control refs
  const [activeBasemap, setActiveBasemap] = useState("hybrid");
  const [activeRegion, setActiveRegion] = useState("all-india");
  const [activeDataSource, setActiveDataSource] = useState("chirps");
  const [activeLayers, setActiveLayers] = useState({
    chirps: true,
    catchment: true,
    river: true,
    outlet: true,
  });

  // Scroll refs
  const dashboardRef = useRef(null);
  const aboutRef = useRef(null);
  const galleryRef = useRef(null);
  const contactRef = useRef(null);

  const handleDataInputComplete = (data) => {
    setSelectedPoint(data.point);
    setCsvData(data.csvData);
    setShowCharts(true);
    setModelResults(null);
    setIsPolygonAverage(data.isPolygonAverage || false);
    setAverageRainfall(data.averageValue || null);

    const key = `${data.point.lat.toFixed(4)},${data.point.lng.toFixed(4)}`;
    setPointFileMemory((prev) => ({
      ...prev,
      [key]: { file: data.file, fileName: data.fileName },
    }));
  };

  const handleRunModels = (results) => setModelResults(results);

  const handleReset = () => {
    setSelectedPoint(null);
    setCsvData(null);
    setShowCharts(false);
    setModelResults(null);
    setAverageRainfall(null);
    setIsPolygonAverage(false);
  };

  // Sidebar callbacks
  const handleBasemapChange = (val) => setActiveBasemap(val);
  const handleRegionChange = (val) => setActiveRegion(val);
  const handleDataSourceChange = (val) => setActiveDataSource(val);
  const handleLayerToggle = (layerKey, newState) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  const scrollToSection = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="app">
      <Header 
        onNavigate={scrollToSection}
        dashboardRef={dashboardRef}
        aboutRef={aboutRef}
        galleryRef={galleryRef}
        contactRef={contactRef}
      />

      {/* SECTION 1: Dashboard - EXACT same layout as before */}
      <div ref={dashboardRef} className="main-layout">
        <div style={{ position: "relative", flex: "1.5", minWidth: 0, height: "100%" }}>
          <MapView
            onDataInputComplete={handleDataInputComplete}
            pointFileMemory={pointFileMemory}
            activeBasemap={activeBasemap}
            activeRegion={activeRegion}
            activeDataSource={activeDataSource}
            activeLayers={activeLayers}
          />

          <LeftSidebar
            onBasemapChange={handleBasemapChange}
            onRegionChange={handleRegionChange}
            onDataSourceChange={handleDataSourceChange}
            onLayerToggle={handleLayerToggle}
            activeLayers={activeLayers}
          />
        </div>

        <div className="right-panel">
          {!showCharts && !modelResults && (
            <div className="empty-state">
              <div className="empty-icon">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5654/5654592.png"
                  alt="Location Icon"
                  style={{ width: "210px", height: "210px", margin: "0 auto -60px" }}
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
                <div className="feature-item" />
                <div className="feature-item" />
                <div className="feature-item" />
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

      {/* SECTION 2: About */}
      <div ref={aboutRef}>
        <AboutSection />
      </div>

      {/* SECTION 3: Gallery */}
      <div ref={galleryRef}>
        <GallerySection />
      </div>

      {/* SECTION 4: Contact */}
      <div ref={contactRef}>
        <ContactSection />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
