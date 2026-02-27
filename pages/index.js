import { useState, useEffect } from 'react';

export default function Home() {
  const [message, setMessage] = useState('加载中...');
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [apiStatus, setApiStatus] = useState(null);
  const [envInfo, setEnvInfo] = useState(null);

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
    if (!newItem.trim()) return;
    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItem }),
    });
    setNewItem('');
    fetchItems();
  };

  const deleteItem = async (id) => {
    await fetch(`/api/items?id=${id}`, { method: 'DELETE' });
    fetchItems();
  };

  return (
    <div className="container">
      <header>
        <h1>Next.js + Docker 实时热更新测试v1.2</h1>
        <p className="subtitle">修改代码后保存，页面会自动刷新</p>
      </header>

      <section className="card status-card">
        <h2>API 状态检测</h2>
        <div className={`status ${apiStatus}`}>
          <span className="dot" />
          <span>{apiStatus === 'connected' ? '已连接' : apiStatus === 'error' ? '连接失败' : '检测中...'}</span>
        </div>
        <p className="api-message">
          <code>GET /api/hello</code> → {message}
        </p>
      </section>

      <section className="card">
        <h2>API 接口测试 (CRUD)</h2>
        <div className="input-group">
          <input
            value={newItem}
            onChange={e => setNewItem(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addItem()}
            placeholder="输入新项目名称..."
          />
          <button onClick={addItem}>添加</button>
        </div>
        <ul className="item-list">
          {items.length === 0 && <li className="empty">暂无数据，请添加</li>}
          {items.map(item => (
            <li key={item.id}>
              <span>{item.name}</span>
              <span className="meta">
                {new Date(item.createdAt).toLocaleTimeString()}
                <button className="delete-btn" onClick={() => deleteItem(item.id)}>删除</button>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="card info-card">
        <h2>环境信息</h2>
        {envInfo ? (
          <table>
            <tbody>
              <tr><td>运行环境</td><td>{envInfo.nodeEnv}</td></tr>
              <tr><td>容器内运行</td><td>{envInfo.docker ? '是 🐳' : '否'}</td></tr>
              <tr><td>检测时间</td><td>{envInfo.time}</td></tr>
            </tbody>
          </table>
        ) : (
          <p style={{ color: '#aaa' }}>加载中...</p>
        )}
      </section>

      <footer>
        <p>试试修改 <code>pages/index.js</code> 中的文字，保存后观察页面自动更新</p>
      </footer>

      <style jsx>{`
        .container {
          max-width: 720px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1a1a2e;
        }
        header {
          text-align: center;
          margin-bottom: 2rem;
        }
        h1 {
          font-size: 1.8rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.3rem;
        }
        .subtitle {
          color: #888;
          font-size: 0.95rem;
        }
        .card {
          background: #fff;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.2rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
          border: 1px solid #eef;
        }
        h2 {
          font-size: 1.1rem;
          margin: 0 0 1rem 0;
          color: #333;
        }
        .status {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 500;
          margin-bottom: 0.8rem;
        }
        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #ccc;
        }
        .status.connected .dot { background: #22c55e; }
        .status.error .dot { background: #ef4444; }
        .api-message code {
          background: #f1f5f9;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #6366f1;
        }
        .input-group {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }
        input {
          flex: 1;
          padding: 0.6rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus {
          border-color: #6366f1;
        }
        button {
          padding: 0.6rem 1.2rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          transition: opacity 0.2s;
        }
        button:hover { opacity: 0.85; }
        .item-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .item-list li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.7rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .item-list li:last-child { border-bottom: none; }
        .empty { color: #aaa; text-align: center; padding: 1rem 0; }
        .meta {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.8rem;
          color: #999;
        }
        .delete-btn {
          padding: 3px 10px;
          font-size: 0.8rem;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 4px;
          background-image: none;
        }
        .delete-btn:hover {
          background: #fecaca;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        td {
          padding: 0.5rem 0;
          border-bottom: 1px solid #f1f5f9;
        }
        td:first-child {
          font-weight: 500;
          color: #666;
          width: 120px;
        }
        footer {
          text-align: center;
          margin-top: 2rem;
          color: #999;
          font-size: 0.9rem;
        }
        footer code {
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
          color: #6366f1;
        }
      `}</style>

      <style jsx global>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f8f9fc; min-height: 100vh; }
      `}</style>
    </div>
  );
}
