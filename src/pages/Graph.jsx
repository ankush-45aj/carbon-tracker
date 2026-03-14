import Dashboard from "../components/Dashboard";
import Insights from "../components/Insights";

export default function Graph() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#ecfdf5" }}>
      {/* HEADER */}
      <section style={{ padding: "40px", paddingBottom: "0px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "#1f2937" }}>
          All Carbon Graphs
        </h1>
        <p style={{ color: "#555" }}>
          Comprehensive visual analysis of your footprint
        </p>
      </section>

      {/* DASHBOARD GRAPHS */}
      <section style={{ padding: "20px" }}>
        <Dashboard />
      </section>

      {/* INSIGHT GRAPHS */}
      <section style={{ padding: "20px" }}>
        <Insights />
      </section>
    </div>
  );
}