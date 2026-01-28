export const rainfallSeries = Array.from({ length: 3320 }, (_, i) => ({
  time: i + 1,
  rainfall: Math.max(0, 50 + Math.sin(i / 100) * 80 + (Math.random() - 0.5) * 40),
}));


export const runoffSeries = Array.from({ length: 3320 }, (_, i) => ({
  time: i + 1,
  runoff: Math.max(0, 30 + Math.sin(i / 150) * 50 + (Math.random() - 0.5) * 25),
}));
 
export const modelStats = [
  { model: "ANN", rmse: 12.3, r2: 0.82, r: 0.88, nse: 0.79 },
  { model: "LSTM", rmse: 9.1, r2: 0.90, r: 0.93, nse: 0.88 },
  { model: "SVR", rmse: 14.7, r2: 0.76, r: 0.81, nse: 0.73 },
  { model: "XGBoost", rmse: 8.4, r2: 0.92, r: 0.95, nse: 0.91 },
];


export const generateModelPredictions = (variable) => {
  const baseData = variable === "rainfall" ? rainfallSeries : runoffSeries;
  const key = variable === "rainfall" ? "rainfall" : "runoff";
  
  return baseData.map((point) => ({
    time: point.time,
    [key]: point[key],
    
    ANN_pred: point[key] + (Math.random() - 0.5) * 10,
    LSTM_pred: point[key] + (Math.random() - 0.5) * 6,
    SVR_pred: point[key] + (Math.random() - 0.5) * 12,
    XGBoost_pred: point[key] + (Math.random() - 0.5) * 5,
  }));
};
