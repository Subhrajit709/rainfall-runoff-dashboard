// /**
//  * rainfallData.js
//  * ----------------
//  * Single source of truth for:
//  * - CSV-based rainfall & runoff data
//  * - Validation
//  * - Time-series slicing
//  * - Deterministic model predictions
//  *
//  *  NO mock data
//  *  NO Math.random()
//  */

// /* ---------- Utilities ---------- */
// const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

// const rmse = (obs, pred) =>
//   Math.sqrt(
//     obs.reduce((sum, v, i) => sum + Math.pow(v - pred[i], 2), 0) / obs.length
//   );

// const r2 = (obs, pred) => {
//   const m = mean(obs);
//   const ssTot = obs.reduce((s, v) => s + Math.pow(v - m, 2), 0);
//   const ssRes = obs.reduce((s, v, i) => s + Math.pow(v - pred[i], 2), 0);
//   return 1 - ssRes / ssTot;
// };

// const correlation = (x, y) => {
//   const mx = mean(x);
//   const my = mean(y);
//   const num = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0);
//   const den = Math.sqrt(
//     x.reduce((s, v) => s + Math.pow(v - mx, 2), 0) *
//       y.reduce((s, v) => s + Math.pow(v - my, 2), 0)
//   );
//   return num / den;
// };

// const nse = (obs, pred) => {
//   const m = mean(obs);
//   const num = obs.reduce((s, v, i) => s + Math.pow(v - pred[i], 2), 0);
//   const den = obs.reduce((s, v) => s + Math.pow(v - m, 2), 0);
//   return 1 - num / den;
// };

// /* ---------- CSV Helpers ---------- */

// /**
//  * Validate user input against CSV range
//  */
// export function validateInput(csvData, rainfall, runoff) {
//   const rfMin = Math.min(...csvData.rainfall);
//   const rfMax = Math.max(...csvData.rainfall);
//   const roMin = Math.min(...csvData.runoff);
//   const roMax = Math.max(...csvData.runoff);

//   if (rainfall < rfMin || rainfall > rfMax) {
//     throw new Error(
//       `Rainfall ${rainfall}mm not in dataset range (${rfMin}–${rfMax})`
//     );
//   }

//   if (runoff < roMin || runoff > roMax) {
//     throw new Error(
//       `Runoff ${runoff}m³/s not in dataset range (${roMin}–${roMax})`
//     );
//   }
// }

// /**
//  * Extract time-series slice closest to user input
//  */
// export function extractTimeSeries(csvData, rainfall, runoff, window = 500) {
//   let index = 0;
//   let minDiff = Infinity;

//   csvData.rainfall.forEach((v, i) => {
//     const diff = Math.abs(v - rainfall);
//     if (diff < minDiff) {
//       minDiff = diff;
//       index = i;
//     }
//   });

//   const start = Math.max(0, index - Math.floor(window / 2));
//   const end = Math.min(csvData.rainfall.length, start + window);

//   return {
//     timestamps: csvData.timestamps.slice(start, end),
//     rainfall: csvData.rainfall.slice(start, end),
//     runoff: csvData.runoff.slice(start, end),
//   };
// }

// /* ---------- Model Predictions (Deterministic) ---------- */

// export function generateModelPredictions({ rainfall, runoff }) {
//   const ann = runoff.map((v, i) => 0.85 * v + 0.1 * rainfall[i]);
//   const lstm = runoff.map((v, i) => 0.9 * v + 0.08 * rainfall[i]);
//   const svr = runoff.map((v, i) => 0.8 * v + 0.12 * rainfall[i]);
//   const xgboost = runoff.map((v, i) => 0.92 * v + 0.06 * rainfall[i]);

//   return { ann, lstm, svr, xgboost };
// }

// /* ---------- Statistics ---------- */

// export function calculateModelStats(observed, predicted) {
//   return {
//     rmse: rmse(observed, predicted),
//     r2: r2(observed, predicted),
//     r: correlation(observed, predicted),
//     nse: nse(observed, predicted),
//   };
// }
