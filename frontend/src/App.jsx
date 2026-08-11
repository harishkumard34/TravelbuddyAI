import { useState, useRef, useEffect } from 'react';
import { generateTripPlan } from './api';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itinerary, setItinerary] = useState(null);
  
  // New state for Tabs UI
  const [activeDay, setActiveDay] = useState(0);

  // Ref for auto-scrolling to results
  const resultRef = useRef(null);

  useEffect(() => {
    if (itinerary && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [itinerary]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary(null);
    setActiveDay(0); // Reset tab

    try {
      const response = await generateTripPlan(destination, days, budget);
      if (response.status === 'success') {
        let rawText = response.data.itinerary;
        let cleanText = rawText.replace(/<[a-z_]+>[\s\S]*?<\/[a-z_]+>/gi, '');
        cleanText = cleanText.replace(/\{"Weather Tip".*?\}/gi, '');
        cleanText = cleanText.replace(/\*/g, '');
        setItinerary(cleanText.trim());
      } else {
        setError('Received an unexpected response from the AI.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Helper to parse the itinerary into days for the Tab UI
  const parseItinerary = (text) => {
    const sections = text.split(/(?=Day \d+[:\-])/i);
    const intro = sections[0].toLowerCase().includes('day ') ? '' : sections.shift();
    return { intro, daySections: sections };
  };

  const parsedData = itinerary ? parseItinerary(itinerary) : null;

  if (showSplash) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #6b01c2 0%, #644fc1 100%)', color: 'var(--color-on-dark)', textAlign: 'center', padding: '24px', animation: 'fadeIn 1s ease-in' }}>
        
        <div className="splash-card">
          <h1 className="splash-title">
            TravelBuddy <span style={{ color: 'var(--color-primary)' }}>AI</span>
          </h1>
          <p className="splash-subtitle">
            Your personal, intelligent travel companion. <br/> Let AI craft your perfect itinerary strictly within your budget.
          </p>
          
          <button 
            onClick={() => setShowSplash(false)}
            className="btn-primary"
            style={{ 
              fontSize: '22px', 
              fontWeight: 600,
              padding: '20px 48px',
              boxShadow: '0 8px 24px rgba(62, 207, 142, 0.25)',
              transition: 'transform 0.2s ease, background-color 0.2s ease'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Start Your Journey ✈️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-canvas)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div className="nav-container">
          <h2 className="nav-title">TravelBuddy <span style={{ color: 'var(--color-primary)' }}>AI</span></h2>
          <button className="btn-primary" onClick={() => window.location.reload()}>New Trip</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className={`main-content ${itinerary ? 'main-content-itinerary' : 'main-content-empty'}`}>
        
        <div className={`grid-layout ${itinerary ? 'grid-itinerary' : 'grid-empty'}`}>
          
          {/* Left Column / Centered Form */}
          {!itinerary && (
            <div className="form-column" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 className="hero-title">Plan your next adventure.</h1>
                <p className="text-body" style={{ fontSize: '20px' }}>Tell us where you want to go, and our AI will build a complete itinerary strictly within your budget.</p>
              </div>

              <div className="card-light" style={{ padding: '32px' }}>
                <form onSubmit={handleSubmit}>
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Destination</label>
                    <input type="text" placeholder="e.g. Goa, Paris, Tokyo" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                  </div>

                  <div className="form-row">
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Days</label>
                      <input type="number" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)} required />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Budget (Rs.)</label>
                      <input type="number" min="500" value={budget} onChange={(e) => setBudget(e.target.value)} required />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '18px', fontSize: '18px', fontWeight: 600 }} disabled={loading}>
                    {loading ? 'AI is mapping your journey...' : '✨ Plan My Adventure'}
                  </button>
                </form>
              </div>
              
              {error && (
                <div style={{ color: 'var(--color-accent-tomato)', marginTop: '24px', padding: '16px', backgroundColor: '#fff5f5', borderRadius: '8px', fontSize: '16px' }}>
                  <p style={{ margin: 0 }}>{error}</p>
                </div>
              )}
            </div>
          )}

          {/* Right Column: Itinerary Results with Tabs */}
          {itinerary && parsedData && (
            <div className="result-column" ref={resultRef} style={{ animation: 'fadeIn 0.5s ease-in', backgroundColor: 'var(--color-canvas)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-hairline)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              
              <h2 style={{ fontSize: '36px', marginBottom: '16px', letterSpacing: '-0.72px', color: 'var(--color-primary-deep)' }}>✨ Your Epic Journey</h2>
              
              {/* Intro / Weather Tip */}
              {parsedData.intro && (
                <div className="markdown-content" style={{ fontSize: '18px', color: 'var(--color-ink-mute)', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-hairline)', lineHeight: '1.8' }}>
                  <ReactMarkdown>{parsedData.intro}</ReactMarkdown>
                </div>
              )}

              {/* Day Tabs */}
              {parsedData.daySections.length > 0 && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
                    {parsedData.daySections.map((dayText, index) => (
                      <button 
                        key={index}
                        onClick={() => setActiveDay(index)}
                        style={{
                          padding: '10px 20px',
                          fontSize: '16px',
                          fontWeight: 600,
                          borderRadius: '8px',
                          border: activeDay === index ? '2px solid var(--color-primary)' : '1px solid var(--color-hairline)',
                          backgroundColor: activeDay === index ? 'var(--color-primary)' : 'var(--color-canvas)',
                          color: activeDay === index ? 'var(--color-on-primary)' : 'var(--color-ink)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        Day {index + 1}
                      </button>
                    ))}
                  </div>

                  {/* Active Day Content inside a scrollable area */}
                  <div className="markdown-content" style={{ 
                    marginTop: '24px', 
                    fontSize: '18px', 
                    color: 'var(--color-ink-secondary)', 
                    lineHeight: '1.9',
                    maxHeight: '600px',
                    overflowY: 'auto',
                    paddingRight: '16px'
                  }}>
                    <ReactMarkdown>{parsedData.daySections[activeDay]}</ReactMarkdown>
                  </div>
                </div>
              )}

            </div>
          )}
          
        </div>
      </main>
      
      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '32px', color: 'var(--color-ink-mute-2)', fontSize: '14px', borderTop: '1px solid var(--color-hairline)', marginTop: 'auto' }}>
        <p>© 2026 TravelBuddy AI. Designed with Supabase Aesthetics.</p>
      </footer>
    </div>
  );
}

export default App;
