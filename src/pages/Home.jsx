import Dashboard from "../components/Dashboard";
import Calculator from "../components/CarbonCalculator";
import Insights from "../components/Insights";
import Tips from "./Tips";

export default function Home() {
  return (
    <div className="premium-home-bg">

      <main className="home-section">
        {/* HERO */}
        <div className="hero-header">
          <h1 className="hero-title">
            Track. Reduce. Inspire.
          </h1>
          <p className="hero-subtitle">
            Visualize and track your carbon emissions beautifully. Simple steps today shape a sustainable tomorrow.
          </p>
        </div>

        {/* DASHBOARD */}
        <section className="glass-panel" style={{ marginTop: "40px" }}>
          <Dashboard />
        </section>

        {/* CALCULATOR (includes graph + saved records) */}
        <section className="glass-panel">
          <Calculator />
        </section>

        {/* INSIGHTS */}
        <section className="glass-panel">
          <Insights />
        </section>

        {/* TIPS */}
        <section className="glass-panel">
          <Tips />
        </section>
      </main>

    </div>
  );
}