import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { rainfallSeries, runoffSeries } from "../data/rainfallData";

export default function ChartsPanel({ selectedPoint, selectedVariable, chartsData, onRunModels }) {
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

  const handleRunModels = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockResults = {
      models: [
        { model: "ANN", rmse: 12.3, r2: 0.82, r: 0.88, nse: 0.79 },
        { model: "LSTM", rmse: 9.1, r2: 0.90, r: 0.93, nse: 0.88 },
        { model: "SVR", rmse: 14.7, r2: 0.76, r: 0.81, nse: 0.73 },
        { model: "XGBoost", rmse: 8.4, r2: 0.92, r: 0.95, nse: 0.91 },
      ],
      rainfall: rainfallSeries,
      runoff: runoffSeries,
    };

    onRunModels(mockResults);
    setIsRunning(false);
  };

  return (
    <div className="charts-panel">
      <div className="panel-header">
        <div className="location-info">
          <span className="info-badge">📍 Location</span>
          <span className="info-value">{selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
          <span className="info-badge">📊 Loaded Data</span>
          <span className="info-value">Rainfall: {chartsData.rainfallInput}mm | Runoff: {chartsData.runoffInput}m³/s</span>
        </div>
      </div>

      <div className="charts-dual-container">
        {/* Rainfall Chart */}
        <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
          <div className="chart-header">
            <h3>🌧️ Rainfall</h3>
            <span className="chart-unit">(mm)</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
        
        39    <LineChart data={rainfallSeries.slice(0, 500)}>
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
                interval={50}
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
                fill="url(#rainfallGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-stats">
            <span>Max: {Math.max(...rainfallSeries.map(d => d.rainfall)).toFixed(1)} mm</span>
            <span>Avg: {(rainfallSeries.reduce((a, b) => a + b.rainfall, 0) / rainfallSeries.length).toFixed(1)} mm</span>
            <span>Input: {chartsData.rainfallInput} mm</span>
          </div>
        </div>

        {/* Runoff Chart */}
        <div className={`chart-section ${animatingChart ? 'animating' : ''}`}>
          <div className="chart-header">
            <h3>💧 Runoff</h3>
            <span className="chart-unit">(m³/s)</span>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={runoffSeries.slice(0, 500)}>
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
                interval={50}
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
                fill="url(#runoffGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chart-stats">
            <span>Max: {Math.max(...runoffSeries.map(d => d.runoff)).toFixed(1)} m³/s</span>
            <span>Avg: {(runoffSeries.reduce((a, b) => a + b.runoff, 0) / runoffSeries.length).toFixed(1)} m³/s</span>
            <span>Input: {chartsData.runoffInput} m³/s</span>
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
              Running Analysis...
            </>
          ) : (
            <>
              🚀 Run Model Comparison
            </>
          )}
        </button>
      </div>

      <div className="data-info">
        <p>📈 Showing first 500 time steps of 3320 total data points | Loaded with input values</p>
      </div>
    </div>
  );
}
