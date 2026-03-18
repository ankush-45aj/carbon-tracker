import Navbar from "../components/Navbar";
import Dashboard from "../components/Dashboard";
import Calculator from "../components/CarbonCalculator";
import Insights from "../components/Insights";
import Tips from "./Tips";

export default function Home() {
  return (
    <div style={{ width: "100%", minHeight: "100vh" }}>

      {/* NAVBAR */}
      {/* <Navbar /> */}

      {/* HERO (✅ your Unsplash image preserved) */}
      <div
        style={{
          textAlign: "center",
          padding: "120px 20px",
          backgroundImage:
            "linear-gradient(rgba(0, 50, 20, 0.4), rgba(0, 20, 10, 0.7)), url('https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2000&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          marginBottom: "40px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            fontSize: "3.8rem",
            color: "#ffffff",
            marginBottom: "20px",
            fontWeight: "800",
            textShadow: "0 4px 10px rgba(0,0,0,0.6)",
          }}
        >
          Track. Reduce. Inspire.
        </h1>

        <p
          style={{
            fontSize: "1.3rem",
            color: "#f3f4f6",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Visualize and track your carbon emissions beautifully.
          Simple steps today shape a sustainable tomorrow.
        </p>
      </div>

      {/* MAIN */}
      <main style={{ width: "100%", padding: "20px" }}>

        {/* DASHBOARD */}
        <section style={{ marginBottom: "40px" }}>
          <Dashboard />
        </section>

        {/* CALCULATOR */}
        <section style={{ marginBottom: "40px" }}>
          <Calculator />
        </section>

        {/* INSIGHTS (🔥 added upgrade) */}
        <section style={{ marginBottom: "40px" }}>
          <Insights />
        </section>

      </main>

      {/* TIPS */}
      <section>
        <Tips />
      </section>

    </div>
  );
}