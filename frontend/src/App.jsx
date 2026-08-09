import { useState } from 'react';
import { generateTripPlan } from './api';
import ReactMarkdown from 'react-markdown';
import './index.css';

function App() {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itinerary, setItinerary] = useState(null);
  
  // New state for Tabs UI
  const [activeDay, setActiveDay] = useState(0);

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
    // Split the text whenever it sees "Day 1:", "Day 2", "Day 1 -", etc.
    const sections = text.split(/(?=Day \d+[:\-])/i);
    const intro = sections[0].toLowerCase().includes('day ') ? '' : sections.shift();
    return { intro, daySections: sections };
  };

  const parsedData = itinerary ? parseItinerary(itinerary) : null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ padding: '20px 48px', borderBottom: '1px solid var(--color-hairline)', backgroundColor: 'var(--color-canvas)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <h2 style={{ marginBottom: 0, letterSpacing: '-0.72px', fontSize: '28px' }}>TravelBuddy <span style={{ color: 'var(--color-primary)' }}>AI</span></h2>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ fontSize: '16px', padding: '10px 20px' }}>New Trip</button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: itinerary ? '48px' : '96px 48px', transition: 'all 0.3s ease' }}>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: itinerary ? '350px 1fr' : '1fr', 
          gap: '48px', 
          maxWidth: itinerary ? '1200px' : '600px', 
          margin: '0 auto',
          alignItems: 'start'
        }}>
          
          {/* Left Column / Centered Form */}
          <div style={{ position: itinerary ? 'sticky' : 'static', top: '100px' }}>
            {!itinerary && (
              <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <h1 style={{ fontSize: '56px', letterSpacing: '-1.44px', marginBottom: '16px' }}>Plan your next adventure.</h1>
                <p style={{ fontSize: '20px', color: 'var(--color-ink-mute)' }}>Tell us where you want to go, and our AI will build a complete itinerary strictly within your budget.</p>
              </div>
            )}

            <div className="card-light" style={{ padding: '32px' }}>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Destination</label>
                  <input type="text" placeholder="e.g. Goa, Paris, Tokyo" value={destination} onChange={(e) => setDestination(e.target.value)} style={{ padding: '12px', fontSize: '18px' }} required />
                </div>

                <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Days</label>
                    <input type="number" min="1" max="30" value={days} onChange={(e) => setDays(e.target.value)} style={{ padding: '12px', fontSize: '18px' }} required />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', fontSize: '16px' }}>Budget (Rs.)</label>
                    <input type="number" min="500" value={budget} onChange={(e) => setBudget(e.target.value)} style={{ padding: '12px', fontSize: '18px' }} required />
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

          {/* Right Column: Itinerary Results with Tabs */}
          {itinerary && parsedData && (
            <div style={{ animation: 'fadeIn 0.5s ease-in', backgroundColor: 'var(--color-canvas)', padding: '48px', borderRadius: '16px', border: '1px solid var(--color-hairline)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
              
              <h2 style={{ fontSize: '42px', marginBottom: '16px', letterSpacing: '-0.72px', color: 'var(--color-primary-deep)' }}>✨ Your Epic Journey Awaits</h2>
              
              {/* Intro / Weather Tip */}
              {parsedData.intro && (
                <div className="markdown-content" style={{ fontSize: '20px', color: 'var(--color-ink-mute)', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--color-hairline)', lineHeight: '1.8' }}>
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
                          padding: '12px 24px',
                          fontSize: '18px',
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
                    fontSize: '20px', 
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
      <footer style={{ textAlign: 'center', padding: '48px', color: 'var(--color-ink-mute-2)', fontSize: '15px', borderTop: '1px solid var(--color-hairline)', marginTop: 'auto' }}>
        <p>© 2026 TravelBuddy AI. Designed with Supabase Aesthetics.</p>
      </footer>
    </div>
  );
}

export default App;
