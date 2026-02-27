import { useState, useEffect } from 'react';
import Head from 'next/head';

const StatusDot = ({ status }) => (
  <span
    style={{
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: status === 'connected' ? '#22C55E' : status === 'error' ? '#EF4444' : '#64748B',
      display: 'inline-block',
      boxShadow: status === 'connected' ? '0 0 8px #22C55E' : 'none',
    }}
  />
);

const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const ServerIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
    <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
    <line x1="6" y1="6" x2="6.01" y2="6" />
    <line x1="6" y1="18" x2="6.01" y2="18" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

export default function Home() {
  const [message, setMessage] = useState('...');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [apiStatus, setApiStatus] = useState(null);
  const [envInfo, setEnvInfo] = useState(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message);
        setApiStatus('connected');
        setEnvInfo({
          nodeEnv: data.environment,
          docker: data.docker,
          time: new Date().toLocaleString('zh-CN'),
        });
      })
      .catch(() => setApiStatus('error'));
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await fetch('/api/items');
    const data = await res.json();
    setItems(data.items);
  };

  const addItem = async () => {
    if (!newItem.trim() || adding) return;
    setAdding(true);
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });
    setNewItem('');
    await fetchItems();
    setAdding(false);
  };

  const deleteItem = async (id) => {
    await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <>
      <Head>
        <title>Next.js + Docker Dashboard</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* Navbar */}
        <nav className="navbar">
          <div className="nav-inner">
            <div className="nav-brand">
              <span className="logo-icon">
                <ServerIcon />
              </span>
              <span className="logo-text">DevOps<span className="logo-accent">Panel</span></span>
            </div>
            <div className="nav-status">
              <StatusDot status={apiStatus} />
              <span className="nav-status-text">
                {apiStatus === 'connected' ? 'System Online' : apiStatus === 'error' ? 'Offline' : 'Connecting...'}
              </span>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="main">
          {/* Header */}
          <div className="page-header">
            <h1 className="page-title">API Dashboard</h1>
            <p className="page-version">v1.1.0</p>
          </div>

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Status</div>
              <div className="stat-value stat-online">
                <StatusDot status={apiStatus} />
                {apiStatus === 'connected' ? 'Online' : 'Offline'}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Endpoints</div>
              <div className="stat-value">2</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Items</div>
              <div className="stat-value">{items.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Environment</div>
              <div className="stat-value">{envInfo?.docker ? 'Docker' : 'Local'}</div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid-2col">
            {/* API Health */}
            <section className="card">
              <div className="card-header">
                <ActivityIcon />
                <h2>API Health Check</h2>
              </div>
              <div className="card-body">
                <div className="api-endpoint">
                  <div className="endpoint-row">
                    <span className="method-badge">GET</span>
                    <code className="endpoint-path">/api/hello</code>
                    <span className={`status-badge ${apiStatus === 'connected' ? 'ok' : 'fail'}`}>
                      {apiStatus === 'connected' ? '200 OK' : 'ERR'}
                    </span>
                  </div>
                  <div className="response-box">
                    <span className="response-label">Response</span>
                    <code className="response-body">{message}</code>
                  </div>
                </div>

                <div className="api-endpoint">
                  <div className="endpoint-row">
                    <span className="method-badge post">POST</span>
                    <code className="endpoint-path">/api/items</code>
                    <span className={`status-badge ${apiStatus === 'connected' ? 'ok' : 'fail'}`}>
                      {apiStatus === 'connected' ? '201 OK' : 'ERR'}
                    </span>
                  </div>
                </div>

                <div className="api-endpoint">
                  <div className="endpoint-row">
                    <span className="method-badge delete">DELETE</span>
                    <code className="endpoint-path">/api/items?id=&#123;id&#125;</code>
                    <span className={`status-badge ${apiStatus === 'connected' ? 'ok' : 'fail'}`}>
                      {apiStatus === 'connected' ? '200 OK' : 'ERR'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Environment Info */}
            <section className="card">
              <div className="card-header">
                <InfoIcon />
                <h2>Environment</h2>
              </div>
              <div className="card-body">
                {envInfo ? (
                  <div className="env-list">
                    <div className="env-row">
                      <span className="env-key">NODE_ENV</span>
                      <span className="env-val">{envInfo.nodeEnv}</span>
                    </div>
                    <div className="env-row">
                      <span className="env-key">RUNTIME</span>
                      <span className={`env-val ${envInfo.docker ? 'docker' : ''}`}>
                        {envInfo.docker ? 'Docker Container' : 'Local Machine'}
                      </span>
                    </div>
                    <div className="env-row">
                      <span className="env-key">FRAMEWORK</span>
                      <span className="env-val">Next.js 14</span>
                    </div>
                    <div className="env-row">
                      <span className="env-key">CHECKED_AT</span>
                      <span className="env-val">{envInfo.time}</span>
                    </div>
                  </div>
                ) : (
                  <div className="loading-placeholder">
                    <div className="skeleton" />
                    <div className="skeleton short" />
                    <div className="skeleton" />
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* CRUD Section */}
          <section className="card full-width">
            <div className="card-header">
              <ChevronIcon />
              <h2>CRUD Testing</h2>
              <span className="item-count">{items.length} items</span>
            </div>
            <div className="card-body">
              <div className="input-row">
                <input
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addItem()}
                  placeholder="Enter item name..."
                  className="text-input"
                  disabled={adding}
                />
                <button onClick={addItem} className="btn-primary" disabled={adding}>
                  <PlusIcon />
                  {adding ? 'Adding...' : 'Add'}
                </button>
              </div>

              <div className="items-container">
                {items.length === 0 ? (
                  <div className="empty-state">
                    <p>No items yet. Add one above to test the API.</p>
                  </div>
                ) : (
                  <ul className="item-list">
                    {items.map((item, i) => (
                      <li key={item.id} className="item-row" style={{ animationDelay: `${i * 50}ms` }}>
                        <div className="item-info">
                          <span className="item-id">#{item.id}</span>
                          <span className="item-name">{item.name}</span>
                        </div>
                        <div className="item-actions">
                          <span className="item-time">{new Date(item.createdAt).toLocaleTimeString()}</span>
                          <button className="btn-delete" onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.name}`}>
                            <TrashIcon />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>

          {/* Footer Hint */}
          <footer className="footer">
            <code className="hint">Edit <span className="file">pages/index.js</span> and save to see hot-reload in action</code>
          </footer>
        </main>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          background: #0F172A;
          color: #F8FAFC;
          font-family: 'Fira Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        code, pre { font-family: 'Fira Code', monospace; }
      `}</style>

      <style jsx>{`
        .app {
          min-height: 100vh;
        }

        /* Navbar */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1E293B;
        }
        .nav-inner {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .logo-icon {
          color: #22C55E;
          display: flex;
        }
        .logo-text {
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.02em;
        }
        .logo-accent { color: #22C55E; }
        .nav-status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.8rem;
          color: #94A3B8;
        }

        /* Main */
        .main {
          max-width: 1100px;
          margin: 0 auto;
          padding: 2rem 1.5rem 3rem;
        }

        /* Page Header */
        .page-header {
          display: flex;
          align-items: baseline;
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .page-title {
          font-size: 1.6rem;
          font-weight: 700;
          letter-spacing: -0.03em;
        }
        .page-version {
          font-family: 'Fira Code', monospace;
          font-size: 0.8rem;
          color: #64748B;
          background: #1E293B;
          padding: 2px 8px;
          border-radius: 4px;
        }

        /* Stats */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        .stat-card {
          background: #1E293B;
          border-radius: 10px;
          padding: 1rem 1.2rem;
          border: 1px solid #334155;
          transition: border-color 0.2s;
        }
        .stat-card:hover {
          border-color: #475569;
        }
        .stat-label {
          font-size: 0.75rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.4rem;
        }
        .stat-value {
          font-family: 'Fira Code', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Grid */
        .grid-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          margin-bottom: 16px;
        }

        /* Card */
        .card {
          background: #1E293B;
          border-radius: 12px;
          border: 1px solid #334155;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .card:hover {
          border-color: #475569;
        }
        .card.full-width {
          grid-column: 1 / -1;
        }
        .card-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid #334155;
          color: #94A3B8;
        }
        .card-header h2 {
          font-size: 0.9rem;
          font-weight: 600;
          color: #E2E8F0;
          flex: 1;
        }
        .item-count {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: #64748B;
          background: #0F172A;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .card-body {
          padding: 1.25rem;
        }

        /* API Health */
        .api-endpoint {
          margin-bottom: 1rem;
        }
        .api-endpoint:last-child { margin-bottom: 0; }
        .endpoint-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .method-badge {
          font-family: 'Fira Code', monospace;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(34, 197, 94, 0.15);
          color: #22C55E;
          letter-spacing: 0.02em;
        }
        .method-badge.post {
          background: rgba(59, 130, 246, 0.15);
          color: #3B82F6;
        }
        .method-badge.delete {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }
        .endpoint-path {
          font-size: 0.85rem;
          color: #CBD5E1;
          flex: 1;
        }
        .status-badge {
          font-family: 'Fira Code', monospace;
          font-size: 0.7rem;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .status-badge.ok {
          background: rgba(34, 197, 94, 0.1);
          color: #22C55E;
        }
        .status-badge.fail {
          background: rgba(239, 68, 68, 0.1);
          color: #EF4444;
        }
        .response-box {
          margin-top: 8px;
          padding: 8px 12px;
          background: #0F172A;
          border-radius: 6px;
          border: 1px solid #334155;
        }
        .response-label {
          font-size: 0.65rem;
          color: #64748B;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: block;
          margin-bottom: 4px;
        }
        .response-body {
          font-size: 0.8rem;
          color: #22C55E;
        }

        /* Environment */
        .env-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .env-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 0;
          border-bottom: 1px solid rgba(51, 65, 85, 0.5);
        }
        .env-row:last-child { border-bottom: none; }
        .env-key {
          font-family: 'Fira Code', monospace;
          font-size: 0.78rem;
          color: #64748B;
        }
        .env-val {
          font-family: 'Fira Code', monospace;
          font-size: 0.82rem;
          color: #E2E8F0;
        }
        .env-val.docker {
          color: #22C55E;
        }

        /* Loading */
        .loading-placeholder {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .skeleton {
          height: 16px;
          background: linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: shimmer 1.5s infinite;
        }
        .skeleton.short { width: 60%; }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* CRUD */
        .input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .text-input {
          flex: 1;
          padding: 0.6rem 1rem;
          background: #0F172A;
          border: 1px solid #334155;
          border-radius: 8px;
          color: #F8FAFC;
          font-family: 'Fira Sans', sans-serif;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .text-input::placeholder { color: #475569; }
        .text-input:focus { border-color: #22C55E; }
        .text-input:disabled { opacity: 0.5; }
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0.6rem 1.2rem;
          background: #22C55E;
          color: #0F172A;
          border: none;
          border-radius: 8px;
          font-family: 'Fira Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, opacity 0.2s;
        }
        .btn-primary:hover { background: #16A34A; }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .items-container { min-height: 60px; }
        .empty-state {
          text-align: center;
          padding: 2rem;
          color: #475569;
          font-size: 0.9rem;
        }
        .item-list {
          list-style: none;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.65rem 0.8rem;
          border-radius: 8px;
          transition: background 0.15s;
          animation: fadeIn 0.25s ease-out both;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .item-row:hover { background: rgba(51, 65, 85, 0.3); }
        .item-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .item-id {
          font-family: 'Fira Code', monospace;
          font-size: 0.75rem;
          color: #64748B;
          min-width: 28px;
        }
        .item-name {
          font-size: 0.9rem;
          color: #E2E8F0;
        }
        .item-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .item-time {
          font-family: 'Fira Code', monospace;
          font-size: 0.72rem;
          color: #475569;
        }
        .btn-delete {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: transparent;
          border: 1px solid transparent;
          border-radius: 6px;
          color: #64748B;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #EF4444;
        }
        .btn-delete:focus-visible {
          outline: 2px solid #22C55E;
          outline-offset: 2px;
        }

        /* Footer */
        .footer {
          text-align: center;
          margin-top: 2.5rem;
        }
        .hint {
          font-size: 0.78rem;
          color: #475569;
          background: #1E293B;
          padding: 6px 16px;
          border-radius: 6px;
          border: 1px solid #334155;
        }
        .file { color: #22C55E; }

        /* Responsive */
        @media (max-width: 768px) {
          .stats-row { grid-template-columns: repeat(2, 1fr); }
          .grid-2col { grid-template-columns: 1fr; }
          .page-title { font-size: 1.3rem; }
        }
        @media (max-width: 480px) {
          .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; }
          .main { padding: 1rem; }
          .nav-inner { padding: 0.75rem 1rem; }
        }
      `}</style>
    </>
  );
}
