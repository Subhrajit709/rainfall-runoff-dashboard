// import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
// import { rainfallSeries } from "../data/rainfallData";

// const COLORS = ["#f44336", "#4caf50", "#2196f3"];

// export default function PieChartPanel({ chartsData }) {
//   if (!chartsData) return null;

//   // Categorize rainfall values
//   let deficient = 0;
//   let normal = 0;
//   let excess = 0;

//   rainfallSeries.forEach((d) => {
//     if (d.rainfall < 40) deficient++;
//     else if (d.rainfall <= 80) normal++;
//     else excess++;
//   });

//   const data = [
//     { name: "Deficient", value: deficient },
//     { name: "Normal", value: normal },
//     { name: "Excess", value: excess },
//   ];

//   return (
//     <div className="chart-card">
//       <h3>Rainfall Distribution</h3>

//       <PieChart width={220} height={220}>
//         <Pie
//           data={data}
//           dataKey="value"
//           outerRadius={80}
//           label
//         >
//           {data.map((_, i) => (
//             <Cell key={i} fill={COLORS[i]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </div>
//   );
// }
