import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateModelMetrics } from "../utils/dataLoader";

export default function ChartsPanel({ selectedPoint, chartsData, csvData, onRunModels }) {
  const [isRunning, setIsRunning] = useState(false);
  const [animatingChart, setAnimatingChart] = useState(null);

  useEffect(() => {
    if (chartsData) {
      setAnimatingChart('both');
      const timer = setTimeout(() => setAnimatingChart(null), 600);
      return () => clearTimeout(timer);
    }
  }, [chartsData]);

  if (!chartsData) {
    return null;
  }

  const { matchResult, rainfallInput, runoffInput } = chartsData;

  // Use either window data or full CSV
  const displayData = matchResult.found ? matchResult.windowData : csvData.slice(0, 500);
  const rainfallSeries = displayData;
  const runoffSeries = displayData;

  const handleRunModels = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Split data for training/testing (80/20)
    const splitIndex = Math.floor(csvData.length * 0.8);
    const trainData = csvData.slice(0, splitIndex);
    const testData = csvData.slice(splitIndex);

    // Calculate REAL metrics based on CSV data
    const models = calculateModelMetrics(trainData, testData);

    const results = {
      models: models,
      rainfall: rainfallSeries,
      runoff: runoffSeries,
      matchInfo: matchResult,
      trainSize: trainData.length,
      testSize: testData.length
    };

    onRunModels(results);
    setIsRunning(false);
  };

  return (
    <div className="charts-panel">
      <div className="panel-header">
        <div className="location-info">
          <span className="info-badge">📍 Location</span>
          <span className="info-value">{selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
          <span className="info-badge">📊 Input Values</span>
          <span className="info-value">Rainfall: {rainfallInput}mm | Runoff: {runoffInput}m³/s</span>
        </div>
        
        {matchResult.found && (
          <div className="match-info-banner">
            ✓ {matchResult.message}
          </div>
        )}
      </div>

      <div className="charts-dual-container">
        {/* Rainfall Chart */}
        <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
          <div className="chart-header">
            <h3>🌧️ Rainfall Data</h3>
            <span className="chart-unit">(mm)</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={rainfallSeries}>
              <defs>
                <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1e90ff" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#999"
                tick={{ fontSize: 11 }}
                interval={Math.floor(rainfallSeries.length / 10)}
              />
              <YAxis 
                stroke="#999"
                tick={{ fontSize: 11 }}
                width={45}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#f0f5f9",
                  border: "1px solid #1e90ff",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(30, 144, 255, 0.2)"
                }}
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={24}
                wrapperStyle={{ paddingBottom: "10px" }}
              />
              <Line 
                type="monotone" 
                dataKey="rainfall"
                stroke="#1e90ff" 
                dot={false}
                strokeWidth={2.5}
                name="Rainfall (mm)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-stats">
            <span>Max: {Math.max(...rainfallSeries.map(d => d.rainfall)).toFixed(1)} mm</span>
            <span>Avg: {(rainfallSeries.reduce((a, b) => a + b.rainfall, 0) / rainfallSeries.length).toFixed(1)} mm</span>
            <span>Input: {rainfallInput} mm</span>
          </div>
        </div>

        {/* Runoff Chart */}
        <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
          <div className="chart-header">
            <h3>💧 Runoff Data</h3>
            <span className="chart-unit">(m³/s)</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={runoffSeries}>
              <defs>
                <linearGradient id="runoffGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00a86b" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00a86b" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
              <XAxis 
                dataKey="time" 
                stroke="#999"
                tick={{ fontSize: 11 }}
                interval={Math.floor(runoffSeries.length / 10)}
              />
              <YAxis 
                stroke="#999"
                tick={{ fontSize: 11 }}
                width={45}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#f0f5f9",
                  border: "1px solid #00a86b",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0, 168, 107, 0.2)"
                }}
                formatter={(value) => value.toFixed(2)}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Legend 
                verticalAlign="top" 
                height={24}
                wrapperStyle={{ paddingBottom: "10px" }}
              />
              <Line 
                type="monotone" 
                dataKey="runoff"
                stroke="#00a86b" 
                dot={false}
                strokeWidth={2.5}
                name="Runoff (m³/s)"
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-stats">
            <span>Max: {Math.max(...runoffSeries.map(d => d.runoff)).toFixed(1)} m³/s</span>
            <span>Avg: {(runoffSeries.reduce((a, b) => a + b.runoff, 0) / runoffSeries.length).toFixed(1)} m³/s</span>
            <span>Input: {runoffInput} m³/s</span>
          </div>
        </div>
      </div>

      <div className="panel-actions">
        <button 
          className="run-button"
          onClick={handleRunModels}
          disabled={isRunning}
        >
          {isRunning ? (
            <>
              <span className="spinner"></span>
              Running Analysis on CSV Data...
            </>
          ) : (
            <>
              🚀 Run Model Comparison
            </>
          )}
        </button>
      </div>

      <div className="data-info">
        <p>📈 Showing {displayData.length} data points from CSV | Total dataset: {csvData.length} points</p>
        {matchResult.found && (
          <p className="match-detail">🎯 Matched {matchResult.matchCount} similar points in dataset</p>
        )}
      </div>
    </div>
  );
}
