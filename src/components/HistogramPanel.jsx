import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function HistogramPanel({ filters }) {
  const getChartData = () => {
    if (!filters) {
      return [
        { range: "-100", count: 5 },
        { range: "-50", count: 12 },
        { range: "0", count: 20 },
        { range: "50", count: 8 }
      ];
    }
    return [
      { range: "-100", count: Math.floor(Math.random() * 10) },
      { range: "-50", count: Math.floor(Math.random() * 15) },
      { range: "0", count: Math.floor(Math.random() * 25) },
      { range: "50", count: Math.floor(Math.random() * 10) }
    ];
  };

  const data = getChartData();

  return (
    <div className="chart-card">
      <h3>Deviation Histogram</h3>
      {filters && <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0" }}>Based on: {filters.level} - {filters.region}</p>}
      <BarChart width={180} height={180} data={data}>
        <XAxis dataKey="range" stroke="none" />
        <YAxis stroke="none" />
        <Tooltip />
        <Bar dataKey="count" fill="#f44336" />
      </BarChart>
    </div>
  );
}
