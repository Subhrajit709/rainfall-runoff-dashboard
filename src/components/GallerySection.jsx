export default function GallerySection() {
  const satellites = [
    {
      id: 1,
      name: "Resourcesat-2A",
      image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400",
      description: "Advanced land observation",
      launched: "2016"
    },
    {
      id: 2,
      name: "Cartosat-3",
      image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400",
      description: "High-resolution imaging",
      launched: "2019"
    },
    {
      id: 3,
      name: "RISAT-2B",
      image: "https://images.unsplash.com/photo-1581822261290-991b38693d1b?w=400",
      description: "Radar imaging satellite",
      launched: "2019"
    },
    {
      id: 4,
      name: "OCEANSAT-3",
      image: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400",
      description: "Ocean monitoring",
      launched: "2022"
    },
    {
      id: 5,
      name: "Chandrayaan-3",
      image: "https://images.unsplash.com/photo-1454789476662-53eb23ba5907?w=400",
      description: "Lunar exploration",
      launched: "2023"
    },
    {
      id: 6,
      name: "INSAT-3DR",
      image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400",
      description: "Meteorological satellite",
      launched: "2016"
    },
    {
      id: 7,
      name: "GSAT-30",
      image: "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=400",
      description: "Communication satellite",
      launched: "2020"
    },
    {
      id: 8,
      name: "EMISAT",
      image: "https://images.unsplash.com/photo-1614314107768-6018061b5b72?w=400",
      description: "Electronic intelligence",
      launched: "2019"
    }
  ];

  return (
    <div style={{
      background: '#ffffff',  /* ✅ WHITE */
      padding: '80px 40px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{
          fontSize: '42px',
          fontWeight: '800',
          textAlign: 'center',
          marginBottom: '60px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Satellite Gallery
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '30px'
        }}>
          {satellites.map((sat) => (
            <div
              key={sat.id}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{
                width: '100%',
                height: '200px',
                overflow: 'hidden',
                background: '#f8fafc'
              }}>
                <img
                  src={sat.image}
                  alt={sat.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
              <div style={{
                padding: '20px',
                background: '#ffffff'
              }}>
                <h4 style={{
                  margin: '0 0 8px 0',
                  fontSize: '18px',
                  fontWeight: '700',
                  color: '#1e293b'
                }}>
                  {sat.name}
                </h4>
                <p style={{
                  margin: '0 0 8px 0',
                  fontSize: '13px',
                  color: '#64748b'
                }}>
                  {sat.description}
                </p>
                <div style={{
                  fontSize: '12px',
                  color: '#94a3b8'
                }}>
                  🚀 Launched: {sat.launched}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
