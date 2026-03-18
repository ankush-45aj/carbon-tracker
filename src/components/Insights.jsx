import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import { TrendingDown, TrendingUp, CalendarDays } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

export default function Insights() {
  const [records, setRecords] = useState([]);

  // ✅ FIXED API (from old file)
  const fetchRecords = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const url = userId
        ? `https://carbon-tracker-d2d8.onrender.com/api/carbon/${userId}`
        : "https://carbon-tracker-d2d8.onrender.com/api/carbon";

      const res = await fetch(url);
      if (res.ok) {
        let data = await res.json();
        if (Array.isArray(data)) setRecords(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    window.addEventListener("carbonUpdated", fetchRecords);
    return () => window.removeEventListener("carbonUpdated", fetchRecords);
  }, []);

  // --- MONTHLY LOGIC ---
  let sortedRecords = [];
  let monthlyLabels = [];
  let monthlyTotals = [];
  let monthlyDataMap = {};
  let currentMonthTotal = 0;
  let previousMonthTotal = 0;
  let momReduction = 0;

  if (records.length === 0) {
    // Demo mode
    monthlyLabels = ["Jan", "Feb", "Mar"];
    monthlyTotals = [120, 110, 95];
    currentMonthTotal = 95;
    previousMonthTotal = 110;
    momReduction = ((110 - 95) / 110) * 100;

    monthlyLabels.forEach((m, i) => {
      monthlyDataMap[m] = { total: monthlyTotals[i] };
    });
  } else {
    sortedRecords = [...records].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedRecords.forEach(record => {
      const d = new Date(record.date);
      const month = !isNaN(d)
        ? d.toLocaleDateString("en-US", { month: "short" })
        : "Unknown";

      if (!monthlyDataMap[month]) {
        monthlyDataMap[month] = { total: 0 };
      }

      monthlyDataMap[month].total += (record.totalCO2 || Number(record.total) || 0);
    });

    monthlyLabels = Object.keys(monthlyDataMap);
    monthlyTotals = monthlyLabels.map(m => monthlyDataMap[m].total);

    if (monthlyTotals.length >= 2) {
      currentMonthTotal = monthlyTotals[monthlyTotals.length - 1];
      previousMonthTotal = monthlyTotals[monthlyTotals.length - 2];

      if (previousMonthTotal > 0) {
        momReduction =
          ((previousMonthTotal - currentMonthTotal) / previousMonthTotal) * 100;
      }
    }
  }

  const isImproving = momReduction >= 0;

  const barData = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Footprint (kg CO₂)",
        data: monthlyTotals,
        backgroundColor: isImproving
          ? "rgba(16, 185, 129, 0.7)"
          : "rgba(239, 68, 68, 0.7)",
        borderRadius: 6,
      },
    ],
  };

  const latest =
    sortedRecords.length > 0
      ? sortedRecords[sortedRecords.length - 1]
      : null;

  const pieData = {
    labels: ["Transport", "Home Energy", "Flights", "Waste", "Diet"],
    datasets: [
      {
        data: latest
          ? [
            latest.transportCO2 || 0,
            latest.homeEnergyCO2 || 0,
            latest.flightsCO2 || 0,
            latest.wasteCO2 || 0,
            latest.meatCO2 || 0,
          ]
          : [30, 40, 0, 10, 20],
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
    <section style={{ padding: "60px 20px" }}>
      <h2 style={{ textAlign: "center", fontSize: "32px" }}>
        Your Carbon Insights
      </h2>

      <p style={{ textAlign: "center", marginBottom: "40px", opacity: 0.8 }}>
        {records.length === 0
          ? "Example demo history (Start calculating to see your real data!)"
          : "Discover patterns and opportunities to reduce your impact"}
      </p>

      {/* SUMMARY */}
      {monthlyLabels.length > 0 && (
        <div style={summaryCard}>
          <div style={summaryFlex}>
            <div>
              <div style={{ display: "flex", gap: "10px" }}>
                <CalendarDays size={24} color="#3b82f6" />
                <h3>Monthly History</h3>
              </div>

              {monthlyLabels.slice(-4).map((m, i) => (
                <div key={i} style={monthItem}>
                  <span>{m}</span>
                  <span>{monthlyDataMap[m]?.total?.toFixed(1)} kg</span>
                </div>
              ))}
            </div>

            <div style={improveCard(isImproving)}>
              {monthlyLabels.length >= 2 ? (
                <>
                  <div style={improveText(isImproving)}>
                    {isImproving ? <TrendingDown /> : <TrendingUp />}
                    {Math.abs(momReduction).toFixed(1)}%
                  </div>
                  <p>
                    {isImproving
                      ? "Great work! Reduced footprint 🎉"
                      : "Increase detected ⚠️"}
                  </p>
                </>
              ) : (
                <p>Need more data</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CHARTS */}
      <div style={grid}>
        <div style={cardStyle}>
          <h3>Monthly Comparison</h3>
          <Bar data={barData} />
        </div>

        <div style={cardStyle}>
          <h3>Category Distribution</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </section>
  );
}

// --- STYLES ---
const grid = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: "30px",
};

const cardStyle = {
  background: "#fff",
  padding: "25px",
  borderRadius: "14px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
};

const summaryCard = {
  marginBottom: "40px",
  padding: "30px",
  borderRadius: "16px",
  background: "#fff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
};

const summaryFlex = {
  display: "flex",
  justifyContent: "space-between",
  flexWrap: "wrap",
  gap: "20px",
};

const monthItem = {
  display: "flex",
  justifyContent: "space-between",
  padding: "10px",
  background: "#f8fafc",
  borderRadius: "8px",
  marginTop: "8px",
};

const improveCard = (good) => ({
  padding: "20px",
  borderRadius: "12px",
  background: good ? "#ecfdf5" : "#fef2f2",
});

const improveText = (good) => ({
  fontSize: "28px",
  fontWeight: "bold",
  color: good ? "#10b981" : "#ef4444",
});