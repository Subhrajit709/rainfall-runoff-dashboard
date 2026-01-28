import { useState } from "react";

export default function Header() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const tabs = ["Dashboard", "DSS Tools", "Analytics", "Data"];

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    
    switch(tab) {
      case "Dashboard":
        window.location.hash = "#dashboard";
        console.log("Dashboard loaded");
        break;
      case "DSS Tools":
        window.location.hash = "#dss-tools";
        console.log("DSS Tools loaded");
        break;
      case "Analytics":
        window.location.hash = "#analytics";
        console.log("Analytics loaded");
        break;
      case "Data":
        window.location.hash = "#data";
        console.log("Data loaded");
        break;
      default:
        break;
    }
  };

  return (
    <header className="header">
      <div className="logo">NRSC | ISRO</div>
      <h1>Geospatial Weather Monitoring Dashboard</h1>
      <nav>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={activeTab === tab ? "nav-button active" : "nav-button"}
            style={{
              background: activeTab === tab ? "rgba(255, 107, 53, 0.3)" : "rgba(255, 255, 255, 0.1)",
              borderColor: activeTab === tab ? "#ff6b35" : "rgba(255, 255, 255, 0.3)",
              color: activeTab === tab ? "#ff6b35" : "rgba(255, 255, 255, 0.9)"
            }}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  );
}
