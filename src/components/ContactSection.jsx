export default function ContactSection() {
  return (
    <div style={{
      background: '#ffffff',  /* ✅ WHITE */
      padding: '80px 40px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Contact & Location
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
          {/* NRSC */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '24px', color: '#667eea', marginBottom: '24px' }}>
              NRSC, Hyderabad
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>📍 ADDRESS</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  Balanagar, Hyderabad - 500 037<br/>Telangana, India
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>📞 PHONE</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  +91-40-2388 4450 / 4451 / 4452
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>✉️ EMAIL</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  director@nrsc.gov.in
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>🌐 WEBSITE</div>
                <div style={{ fontSize: '14px' }}>
                  <a href="https://www.nrsc.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                    www.nrsc.gov.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ISRO */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '24px', color: '#667eea', marginBottom: '24px' }}>
              ISRO Headquarters
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>📍 ADDRESS</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  Antariksh Bhavan, New BEL Road<br/>Bengaluru - 560 231, Karnataka
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>📞 PHONE</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  +91-80-2341 7100 / 7200
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>✉️ EMAIL</div>
                <div style={{ fontSize: '14px', color: '#1e293b' }}>
                  isro-hq@isro.gov.in
                </div>
              </div>

              <div>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px', fontWeight: '600' }}>🌐 WEBSITE</div>
                <div style={{ fontSize: '14px' }}>
                  <a href="https://www.isro.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
                    www.isro.gov.in
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
