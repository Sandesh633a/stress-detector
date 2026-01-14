function StatCard({ title, value }) {
  return (
    <div style={{
      background: "#ffffff",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      minWidth: 200
    }}>
      <p style={{ color: "#6b7280", marginBottom: 8 }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}

export default StatCard;
