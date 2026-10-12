import { useState, useRef, useEffect } from 'react';
import { generateTripPlan } from './api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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

  const topRef    = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    if (itinerary && topRef.current) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [itinerary]);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [activeDay]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setItinerary(null);
    setActiveDay(0);
    try {
      const res = await generateTripPlan(destination, days, budget);
      if (res.status === 'success') {
        let txt = res.data.itinerary;
        txt = txt.replace(/\(I attempted to fetch.*?\)\n?/gis, '');
        txt = txt.replace(/\(Note:.*?tool.*?\)\n?/gis, '');
        txt = txt.replace(/Current weather data could not be fetched[^.]*\.\s*/gi, '');
        setItinerary(txt.trim());
      } else {
        setError('Unexpected response from AI.');
      }
    } catch (err) {
      setError('Failed to fetch trip plan. Server might be down or busy.');
    } finally {
      setLoading(false);
    }
  };

  const parseItinerary = (text) => {
    const parts = text.split(/(?=\n(?:#{1,3}\s*)?Day\s+\d+[\s:\-])/i);
    let intro = '';
    let days = [];
    if (!parts[0].match(/^\s*(?:#{1,3}\s*)?Day\s+\d+/i)) {
      intro = parts.shift();
    }
    days = parts.filter(s => s.trim().length > 0);
    return { intro, days };
  };

  const parsed = itinerary ? parseItinerary(itinerary) : null;

  /* ── SPLASH ─────────────────────────────────────────────── */
  if (showSplash) return (
    <div className="splash">
      <div className="splash-box">
        <div className="splash-emoji">✈️</div>
        <h1 className="splash-heading">
          TravelBuddy <span className="text-green">AI</span>
        </h1>
        <p className="splash-sub">
          Your personal, intelligent travel companion.<br />
          Let AI craft your perfect itinerary within your budget.
        </p>
        <button className="btn-primary btn-large" onClick={() => setShowSplash(false)}>
          Start Your Journey ✈️
        </button>
      </div>
    </div>
  );

  /* ── MAIN APP ────────────────────────────────────────────── */
  return (
    <div className="app-shell" ref={topRef}>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-inner">
          <span className="nav-logo">
            TravelBuddy <span className="text-green">AI</span>
          </span>
          {itinerary && (
            <button
              className="btn-primary btn-sm"
              onClick={() => { setItinerary(null); setError(''); }}
            >
              ＋ New Trip
            </button>
          )}
        </div>
      </nav>

      {/* ── FORM PAGE ──────────────────────────────────────── */}
      {!itinerary && (
        <main className="form-page">
          <div className="form-hero">
            <h1 className="hero-h1">Plan your next adventure.</h1>
            <p className="hero-p">
              Tell us where you want to go — our AI builds a detailed
              day-by-day itinerary, strictly within your budget.
            </p>
          </div>

          <div className="form-box">
            <form onSubmit={handleSubmit}>
              <div className="field">
                <label>Destination</label>
                <input
                  type="text"
                  placeholder="e.g. Goa, Paris, Bangkok"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  required
                />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Days</label>
                  <input
                    type="number"
                    min="1" max="30"
                    value={days}
                    onChange={e => setDays(e.target.value)}
                    required
                  />
                </div>
                <div className="field">
                  <label>Budget (₹)</label>
                  <input
                    type="number"
                    min="500"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="submit-btn-wrap">
                <button
                  type="submit"
                  className="btn-primary btn-full"
                  disabled={loading}
                >
                  {loading ? '⏳ Crafting your itinerary...' : '✨ Plan My Adventure'}
                </button>
              </div>
            </form>

            {error && <div className="error-msg">{error}</div>}
          </div>
        </main>
      )}

      {/* ── ITINERARY PAGE ─────────────────────────────────── */}
      {itinerary && parsed && (
        <main className="itin-page">

          {/* Banner */}
          <div className="itin-banner">
            <h1>✨ Your Epic Journey</h1>
            <p>
              {destination} &nbsp;·&nbsp; {days} Days &nbsp;·&nbsp;
              ₹{Number(budget).toLocaleString('en-IN')} Budget
            </p>
          </div>

          {/* Intro / Weather */}
          {parsed.intro && (
            <div className="itin-intro">
              <div className="md">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                  {parsed.intro}
                </ReactMarkdown>
              </div>
            </div>
          )}

          {/* Day Tabs — sticky */}
          {parsed.days.length > 0 && (
            <>
              <div className="tabs-sticky">
                <div className="tabs-inner">
                  {parsed.days.map((_, i) => (
                    <button
                      key={i}
                      className={`tab-btn ${activeDay === i ? 'active' : ''}`}
                      onClick={() => setActiveDay(i)}
                    >
                      Day {i + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Day Content */}
              <div className="day-wrap" ref={contentRef}>
                <div className="day-inner">
                  <div className="md">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                      {parsed.days[activeDay]}
                    </ReactMarkdown>
                  </div>

                  {/* Prev / Next */}
                  <div className="day-nav">
                    <span className="day-nav-label">
                      Day {activeDay + 1} of {parsed.days.length}
                    </span>
                    <button
                      className="btn-ghost"
                      disabled={activeDay === 0}
                      onClick={() => setActiveDay(activeDay - 1)}
                    >
                      ← Prev
                    </button>
                    <button
                      className="btn-ghost"
                      disabled={activeDay === parsed.days.length - 1}
                      onClick={() => setActiveDay(activeDay + 1)}
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      )}

      <footer className="footer">
        © 2026 TravelBuddy AI · Built with ❤️ and AI
      </footer>
    </div>
  );
}

export default App;
