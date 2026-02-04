import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="isro-header" role="banner">
      <div className="isro-header__left">
        <img src="https://www.nrsc.gov.in/nrscnew/assets/img/footer/isro.png" alt="ISRO" className="isro-logo" />
        <div className="brand-text">
          <div className="brand-main">NRSC | ISRO</div>
          <div className="brand-sub">Space Applications Centre</div>
        </div>
      </div>

      <div className="isro-header__center">
        <h1 className="main-title">Rainfall-Runoff Hydrological Analysis</h1>
        <div className="center-sub">Real-time Watershed Modeling &amp; Prediction System</div>
      </div>

      <div className="isro-header__right">
        <div className="status" aria-live="polite">
          <span className="status-dot" aria-hidden="true"></span>
          <span className="status-text">System Active</span>
        </div>
        <div className="data-badge" aria-hidden="false">📊 3,320 Data Points</div>
      </div>
    </header>
  );
}
