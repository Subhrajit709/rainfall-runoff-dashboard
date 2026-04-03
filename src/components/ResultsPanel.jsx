import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { useState } from "react";

export default function ResultsPanel({ selectedPoint, chartsData, modelResults, onReset }) {
  const [selectedMetric, setSelectedMetric] = useState('rmse');
  
  if (!modelResults) {
    return null;
  }

  const { models, rainfall, runoff, matchInfo, trainSize, testSize } = modelResults;

  // Model colors - matching all 6 models from model.py
  const modelColors = {
    KNN: "#8B5CF6",          // Purple
    ANN: "#EF4444",          // Red
    LSTM: "#06B6D4",         // Cyan
    SVR: "#F59E0B",          // Amber
    "Random Forest": "#10B981", // Green
    XGBoost: "#EC4899",      // Pink
  };

  // Metrics data for bar chart - ALL 6 MODELS
  const metricsData = [
    {
      metric: "RMSE",
      KNN: models.find(m => m.model === "KNN")?.rmse || 0,
      ANN: models.find(m => m.model === "ANN")?.rmse || 0,
      LSTM: models.find(m => m.model === "LSTM")?.rmse || 0,
      SVR: models.find(m => m.model === "SVR")?.rmse || 0,
      "Random Forest": models.find(m => m.model === "Random Forest")?.rmse || 0,
      XGBoost: models.find(m => m.model === "XGBoost")?.rmse || 0,
      description: "Lower is Better",
    },
    {
      metric: "R²",
      KNN: models.find(m => m.model === "KNN")?.r2 || 0,
      ANN: models.find(m => m.model === "ANN")?.r2 || 0,
      LSTM: models.find(m => m.model === "LSTM")?.r2 || 0,
      SVR: models.find(m => m.model === "SVR")?.r2 || 0,
      "Random Forest": models.find(m => m.model === "Random Forest")?.r2 || 0,
      XGBoost: models.find(m => m.model === "XGBoost")?.r2 || 0,
      description: "Higher is Better",
    },
    {
      metric: "R",
      KNN: models.find(m => m.model === "KNN")?.r || 0,
      ANN: models.find(m => m.model === "ANN")?.r || 0,
      LSTM: models.find(m => m.model === "LSTM")?.r || 0,
      SVR: models.find(m => m.model === "SVR")?.r || 0,
      "Random Forest": models.find(m => m.model === "Random Forest")?.r || 0,
      XGBoost: models.find(m => m.model === "XGBoost")?.r || 0,
      description: "Higher is Better",
    },
    {
      metric: "NSE",
      KNN: models.find(m => m.model === "KNN")?.nse || 0,
      ANN: models.find(m => m.model === "ANN")?.nse || 0,
      LSTM: models.find(m => m.model === "LSTM")?.nse || 0,
      SVR: models.find(m => m.model === "SVR")?.nse || 0,
      "Random Forest": models.find(m => m.model === "Random Forest")?.nse || 0,
      XGBoost: models.find(m => m.model === "XGBoost")?.nse || 0,
      description: "Higher is Better",
    },
    {
      metric: "MAE",
      KNN: models.find(m => m.model === "KNN")?.mae || 0,
      ANN: models.find(m => m.model === "ANN")?.mae || 0,
      LSTM: models.find(m => m.model === "LSTM")?.mae || 0,
      SVR: models.find(m => m.model === "SVR")?.mae || 0,
      "Random Forest": models.find(m => m.model === "Random Forest")?.mae || 0,
      XGBoost: models.find(m => m.model === "XGBoost")?.mae || 0,
      description: "Lower is Better",
    },
  ];

  // Radar chart data for model comparison
  const radarData = [
    {
      metric: "R²",
      ...Object.fromEntries(
        models.map(m => [m.model, (m.r2 * 100).toFixed(1)])
      ),
      fullMark: 100,
    },
    {
      metric: "R",
      ...Object.fromEntries(
        models.map(m => [m.model, (m.r * 100).toFixed(1)])
      ),
      fullMark: 100,
    },
    {
      metric: "NSE",
      ...Object.fromEntries(
        models.map(m => [m.model, (m.nse * 100).toFixed(1)])
      ),
      fullMark: 100,
    },
    {
      metric: "Accuracy",
      ...Object.fromEntries(
        models.map(m => [m.model, ((1 - m.rmse) * 100).toFixed(1)])
      ),
      fullMark: 100,
    },
  ];

  const rainfallData = rainfall;
  const runoffData = runoff;

  // Get best model by RMSE (lowest is best)
  const bestModel = models.reduce((best, current) => 
    current.rmse < best.rmse ? current : best
  );

  return (
    <div className="results-panel">
      <div className="results-header">
        <div>
          <h2>🎯 Advanced Model Comparison Dashboard</h2>
          <div className="location-info-compact">
            <span>📍 {selectedPoint.lat.toFixed(3)}°N, {selectedPoint.lng.toFixed(3)}°E</span>
            <span>|</span>
            <span>📊 6 ML Models Analyzed</span>
            <span>|</span>
            <span>🏆 Best: {bestModel.model}</span>
          </div>
        </div>
        <button className="reset-button" onClick={onReset}>
          ← New Selection
        </button>
      </div>

      <div className="results-content">
        {/* Training Info Banner */}
        <div className="training-info-banner">
          <div className="info-item">
            <span className="label">🎓 Training Set:</span>
            <span className="value">{trainSize} points</span>
          </div>
          <div className="info-item">
            <span className="label">🧪 Test Set:</span>
            <span className="value">{testSize} points</span>
          </div>
          <div className="info-item">
            <span className="label">📂 Data Source:</span>
            <span className="value">Discharge_Beki1.xlsx</span>
          </div>
          <div className="info-item">
            <span className="label">🤖 Models:</span>
            <span className="value">KNN, ANN, LSTM, SVR, RF, XGBoost</span>
          </div>
        </div>

        {/* Time Series Charts */}
        <div className="section">
          <h3>📈 Input Data Visualization</h3>
          <div className="charts-dual-container">
            <div className="chart-section">
              <div className="chart-header">
                <h4>🌧️ Rainfall Time Series</h4>
                <span className="unit-badge">(mm)</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={rainfallData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#999" 
                    tick={{ fontSize: 10 }} 
                    interval={Math.floor(rainfallData.length / 10)} 
                  />
                  <YAxis stroke="#999" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#f0f5f9",
                      border: "2px solid #1e90ff",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    formatter={(v) => v.toFixed(2) + " mm"}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="rainfall"
                    stroke="#1e90ff" 
                    dot={false}
                    strokeWidth={2.5}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-section">
              <div className="chart-header">
                <h4>💧 Runoff Time Series</h4>
                <span className="unit-badge">(m³/s)</span>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={runoffData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
                  <XAxis 
                    dataKey="time" 
                    stroke="#999" 
                    tick={{ fontSize: 10 }} 
                    interval={Math.floor(runoffData.length / 10)} 
                  />
                  <YAxis stroke="#999" tick={{ fontSize: 10 }} width={40} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "#f0f5f9",
                      border: "2px solid #00a86b",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                    }}
                    formatter={(v) => v.toFixed(2) + " m³/s"}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="runoff"
                    stroke="#00a86b" 
                    dot={false}
                    strokeWidth={2.5}
                    isAnimationActive={true}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Model Performance Comparison - Bar Chart */}
        <div className="section">
          <h3>📊 Model Performance Metrics Comparison</h3>
          <div style={{ marginBottom: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {['rmse', 'r2', 'r', 'nse', 'mae'].map(metric => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: selectedMetric === metric ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                  background: selectedMetric === metric ? '#eff6ff' : 'white',
                  color: selectedMetric === metric ? '#1e40af' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: selectedMetric === metric ? '700' : '500',
                  textTransform: 'uppercase',
                  transition: 'all 0.2s',
                }}
              >
                {metric.toUpperCase()}
              </button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={metricsData.filter(m => m.metric.toLowerCase().replace('²', '2') === selectedMetric)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8ecf0" vertical={false} />
              <XAxis dataKey="metric" stroke="#999" tick={{ fontSize: 12, fontWeight: '600' }} />
              <YAxis stroke="#999" tick={{ fontSize: 11 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#f0f5f9",
                  border: "2px solid #d1d8de",
                  borderRadius: "8px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  padding: '12px'
                }}
                formatter={(v) => v.toFixed(4)}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="KNN" fill={modelColors.KNN} radius={[6, 6, 0, 0]} />
              <Bar dataKey="ANN" fill={modelColors.ANN} radius={[6, 6, 0, 0]} />
              <Bar dataKey="LSTM" fill={modelColors.LSTM} radius={[6, 6, 0, 0]} />
              <Bar dataKey="SVR" fill={modelColors.SVR} radius={[6, 6, 0, 0]} />
              <Bar dataKey="Random Forest" fill={modelColors["Random Forest"]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="XGBoost" fill={modelColors.XGBoost} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart for Overall Model Comparison */}
        <div className="section">
          <h3>🎯 Multi-Metric Radar Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12, fontWeight: '600' }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "#f0f5f9",
                  border: "2px solid #d1d8de",
                  borderRadius: "8px"
                }}
              />
              <Legend />
              {models.map(model => (
                <Radar
                  key={model.model}
                  name={model.model}
                  dataKey={model.model}
                  stroke={modelColors[model.model]}
                  fill={modelColors[model.model]}
                  fillOpacity={0.15}
                  strokeWidth={2}
                />
              ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Comprehensive Statistics Table */}
        <div className="section">
          <h3>📋 Detailed Performance Metrics Table</h3>
          <div className="table-wrapper">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Type</th>
                  <th>RMSE ↓</th>
                  <th>MAE ↓</th>
                  <th>R² ↑</th>
                  <th>R ↑</th>
                  <th>NSE ↑</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {models
                  .slice()
                  .sort((a, b) => a.rmse - b.rmse)
                  .map((model, idx) => {
                    const modelType = {
                      'KNN': 'Instance-Based',
                      'ANN': 'Neural Network',
                      'LSTM': 'Deep Learning',
                      'SVR': 'Kernel Method',
                      'Random Forest': 'Ensemble',
                      'XGBoost': 'Gradient Boosting'
                    };
                    
                    return (
                      <tr key={model.model} className={idx === 0 ? "best-row" : ""}>
                        <td className="model-cell">
                          <span className="model-badge" style={{ backgroundColor: modelColors[model.model] }}>
                            {model.model}
                          </span>
                        </td>
                        <td style={{ fontSize: '11px', color: '#6b7280' }}>{modelType[model.model]}</td>
                        <td style={{ fontWeight: idx === 0 ? '700' : '500' }}>{model.rmse.toFixed(4)}</td>
                        <td>{model.mae?.toFixed(4) || 'N/A'}</td>
                        <td>{model.r2.toFixed(4)}</td>
                        <td>{model.r.toFixed(4)}</td>
                        <td>{model.nse.toFixed(4)}</td>
                        <td className="rank-cell">
                          {idx === 0 && "🏆 1st"}
                          {idx === 1 && "🥈 2nd"}
                          {idx === 2 && "🥉 3rd"}
                          {idx === 3 && "4th"}
                          {idx === 4 && "5th"}
                          {idx === 5 && "6th"}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Analysis Summary Cards */}
        <div className="section analysis-box">
          <h3>📋 Performance Analysis Summary</h3>
          <div className="analysis-grid">
            <div className="analysis-card" style={{ borderLeft: `4px solid ${modelColors[bestModel.model]}` }}>
              <h4>🏆 Best Overall Model</h4>
              <p className="big-text">{bestModel.model}</p>
              <p className="small-text">Lowest RMSE: {bestModel.rmse.toFixed(4)}</p>
              <p className="small-text" style={{ marginTop: '4px', color: '#6b7280' }}>
                {bestModel.model === 'KNN' && 'Instance-based learning'}
                {bestModel.model === 'ANN' && 'Neural network approach'}
                {bestModel.model === 'LSTM' && 'Sequential deep learning'}
                {bestModel.model === 'SVR' && 'Support vector regression'}
                {bestModel.model === 'Random Forest' && 'Ensemble method'}
                {bestModel.model === 'XGBoost' && 'Gradient boosting'}
              </p>
            </div>
            
            <div className="analysis-card">
              <h4>📈 Accuracy Score</h4>
              <p className="big-text">R² = {bestModel.r2.toFixed(4)}</p>
              <p className="small-text">{(bestModel.r2 * 100).toFixed(2)}% variance explained</p>
              <div style={{ 
                marginTop: '8px', 
                height: '6px', 
                background: '#e5e7eb', 
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${bestModel.r2 * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${modelColors[bestModel.model]}, #3b82f6)`,
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
            
            <div className="analysis-card">
              <h4>✅ Model Efficiency</h4>
              <p className="big-text">NSE = {bestModel.nse.toFixed(4)}</p>
              <p className="small-text">
                {bestModel.nse > 0.9 && 'Outstanding efficiency'}
                {bestModel.nse > 0.75 && bestModel.nse <= 0.9 && 'Very good efficiency'}
                {bestModel.nse > 0.5 && bestModel.nse <= 0.75 && 'Good efficiency'}
                {bestModel.nse <= 0.5 && 'Moderate efficiency'}
              </p>
            </div>
            
            <div className="analysis-card">
              <h4>⚡ Correlation Strength</h4>
              <p className="big-text">R = {bestModel.r.toFixed(4)}</p>
              <p className="small-text">
                {bestModel.r > 0.9 && 'Very strong correlation'}
                {bestModel.r > 0.7 && bestModel.r <= 0.9 && 'Strong correlation'}
                {bestModel.r > 0.5 && bestModel.r <= 0.7 && 'Moderate correlation'}
                {bestModel.r <= 0.5 && 'Weak correlation'}
              </p>
            </div>

            <div className="analysis-card">
              <h4>📉 Error Magnitude</h4>
              <p className="big-text">MAE = {bestModel.mae?.toFixed(4) || 'N/A'}</p>
              <p className="small-text">Mean absolute error</p>
            </div>

            <div className="analysis-card">
              <h4>🎲 Models Tested</h4>
              <p className="big-text">{models.length}</p>
              <p className="small-text">Comprehensive ML comparison</p>
            </div>
          </div>

          <div className="recommendations">
            <h4>💡 Key Findings & Recommendations</h4>
            <ul>
              <li>
                <strong>{bestModel.model}</strong> demonstrates superior performance with RMSE of <strong>{bestModel.rmse.toFixed(4)}</strong>, 
                outperforming {models.length - 1} other machine learning models
              </li>
              <li>
                The model achieves an R² score of <strong>{bestModel.r2.toFixed(4)}</strong>, 
                explaining <strong>{(bestModel.r2 * 100).toFixed(2)}%</strong> of the variance in runoff predictions
              </li>
              <li>
                Nash-Sutcliffe Efficiency (NSE) of <strong>{bestModel.nse.toFixed(4)}</strong> indicates 
                {bestModel.nse > 0.75 ? ' excellent' : bestModel.nse > 0.5 ? ' good' : ' satisfactory'} predictive capability
              </li>
              <li>
                Analysis validated using <strong>{trainSize}</strong> training samples and <strong>{testSize}</strong> test samples 
                from the Beki River discharge dataset
              </li>
              <li>
                <strong>Model diversity:</strong> Tested {models.map(m => m.model).join(', ')} to ensure robust comparison 
                across different ML paradigms
              </li>
            </ul>
          </div>
        </div>

        {/* Model Descriptions */}
        <div className="section">
          <h3>🤖 Model Descriptions & Algorithms</h3>
          <div className="metrics-grid">
            <div className="metric-def">
              <h4 style={{ color: modelColors.KNN }}>🔷 KNN (K-Nearest Neighbors)</h4>
              <p><strong>Type:</strong> Instance-based learning</p>
              <p>Uses the 5-8 nearest training examples to make predictions based on weighted distances. Non-parametric and effective for complex patterns.</p>
            </div>
            
            <div className="metric-def">
              <h4 style={{ color: modelColors.ANN }}>🧠 ANN (Artificial Neural Network)</h4>
              <p><strong>Type:</strong> Multi-layer perceptron</p>
              <p>Neural network with hidden layers (64, 32 neurons) using ReLU activation. Trained with Adam optimizer for 3000 iterations.</p>
            </div>
            
            <div className="metric-def">
              <h4 style={{ color: modelColors.LSTM }}>🔄 LSTM (Long Short-Term Memory)</h4>
              <p><strong>Type:</strong> Recurrent neural network</p>
              <p>Specialized RNN architecture designed to learn temporal dependencies and sequential patterns in time-series data.</p>
            </div>
            
            <div className="metric-def">
              <h4 style={{ color: modelColors.SVR }}>📐 SVR (Support Vector Regression)</h4>
              <p><strong>Type:</strong> Kernel-based method</p>
              <p>Uses kernel tricks to find optimal hyperplane in high-dimensional space. Robust to outliers and effective for non-linear relationships.</p>
            </div>
            
            <div className="metric-def">
              <h4 style={{ color: modelColors["Random Forest"] }}>🌳 Random Forest</h4>
              <p><strong>Type:</strong> Ensemble learning</p>
              <p>Combines 400 decision trees with max depth of 12. Reduces overfitting through bootstrap aggregating and random feature selection.</p>
            </div>
            
            <div className="metric-def">
              <h4 style={{ color: modelColors.XGBoost }}>⚡ XGBoost</h4>
              <p><strong>Type:</strong> Gradient boosting</p>
              <p>Uses 500 boosting rounds with 0.05 learning rate. Builds trees sequentially, each correcting errors of previous ones.</p>
            </div>
          </div>
        </div>

        {/* Metric Definitions */}
        <div className="section">
          <h3>📚 Statistical Metrics Explained</h3>
          <div className="metrics-grid">
            <div className="metric-def">
              <h4>RMSE (Root Mean Square Error)</h4>
              <p>Measures the square root of average squared prediction errors. <strong>Lower values indicate better fit.</strong></p>
              <p className="formula">RMSE = √(Σ(predicted - actual)² / n)</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                Sensitive to outliers. Same units as target variable.
              </p>
            </div>
            
            <div className="metric-def">
              <h4>MAE (Mean Absolute Error)</h4>
              <p>Average of absolute differences between predictions and observations. <strong>Lower is better.</strong></p>
              <p className="formula">MAE = Σ|predicted - actual| / n</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                Less sensitive to outliers than RMSE. Easier to interpret.
              </p>
            </div>
            
            <div className="metric-def">
              <h4>R² (Coefficient of Determination)</h4>
              <p>Proportion of variance in the target variable explained by the model. <strong>Range: 0 to 1 (higher is better).</strong></p>
              <p className="formula">R² = 1 - (SS_residual / SS_total)</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                R² = 1 indicates perfect predictions. R² = 0 means model is no better than mean.
              </p>
            </div>
            
            <div className="metric-def">
              <h4>R (Pearson Correlation)</h4>
              <p>Measures linear relationship strength between predicted and actual values. <strong>Range: -1 to 1.</strong></p>
              <p className="formula">R = Cov(X,Y) / (σ_X × σ_Y)</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                R &gt; 0.7 indicates strong positive correlation.
              </p>
            </div>
            
            <div className="metric-def">
              <h4>NSE (Nash-Sutcliffe Efficiency)</h4>
              <p>Hydrological model efficiency metric. <strong>Range: -∞ to 1 (higher is better).</strong></p>
              <p className="formula">NSE = 1 - Σ(predicted - actual)² / Σ(actual - mean)²</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                NSE &gt; 0.75: Very good | 0.5-0.75: Good | &lt; 0.5: Unsatisfactory
              </p>
            </div>
            
            <div className="metric-def">
              <h4>Train/Test Split</h4>
              <p>Data divided into training (85%) and testing (15%) sets for validation.</p>
              <p className="formula">No data leakage between sets</p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                Time-series split preserves temporal order.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
