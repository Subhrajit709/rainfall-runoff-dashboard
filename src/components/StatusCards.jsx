// import { useState } from "react";

// export default function StatusCards({ filters }) {
//   const [selectedCategory, setSelectedCategory] = useState(null);

//   const getRainfallData = () => {
//     if (!filters) {
//       return [
//         { label: "No Rain", color: "#9e9e9e", percentage: 5 },
//         { label: "Large Deficient", color: "#f44336", percentage: 15 },
//         { label: "Deficient", color: "#ffeb3b", percentage: 20 },
//         { label: "Normal", color: "#4caf50", percentage: 40 },
//         { label: "Excess", color: "#03a9f4", percentage: 20 }
//       ];
//     }
    
//     const total = 100;
//     const values = [
//       Math.floor(Math.random() * 15),
//       Math.floor(Math.random() * 25),
//       Math.floor(Math.random() * 25),
//       Math.floor(Math.random() * 30),
//       Math.floor(Math.random() * 25)
//     ];
//     const sum = values.reduce((a, b) => a + b, 0);
//     const normalized = values.map(v => Math.round((v / sum) * total));
    
//     return [
//       { label: "No Rain", color: "#9e9e9e", percentage: normalized[0] },
//       { label: "Large Deficient", color: "#f44336", percentage: normalized[1] },
//       { label: "Deficient", color: "#ffeb3b", percentage: normalized[2] },
//       { label: "Normal", color: "#4caf50", percentage: normalized[3] },
//       { label: "Excess", color: "#03a9f4", percentage: normalized[4] }
//     ];
//   };

//   const cards = getRainfallData();

//   return (
//     <div className="cards">
//       {cards.map((c) => (
//         <div
//           key={c.label}
//           className="card"
//           style={{
//             borderColor: c.color,
//             cursor: "pointer",
//             backgroundColor: selectedCategory === c.label ? c.color + "20" : "transparent",
//             transition: "all 0.3s ease",
//             transform: selectedCategory === c.label ? "scale(1.05)" : "scale(1)"
//           }}
//           onClick={() => setSelectedCategory(selectedCategory === c.label ? null : c.label)}
//           title={`Click to select ${c.label}`}
//         >
//           <div style={{ fontWeight: "500", marginBottom: "4px" }}>{c.label}</div>
//           <div style={{ fontSize: "18px", fontWeight: "bold", color: c.color }}>
//             {c.percentage}%
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
