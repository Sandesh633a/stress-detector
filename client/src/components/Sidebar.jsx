import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{
      width: 220,
      background: "#111827",
      color: "#fff",
      padding: 20
    }}>
      <h2 style={{ marginBottom: 30 }}>🧠 MindSense</h2>

      <nav style={{ display: "flex", flexDirection: "column", gap: 15 }}>
        <Link to="/" style={{ color: "#fff" }}>🏠 Dashboard</Link>
        <Link to="/assistant" style={{ color: "#fff" }}>🎙 Assistant</Link>
        <Link to="/analytics" style={{ color: "#fff" }}>📊 Analytics</Link>
        <Link to="/settings" style={{ color: "#fff" }}>⚙ Settings</Link>
      </nav>
    </div>
  );
}

export default Sidebar;
