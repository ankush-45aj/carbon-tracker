import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState({
    recentTotal: 0,
    recentTransport: 0,
    recentHome: 0,
    recentFlights: 0,
    recentWaste: 0,
    recentMeat: 0,
    historyTotals: [],
    historyDates: [],
  });

  const fetchRecords = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const url = userId
        ? `http://localhost:5000/api/carbon/${userId}`
        : "http://localhost:5000/api/carbon";

      const res = await fetch(url);
      if (res.ok) {
        const records = await res.json();
        if (records.length > 0) {
          const latest = records[records.length - 1];
          const last6 = records.slice(-6);

          setData({
            recentTotal: latest.totalCO2 || latest.total || 0,
            recentTransport: latest.transportCO2 || 0,
            recentHome: latest.homeEnergyCO2 || 0,
            recentFlights: latest.flightsCO2 || 0,
            recentWaste: latest.wasteCO2 || 0,
            recentMeat: latest.meatCO2 || 0,
            historyTotals: last6.map(r => r.totalCO2 || r.total || 0),
            historyDates: last6.map(r => r.date ? r.date.split(',')[0] : '')
          });
        } else {
          // Clear it out when emptied
          setData({
            recentTotal: 0,
            recentTransport: 0,
            recentHome: 0,
            recentFlights: 0,
            recentWaste: 0,
            recentMeat: 0,
            historyTotals: [],
            historyDates: [],
          });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();

    // Listen to custom event from calculator
    window.addEventListener('carbonUpdated', fetchRecords);
    return () => window.removeEventListener('carbonUpdated', fetchRecords);
  }, []);

  if (data.historyTotals.length === 0 && !data.recentTotal) {
    return null;
  }

  const lineChartUrl = `https://quickchart.io/chart?c={type:'line',data:{labels:${JSON.stringify(data.historyDates.length ? data.historyDates : ['No Data'])},datasets:[{label:'Total Footprint',data:[${data.historyTotals.length ? data.historyTotals.join(',') : '0'}]}]}}`;

  const barChartUrl = `https://quickchart.io/chart?c={type:'bar',data:{labels:['Transport','Home','Flights','Waste','Diet'],datasets:[{label:'Emissions',data:[${data.recentTransport},${data.recentHome},${data.recentFlights},${data.recentWaste},${data.recentMeat}]}]}}`;

  const pieChartUrl = `https://quickchart.io/chart?c={type:'doughnut',data:{labels:['Transport','Home','Flights','Waste','Diet'],datasets:[{label:'Categories',data:[${data.recentTransport},${data.recentHome},${data.recentFlights},${data.recentWaste},${data.recentMeat}]}]}}`;

  return (
    <section id="dashboard" style={{ padding: "40px 20px", background: "#fff" }}>
      <h2 style={{ textAlign: "center", fontSize: "32px" }}>
        Your Carbon Dashboard
      </h2>
      <p style={{ textAlign: "center", color: "#666", marginBottom: "40px" }}>
        Visualize your carbon emissions across different categories
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "30px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        {/* CARD 1 */}
        <div style={cardStyle}>
          <h4>Total Carbon Footprint</h4>
          <h2>{Number(data.recentTotal).toFixed(2)} kg CO₂</h2>
          <img
            src={lineChartUrl}
            alt="graph"
            width="100%"
          />
        </div>

        {/* CARD 2 */}
        <div style={cardStyle}>
          <h4>Emission by Category</h4>
          <img
            src={barChartUrl}
            alt="graph"
            width="100%"
          />
        </div>

        {/* CARD 3 */}
        <div style={cardStyle}>
          <h4>Emission Breakdown</h4>
          <img
            src={pieChartUrl}
            alt="graph"
            width="100%"
          />
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  textAlign: "center",
};
