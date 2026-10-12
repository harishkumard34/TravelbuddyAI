import { useState, useRef, useEffect } from 'react';
import { generateTripPlan } from './api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './index.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(5000);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [itinerary, setItinerary] = useState(null);
  const [activeDay, setActiveDay] = useState(0);

  const topRef = useRef(null);
  const dayContentRef = useRef(null);

  // Scroll to top when itinerary loads
  useEffect(() => {
    if (itinerary && topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [itinerary]);

  // Scroll to day content top when tab changes
  useEffect(() => {
    if (dayContentRef.current) {
      dayContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary(null);
    setActiveDay(0);

    try {
      const response = await generateTripPlan(destination, days, budget);
      if (response.status === 'success') {
        let rawText = response.data.itinerary;
        // Remove AI meta-commentary about failed tool calls
        rawText = rawText.replace(/\(I attempted to fetch.*?\)\n?/gis, '');
        rawText = rawText.replace(/\(Note:.*?tool.*?\)\n?/gis, '');
        rawText = rawText.replace(/Current weather data could not be fetched[^.]*\.\s*/gi, '');
        setItinerary(rawText.trim());
      } else {
        setError('Received an unexpected response from the AI.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Parse into: intro section + one section per day
  const parseItinerary = (text) => {
    const sections = text.split(/(?=\n(?:#{1,3}\s*)?Day \d+[\s\:\-])/i);
    let intro = '';
    let daySections = [];

    if (!sections[0].match(/^(?:#{1,3}\s*)?Day \d+/i)) {
      intro = sections.shift();
    }
    daySections = sections.filter(s => s.trim().length > 0);
    return { intro, daySections };
  };

  const parsedData = itinerary ? parseItinerary(itinerary) : null;

  // ─── SPLASH SCREEN ────────────────────────────────────────────────────────
  if (showSplash) {
    return (
      <div className="splash-screen">
        <div className="splash-card">
          <div className="splash-icon">✈️</div>
          <h1 className="splash-title">
            TravelBuddy <span className="text-green">AI</span>
          </h1>
          <p className="splash-subtitle">
            Your personal, intelligent travel companion.<br />
            Let AI craft your perfect itinerary strictly within your budget.
          </p>
          <button
            onClick={() => setShowSplash(false)}
            className="btn-primary btn-large"
          >
            Start Your Journey ✈️
          </button>
        </div>
      </div>
    );
  }

  // ─── MAIN APP ─────────────────────────────────────────────────────────────
  return (
    <div className="app-wrapper">

      {/* Sticky Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <h2 className="nav-title">TravelBuddy <span className="text-green">AI</span></h2>
          <button className="btn-primary btn-sm" onClick={() => { setItinerary(null); setError(''); }}>
            New Trip
          </button>
        </div>
      </nav>

      {/* ── FORM PAGE ─────────────────────────────────────────────────────── */}
      {!itinerary && (
        <main className="form-page">
          <div className="form-hero">
            <h1 className="hero-title">Plan your next adventure.</h1>
            <p className="hero-sub">Tell us where you want to go, and our AI will build a complete itinerary strictly within your budget.</p>
          </div>

          <div className="form-card">
            <form onSubmit={handleSubmit} className="trip-form">
              <div className="form-field">
                <label>Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Goa, Paris, Tokyo"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Days</label>
                  <input
                    type="number"
                    min="1" max="30"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Budget (₹)</label>
                  <input
                    type="number"
                    min="500"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={loading}
              >
                {loading ? '⏳ AI is mapping your journey...' : '✨ Plan My Adventure'}
              </button>
            </form>

            {error && (
              <div className="error-box">
                Failed to fetch trip plan. Server might be down or busy.
              </div>
            )}
          </div>
        </main>
      )}

      {/* ── ITINERARY PAGE ────────────────────────────────────────────────── */}
      {itinerary && parsedData && (
        <main className="itinerary-page" ref={topRef}>

          {/* Page Header */}
          <div className="itinerary-header">
            <h1 className="itinerary-title">✨ Your Epic Journey</h1>
            <p className="itinerary-subtitle">to {destination} · {days} Days · ₹{Number(budget).toLocaleString('en-IN')} Budget</p>
          </div>

          {/* Weather / Intro section */}
          {parsedData.intro && (
            <div className="intro-section">
              <div className="markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parsedData.intro}</ReactMarkdown>
              </div>
            </div>
          )}

          {/* Day Tabs — sticky below navbar */}
          {parsedData.daySections.length > 0 && (
            <>
              <div className="day-tabs-bar">
                <div className="day-tabs-scroll">
                  {parsedData.daySections.map((_, index) => (
                    <button
                      key={index}
                      className={`day-tab ${activeDay === index ? 'day-tab-active' : ''}`}
                      onClick={() => setActiveDay(index)}
                    >
                      Day {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Content — full page, no inner scroll */}
              <div className="day-content" ref={dayContentRef}>
                <div className="day-content-inner">
                  <div className="markdown-content">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {parsedData.daySections[activeDay]}
                    </ReactMarkdown>
                  </div>

                  {/* Prev / Next navigation */}
                  <div className="day-nav">
                    <button
                      className="btn-outline"
                      disabled={activeDay === 0}
                      onClick={() => setActiveDay(activeDay - 1)}
                    >
                      ← Previous Day
                    </button>
                    <span className="day-counter">
                      Day {activeDay + 1} / {parsedData.daySections.length}
                    </span>
                    <button
                      className="btn-outline"
                      disabled={activeDay === parsedData.daySections.length - 1}
                      onClick={() => setActiveDay(activeDay + 1)}
                    >
                      Next Day →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      )}

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 TravelBuddy AI · Built with ❤️ and AI</p>
      </footer>
    </div>
  );
}

export default App;
