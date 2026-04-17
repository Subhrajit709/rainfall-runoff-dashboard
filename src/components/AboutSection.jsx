// AboutSection.jsx - WHITE background, SAME text
export default function AboutSection() {
  return (
    <div style={{
      background: '#ffffff',  /* ✅ WHITE */
      padding: '80px 40px',
      color: '#1e293b'  /* Dark text for readability */
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
          About NRSC & ISRO
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
          {/* ISRO Card */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '28px', color: '#667eea', marginBottom: '12px' }}>ISRO</h3>
            <h4 style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>Indian Space Research Organisation</h4>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569' }}>
              ISRO is the space agency of the Government of India, responsible for space research 
              and planetary exploration. Established in 1969, it has launched 129+ satellite missions.
            </p>
          </div>

          {/* NRSC Card */}
          <div style={{
            background: '#f8fafc',
            borderRadius: '20px',
            padding: '40px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ fontSize: '28px', color: '#667eea', marginBottom: '12px' }}>NRSC</h3>
            <h4 style={{ fontSize: '16px', color: '#64748b', marginBottom: '20px' }}>National Remote Sensing Centre</h4>
            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569' }}>
              NRSC is responsible for remote sensing satellite data acquisition and processing. 
              Located in Hyderabad, it plays a vital role in disaster management and environmental studies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
