// import { useState } from "react";
// import { statesData } from "../data/rainfallData";

// export default function ControlBar({ onShow }) {
//   const [filters, setFilters] = useState({
//     season: "Jan–Feb",
//     level: "State",
//     selectedState: "",
//     region: "All States",
//     metric: "Rainfall Deviation (%)",
//     source: "IMD",
//     date: new Date().toISOString().split("T")[0],
//     latitude: "",
//     longitude: ""
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFilters(prev => {
//       const newFilters = { ...prev, [name]: value };
      
//       if (name === "level") {
        
//         if (value === "District") {
//           if (!newFilters.selectedState) {
//             newFilters.selectedState = Object.keys(statesData)[0];
//           }
//           newFilters.region = Object.keys(statesData[newFilters.selectedState].districts)[0] || "Select District";
//         } else {
//           newFilters.region = "All States";
//         }
//       } else if (name === "selectedState") {
        
//         if (filters.level === "District") {
//           const firstDistrict = Object.keys(statesData[value].districts)[0];
//           newFilters.region = firstDistrict;
//         }
//         newFilters.selectedState = value;
//       }
      
//       return newFilters;
//     });
//   };

//   const handleShow = () => {
//     onShow(filters);
//   };

//   const handleReset = () => {
//     setFilters({
//       season: "Jan–Feb",
//       level: "State",
//       selectedState: "",
//       region: "All States",
//       metric: "Rainfall Deviation (%)",
//       source: "IMD",
//       date: new Date().toISOString().split("T")[0],
//       latitude: "",
//       longitude: ""
//     });
//   };

//   const getLocationOptions = () => {
//     if (filters.level === "State") {
//       return ["All States", ...Object.keys(statesData)];
//     } else {
      
//       const state = filters.selectedState;
//       if (state && statesData[state]) {
//         return Object.keys(statesData[state].districts);
//       }
//       return [];
//     }
//   };

//   return (
//     <div className="control-bar">
//       <select name="season" value={filters.season} onChange={handleChange}>
//         <option>Jan–Feb</option>
//         <option>Mar–May</option>
//         <option>Jun–Sep</option>
//         <option>Oct–Dec</option>
//       </select>

//       <select name="level" value={filters.level} onChange={handleChange}>
//         <option>State</option>
//         <option>District</option>
//       </select>

//       {filters.level === "District" && (
//         <select name="selectedState" value={filters.selectedState} onChange={handleChange}>
//           <option value="">Select State First</option>
//           {Object.keys(statesData).map(state => (
//             <option key={state} value={state}>{state}</option>
//           ))}
//         </select>
//       )}

//       <select name="region" value={filters.region} onChange={handleChange}>
//         {getLocationOptions().map((option) => (
//           <option key={option} value={option}>{option}</option>
//         ))}
//       </select>

//       <select name="metric" value={filters.metric} onChange={handleChange}>
//         <option>Rainfall Deviation (%)</option>
//         <option>Rainfall Intensity</option>
//         <option>Temperature Anomaly</option>
//       </select>

//       <select name="source" value={filters.source} onChange={handleChange}>
//         <option>IMD</option>
//         <option>Satellite</option>
//         <option>Weather Station</option>
//       </select>

//       <input 
//         type="date" 
//         name="date"
//         value={filters.date} 
//         onChange={handleChange}
//       />

//       <input 
//         type="number" 
//         name="latitude"
//         placeholder="Latitude (-90 to 90)"
//         value={filters.latitude} 
//         onChange={handleChange}
//         step="0.0001"
//         min="-90"
//         max="90"
//       />

//       <input 
//         type="number" 
//         name="longitude"
//         placeholder="Longitude (-180 to 180)"
//         value={filters.longitude} 
//         onChange={handleChange}
//         step="0.0001"
//         min="-180"
//         max="180"
//       />

//       <button 
//         onClick={handleShow}
//         style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }}
//       >
//         Show
//       </button>

//       <button 
//         onClick={handleReset}
//         style={{ padding: "8px 16px", background: "#6b7280", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "500" }}
//       >
//         Reset
//       </button>
//     </div>
//   );
// }
