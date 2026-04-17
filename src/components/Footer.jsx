export default function Footer({ onNavigate, dashboardRef }) {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="app-footer">
      <div className="footer-main">
        <div className="footer-grid">
          {/* About Column */}
          <div className="footer-column">
            <h4>About Us</h4>
            <p className="footer-description">
              National Remote Sensing Centre (NRSC) is a premier institution of ISRO 
              for satellite remote sensing, aerial photography, and decision support systems.
            </p>
            <div className="footer-logos">
              <img 
                src="https://www.nrsc.gov.in/sites/default/files/NRSC_0.png" 
                alt="NRSC" 
                className="footer-logo"
              />
              <img 
                src="https://www.isro.gov.in/media_isro/image/index/Logo/isro_logo_new.png" 
                alt="ISRO" 
                className="footer-logo"
              />
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><a href="https://www.isro.gov.in" target="_blank" rel="noopener noreferrer">ISRO</a></li>
              <li><a href="https://www.nrsc.gov.in" target="_blank" rel="noopener noreferrer">NRSC</a></li>
              <li><a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noopener noreferrer">Bhuvan</a></li>
              <li><a href="https://vedas.sac.gov.in" target="_blank" rel="noopener noreferrer">VEDAS</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-column">
            <h4>Our Services</h4>
            <ul className="footer-links">
              <li>Satellite Data Products</li>
              <li>Geospatial Services</li>
              <li>Disaster Monitoring</li>
              <li>Climate Analysis</li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-column">
            <h4>Contact</h4>
            <ul className="footer-contact">
              <li>
                <span className="contact-icon">📍</span>
                Balanagar, Hyderabad - 500 037
              </li>
              <li>
                <span className="contact-icon">📞</span>
                +91-40-2388 4450
              </li>
              <li>
                <span className="contact-icon">✉️</span>
                director@nrsc.gov.in
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <div className="footer-left-bottom">
            <span>© {currentYear} National Remote Sensing Centre, ISRO. All rights reserved.</span>
          </div>
          <div className="footer-center-bottom">
            <span className="footer-badge">CHIRPS Data</span>
            <span className="footer-badge">Real-time Analysis</span>
            <span className="footer-badge">ML Powered</span>
          </div>
          <div className="footer-right-bottom">
            <button className="scroll-to-top" onClick={scrollToTop} title="Back to Top">
              ↑ Top
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
