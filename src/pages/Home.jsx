import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Calculator from "../components/CarbonCalculator";
import Insights from "../components/Insights";
import Tips from "./Tips";
import bgImage from "../assets/carbon-bg.jpg";


export default function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "#ecfdf5" }}>

      {/* HERO */}
      <section
        style={{
          height: "60vh",
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          position: "relative",
          color: "white",
        }}
      >

        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        <div style={{ position: "relative", zIndex: 2 }}>
          <h1 style={{ fontSize: "48px", marginBottom: "10px" }}>
            Carbon Footprint Tracker
          </h1>

          <p style={{ fontSize: "18px" }}>
            Track • Analyze • Reduce your CO₂ emissions
          </p>
        </div>

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