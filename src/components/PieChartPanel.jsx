import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

const COLORS = ["#f44336", "#4caf50", "#03a9f4"];

export default function PieChartPanel({ filters }) {
  const getChartData = () => {
    if (!filters) {
      return [
        { name: "Deficient", value: 40 },
        { name: "Normal", value: 30 },
        { name: "Excess", value: 30 }
      ];
    }
    return [
      { name: "Deficient", value: Math.floor(Math.random() * 50) },
      { name: "Normal", value: Math.floor(Math.random() * 50) },
      { name: "Excess", value: Math.floor(Math.random() * 50) }
    ];
  };

  const data = getChartData();

  return (
    <div className="chart-card">
      <h3>Rainfall Distribution</h3>
      {filters && <p style={{ fontSize: "12px", color: "#666", margin: "0 0 10px 0" }}>Based on: {filters.level} - {filters.region}</p>}
      <PieChart width={180} height={180}>
        <Pie data={data} dataKey="value" outerRadius={70}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
