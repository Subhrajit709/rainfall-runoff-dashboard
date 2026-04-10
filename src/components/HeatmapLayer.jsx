// import { useEffect, useRef, useCallback } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";
// import "leaflet.heat";

// // Calculate pixel radius so that 0.05° grid points overlap and blend smoothly
// function getRadiusForZoom(zoom) {
//   const pixelsPerDegree = (256 * Math.pow(2, zoom)) / 360;
//   const spacingPx = 0.05 * pixelsPerDegree;
//   return Math.max(8, Math.min(spacingPx * 0.75, 120));
// }

// function getBlurForZoom(zoom) {
//   const radius = getRadiusForZoom(zoom);
//   return Math.max(6, radius * 0.8);
// }

// export default function HeatmapLayer({ points, maxIntensity }) {
//   const map = useMap();
//   const heatRef = useRef(null);

//   const createHeatLayer = useCallback(() => {
//     if (!points || points.length === 0) return;

//     if (heatRef.current) {
//       map.removeLayer(heatRef.current);
//       heatRef.current = null;
//     }

//     const max = maxIntensity ?? Math.max(...points.map(p => Number(p.m2025) || 0));
//     const zoom = map.getZoom();

//     const heatData = points
//       .filter(p => p.lat && p.lng)
//       .map(p => [p.lat, p.lng, (Number(p.m2025) || 0) / max]);

//     const heat = L.heatLayer(heatData, {
//       radius: getRadiusForZoom(zoom),
//       blur: getBlurForZoom(zoom),
//       maxZoom: 18,
//       minOpacity: 0.4,
//       gradient: {
//         0.0: "#f7fbff",
//         0.15: "#deebf7",
//         0.3: "#c6dbef",
//         0.45: "#9ecae1",
//         0.6: "#6baed6",
//         0.75: "#2171b5",
//         0.9: "#08519c",
//         1.0: "#08306b",
//       },
//     });

//     heat.addTo(map);
//     heatRef.current = heat;
//   }, [map, points, maxIntensity]);

//   useEffect(() => {
//     createHeatLayer();

//     const onZoom = () => createHeatLayer();
//     map.on("zoomend", onZoom);

//     return () => {
//       map.off("zoomend", onZoom);
//       if (heatRef.current) {
//         map.removeLayer(heatRef.current);
//         heatRef.current = null;
//       }
//     };
//   }, [map, createHeatLayer]);

//   return null;
// }
