import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Calculator from "../components/CarbonCalculator";
import Insights from "../components/Insights";
import Tips from "./Tips";

export default function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#ecfdf5" }}>

      {/* HERO */}
      <section style={{ padding: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "32px", marginBottom: "10px" }}>
          Carbon Footprint Tracker
        </h1>
        <p style={{ color: "#555" }}>
          Visualize and track your carbon emissions
        </p>
      </section>

      {/* DASHBOARD */}
      <section style={{ padding: "20px" }}>
        <Dashboard />
      </section>

      {/* CALCULATOR (includes graph + saved records) */}
      <section style={{ padding: "40px", background: "#f9fafb" }}>
        <Calculator />
      </section>

      {/* INSIGHTS */}
      <section style={{ padding: "40px" }}>
        <Insights />
      </section>

      {/* TIPS */}
      <section style={{ padding: "40px", background: "#f1f5f9" }}>
        <Tips />
      </section>

    </div>
  );
}