import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from "recharts";

export default function ResultsPanel({ selectedPoint, selectedVariable, chartsData, modelResults, onReset }) {
  if (!modelResults) {
    return null;
  }

  const { models, rainfall, runoff } = modelResults;

  
  const metricsData = [
    {
      metric: "RMSE",
      ANN: models[0].rmse,
      LSTM: models[1].rmse,
      SVR: models[2].rmse,
      XGBoost: models[3].rmse,
      description: "Lower is Better",
    },
    {
      metric: "R²",
      ANN: models[0].r2,
      LSTM: models[1].r2,
      SVR: models[2].r2,
      XGBoost: models[3].r2,
      description: "Higher is Better",
    },
    {
      metric: "R",
      ANN: models[0].r,
      LSTM: models[1].r,
      SVR: models[2].r,
      XGBoost: models[3].r,
      description: "Higher is Better",
    },
    {
      metric: "NSE",
      ANN: models[0].nse,
      LSTM: models[1].nse,
      SVR: models[2].nse,
      XGBoost: models[3].nse,
      description: "Higher is Better",
    },
  ];

  
  const modelColors = {
    ANN: "#FF6B6B",
    LSTM: "#4ECDC4",
    SVR: "#FFE66D",
    XGBoost: "#95E1D3",
  };

  
  const rainfallData = rainfall.slice(0, 500);
  const runoffData = runoff.slice(0, 500);

  return (
    <div className="results-panel">
      <div className="results-header">
        <div>
          <h2>🎯 Model Comparison Analysis</h2>
          <div className="location-info-compact">
            <span>📍 {selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
            <span>|</span>
            <span>📊 Rainfall & Runoff</span>
          </div>
        </div>
        <button className="reset-button" onClick={onReset}>
          ← New Selection
        </button>
      </div>

      <div className="results-content">
        {/* Time Series Charts */}
        <div className="section">
          <h3>📈 Predicted Data</h3>
          <div className="charts-dual-container">
            <div className="chart-section">
              <div className="chart-header">
                <h4>Rainfall</h4>
                <span className="unit-badge">(mm)</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rainfallData}>
                  <defs>
                    <linearGradient id="rfGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#1e90ff" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
                  <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 10 }} interval={50} />
                  <YAxis stroke="#999" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#f0f5f9",
                      border: "1px solid #1e90ff",
                      borderRadius: "4px"
                    }}
                    formatter={(v) => v.toFixed(1)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rainfall"
                    stroke="#1e90ff" 
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <div className="chart-header">
                <h4>Runoff</h4>
                <span className="unit-badge">(m³/s)</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={runoffData}>
                  <defs>
                    <linearGradient id="roGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00a86b" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#00a86b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
                  <XAxis dataKey="time" stroke="#999" tick={{ fontSize: 10 }} interval={50} />
                  <YAxis stroke="#999" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#f0f5f9",
                      border: "1px solid #00a86b",
                      borderRadius: "4px"
                    }}
                    formatter={(v) => v.toFixed(1)}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="runoff"
                    stroke="#00a86b" 
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Model Comparison */}
        <div className="section">
          <h3>🤖 Model Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
              <XAxis dataKey="metric" stroke="#999" tick={{ fontSize: 11 }} />
              <YAxis stroke="#999" tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#f0f5f9",
                  border: "1px solid #d1d8de",
                  borderRadius: "4px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                }}
                formatter={(v) => v.toFixed(3)}
              />
              <Legend />
              <Bar dataKey="ANN" fill={modelColors.ANN} radius={[4, 4, 0, 0]} />
              <Bar dataKey="LSTM" fill={modelColors.LSTM} radius={[4, 4, 0, 0]} />
              <Bar dataKey="SVR" fill={modelColors.SVR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="XGBoost" fill={modelColors.XGBoost} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statistics Table */}
        <div className="section">
          <h3>📊 Detailed Metrics Table</h3>
          <div className="table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>RMSE ↓</th>
                  <th>R² ↑</th>
                  <th>R ↑</th>
                  <th>NSE ↑</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {models.map((model, idx) => (
                  <tr key={model.model} className={idx === 3 ? "best-row" : ""}>
                    <td className="model-cell">
                      <span className="model-badge" style={{ backgroundColor: modelColors[model.model] }}>
                        {model.model}
                      </span>
                    </td>
                    <td>{model.rmse.toFixed(2)}</td>
                    <td>{model.r2.toFixed(4)}</td>
                    <td>{model.r.toFixed(4)}</td>
                    <td>{model.nse.toFixed(4)}</td>
                    <td className="rank-cell">
                      {idx === 3 && "🏆 1st"}
                      {idx === 1 && "🥈 2nd"}
                      {idx === 0 && "🥉 3rd"}
                      {idx === 2 && "4th"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Summary */}
        <div className="section analysis-box">
          <h3>📋 Analysis Summary</h3>
          <div className="analysis-grid">
            <div className="analysis-card">
              <h4>🏆 Best Model</h4>
              <p className="big-text">{models[3].model}</p>
              <p className="small-text">Lowest RMSE: {models[3].rmse.toFixed(2)}</p>
            </div>
            <div className="analysis-card">
              <h4>📈 Highest Accuracy</h4>
              <p className="big-text">R² = {models[3].r2.toFixed(3)}</p>
              <p className="small-text">{(models[3].r2 * 100).toFixed(1)}% variance explained</p>
            </div>
            <div className="analysis-card">
              <h4>✅ Best Efficiency</h4>
              <p className="big-text">NSE = {models[3].nse.toFixed(3)}</p>
              <p className="small-text">Excellent model efficiency</p>
            </div>
            <div className="analysis-card">
              <h4>⚡ Correlation</h4>
              <p className="big-text">R = {models[3].r.toFixed(3)}</p>
              <p className="small-text">Strong linear relationship</p>
            </div>
          </div>

          <div className="recommendations">
            <h4>💡 Key Findings</h4>
            <ul>
              <li><strong>{models[3].model}</strong> outperforms other models with RMSE of {models[3].rmse.toFixed(2)}</li>
              <li>Model explains <strong>{(models[3].r2 * 100).toFixed(1)}%</strong> of variance in the data</li>
              <li>NSE value of <strong>{models[3].nse.toFixed(3)}</strong> indicates excellent predictive efficiency</li>
              <li>Strong correlation coefficient <strong>{models[3].r.toFixed(3)}</strong> shows reliable predictions</li>
            </ul>
          </div>
        </div>

        {/* Metric Definitions */}
        <div className="section">
          <h3>📚 Metric Definitions</h3>
          <div className="metrics-grid">
            <div className="metric-def">
              <h4>RMSE (Root Mean Square Error)</h4>
              <p>Measures average prediction error. <strong>Lower is better.</strong></p>
              <p className="formula">√(Σ(predicted - actual)² / n)</p>
            </div>
            <div className="metric-def">
              <h4>R² (Coefficient of Determination)</h4>
              <p>Proportion of variance explained. <strong>Higher is better (0-1).</strong></p>
              <p className="formula">Range: 0 to 1 (1 = perfect fit)</p>
            </div>
            <div className="metric-def">
              <h4>R (Correlation Coefficient)</h4>
              <p>Strength of linear relationship. <strong>Higher is better (0-1).</strong></p>
              <p className="formula">Covariance / (σ_x × σ_y)</p>
            </div>
            <div className="metric-def">
              <h4>NSE (Nash-Sutcliffe Efficiency)</h4>
              <p>Model efficiency for hydrology. <strong>Higher is better (&lt;1).</strong></p>
              <p className="formula">1 - Σ(predicted - actual)² / Σ(actual - mean)²</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
