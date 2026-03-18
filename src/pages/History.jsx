import Insights from "../components/Insights";

export default function History() {
    return (
        <div style={{ width: "100%", minHeight: "100vh", backgroundColor: "var(--bg-color)" }}>
            {/* HEADER */}
            <section style={{ padding: "40px", paddingBottom: "0px", textAlign: "center" }}>
                <h1 style={{ fontSize: "32px", marginBottom: "10px", color: "var(--text-color, #1f2937)" }}>
                    Carbon Footprint History
                </h1>
                <p style={{ color: "var(--text-color, #555)", opacity: 0.8 }}>
                    Track your progress and reductions over time
                </p>
            </section>

            {/* HISTORY INSIGHTS */}
            <section style={{ padding: "20px" }}>
                <Insights />
            </section>
        </div>
    );
}