export default function Footer() {
  const text =
    "National Remote Sensing Centre (NRSC) | Indian Space Research Organisation (ISRO) | Real-time Rainfall–Runoff Monitoring System | Advanced Hydrological Analysis Dashboard | Satellite-based Precipitation Insights | Data-driven Water Resource Management | Climate Intelligence for Sustainable Planning | © 2026 Government of India";

  return (
    <footer
      style={{
        overflow: "hidden",
        background:
          "linear-gradient(135deg, #0f172a 0%, #0f1928 40%, #13161f 100%)",
        borderTop: "1px solid rgba(99,179,237,0.15)",
        color: "rgb(209, 191, 191)",
        fontSize: "14.9px",
        fontWeight: "500",
        letterSpacing: "0.3px",
        whiteSpace: "nowrap",
      }}
    >
      <div className="ticker">
        <div className="ticker-content">
          <span>{text}</span>
          <span>{text}</span> {/* duplicate for seamless loop */}
        </div>
      </div>
    </footer>
  );
}