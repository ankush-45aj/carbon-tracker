import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Insights() {
  const [records, setRecords] = useState([]);

  const fetchRecords = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const url = userId
        ? `https://carbon-tracker-d2d8.onrender.com/api/carbon/${userId}`
        : "https://carbon-tracker-d2d8.onrender.com/api/carbon";

      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        setRecords(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    window.addEventListener('carbonUpdated', fetchRecords);
    return () => window.removeEventListener('carbonUpdated', fetchRecords);
  }, []);

  if (records.length === 0) {
    return (
      <section style={{ padding: "60px 20px", background: "#f9fafb", textAlign: "center", minHeight: "50vh" }}>
        <h2 style={{ fontSize: "32px", marginBottom: "20px" }}>Your Carbon Insights</h2>
        <p style={{ color: "#666", fontSize: "18px" }}>No footprint calculations available yet. Head to the calculator to get started!</p>
      </section>
    );
  }

  // Monthly/Recent Breakdown - Map the last 6 records instead of months for simplicity
  const last6 = records.slice(-6);
  const labels = last6.map(r => r.date ? r.date.split(',')[0] : 'Unknown');

  const barData = {
    labels: labels,
    datasets: [
      { label: "Transport", data: last6.map(r => r.transportCO2 || 0), backgroundColor: "#60a5fa" },
      { label: "Home", data: last6.map(r => r.homeEnergyCO2 || 0), backgroundColor: "#fbbf24" },
      { label: "Flights", data: last6.map(r => r.flightsCO2 || 0), backgroundColor: "#f87171" },
      { label: "Waste", data: last6.map(r => r.wasteCO2 || 0), backgroundColor: "#34d399" },
      { label: "Diet", data: last6.map(r => r.meatCO2 || 0), backgroundColor: "#a78bfa" },
    ],
  };

  // Category distribution of the absolute latest record
  const latest = records[records.length - 1];
  const pieData = {
    labels: ["Transport", "Home Energy", "Flights", "Waste", "Diet"],
    datasets: [
      {
        data: [
          latest.transportCO2 || 0,
          latest.homeEnergyCO2 || 0,
          latest.flightsCO2 || 0,
          latest.wasteCO2 || 0,
          latest.meatCO2 || 0
        ],
        backgroundColor: [
          "#60a5fa",
          "#fbbf24",
          "#f87171",
          "#34d399",
          "#a78bfa",
        ],
      },
    ],
  };

  return (
    <section style={{ padding: "60px 20px", background: "#f9fafb" }}>
      <h2 style={{ textAlign: "center", fontSize: "32px" }}>
        Your Carbon Insights
      </h2>

      <p style={{ textAlign: "center", color: "#555", marginBottom: "40px" }}>
        Discover patterns and opportunities to reduce your impact
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "30px",
          maxWidth: "1200px",
          margin: "auto",
        }}
      >
        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px" }}>Recent History Breakdown</h3>
          <Bar data={barData} />
        </div>

        <div style={cardStyle}>
          <h3 style={{ marginBottom: "20px" }}>Latest Category Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </section>
  );
}

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};
