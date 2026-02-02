import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { runoffSeries } from "../data/rainfallData";

export default function HistogramPanel({ chartsData }) {
  if (!chartsData) return null;

  // Create bins
  const bins = {
    "0–10": 0,
    "10–20": 0,
    "20–30": 0,
    "30–40": 0,
    "40+": 0,
  };

  runoffSeries.forEach((d) => {
    if (d.runoff < 10) bins["0–10"]++;
    else if (d.runoff < 20) bins["10–20"]++;
    else if (d.runoff < 30) bins["20–30"]++;
    else if (d.runoff < 40) bins["30–40"]++;
    else bins["40+"]++;
  });

  const data = Object.keys(bins).map((key) => ({
    range: key,
    count: bins[key],
  }));

  return (
    <div className="chart-card">
      <h3>Runoff Distribution</h3>

      <BarChart width={220} height={220} data={data}>
        <XAxis dataKey="range" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#1976d2" />
      </BarChart>
    </div>
  );
}
