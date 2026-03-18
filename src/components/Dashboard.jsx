import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Activity, Zap, Car, Home, Flame, Utensils, TrendingDown, TrendingUp, Edit2, Check } from "lucide-react";
import Chatbot from "./Chatbot";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

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
    historyFull: [],
  });

  const [improvement, setImprovement] = useState(0);

  const [target, setTarget] = useState(25);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTarget, setTempTarget] = useState(25);

  useEffect(() => {
    const savedTarget = localStorage.getItem("carbonTarget");
    if (savedTarget) {
      setTarget(Number(savedTarget));
      setTempTarget(Number(savedTarget));
    }
  }, []);

  const saveTarget = () => {
    setTarget(tempTarget);
    localStorage.setItem("carbonTarget", tempTarget);
    setIsEditingTarget(false);
  };


  const fetchRecords = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const url = userId
        ? `https://carbon-tracker-d2d8.onrender.com/api/carbon/${userId}`
        : "https://carbon-tracker-d2d8.onrender.com/api/carbon";

      const res = await fetch(url);
      if (res.ok) {
        const records = await res.json();
        if (!Array.isArray(records)) return;
        if (records.length > 0) {
          const latest = records[records.length - 1];
          const last7 = records.slice(-7);

          let imp = 0;

          if (records.length > 1) {
            const previous = records[records.length - 2];
            const prevTotal = previous.totalCO2 || previous.total || 0;
            const currentTotal = latest.totalCO2 || latest.total || 0;

            if (prevTotal > 0) {
              imp = ((prevTotal - currentTotal) / prevTotal) * 100;
            }
          }

          setData({
            recentTotal: latest.totalCO2 || latest.total || 0,
            recentTransport: latest.transportCO2 || 0,
            recentHome: latest.homeEnergyCO2 || 0,
            recentFlights: latest.flightsCO2 || 0,
            recentWaste: latest.wasteCO2 || 0,
            recentMeat: latest.meatCO2 || 0,

            historyTotals: last7.map((r) => r.totalCO2 || r.total || 0),
            historyDates: last7.map((r) =>
              r.date
                ? new Date(r.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
                : ""
            ),

            historyFull: last7.map((r) => ({
              date: r.date
                ? new Date(r.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
                : "N/A",
              total: r.totalCO2 || r.total || 0,
            })),
          });

          setImprovement(imp);
        } else {

          setData({
            recentTotal: 0,
            recentTransport: 0,
            recentHome: 0,
            recentFlights: 0,
            recentWaste: 0,
            recentMeat: 0,
            historyTotals: [],
            historyDates: [],
            historyFull: [],
          });
          setImprovement(0);
        }
      }
    } catch (err) {
      console.error("Error fetching carbon records:", err);
    }
  };

  useEffect(() => {
    fetchRecords();
    window.addEventListener("carbonUpdated", fetchRecords);
    return () => window.removeEventListener("carbonUpdated", fetchRecords);
  }, []);

  if (data.historyTotals.length === 0 && !data.recentTotal) {
    return (
      <section id="dashboard" className="premium-home-bg" style={{ minHeight: "80vh", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel" style={{ textAlign: "center", maxWidth: "500px" }}>
          <Activity size={48} color="#10b981" style={{ marginBottom: "20px" }} />
          <h2 className="hero-title" style={{ fontSize: "2rem" }}>No Data Yet</h2>
          <p className="hero-subtitle">Start calculating your carbon footprint to see your dashboard come to life!</p>
        </div>
      </section>
    );
  }

  const pieData = [
    { name: "Transport", value: data.recentTransport },
    { name: "Home Energy", value: data.recentHome },
    { name: "Flights", value: data.recentFlights },
    { name: "Waste", value: data.recentWaste },
    { name: "Diet", value: data.recentMeat },
  ].filter(item => item.value > 0); // Only show categories with data

  // Calculate progress relative to the user's custom target
  const percentUsed = target > 0 ? (data.recentTotal / target) * 100 : 0;
  const progressPercent = Math.min(percentUsed, 100);

  // Is the user under or over the goal?
  const isOverGoal = data.recentTotal > target;
  const diffFromGoal = Math.abs(data.recentTotal - target).toFixed(1);
  const percentFromGoal = target > 0 ? ((diffFromGoal / target) * 100).toFixed(1) : 0;

  const displayHistory = data.historyFull.length === 1
    ? [{ date: "Start", total: 0 }, ...data.historyFull]
    : data.historyFull;

  return (
    <section id="dashboard" className="premium-home-bg" style={{ padding: "60px 20px" }}>
      <div style={{ width: "100%", maxWidth: "100%", margin: "0 auto", position: "relative", zIndex: 10 }}>

        {/* Header Section */}
        <div style={{ marginBottom: "40px", textAlign: "center" }}>
          <h2 className="hero-title">Your Carbon Dashboard</h2>
          <p className="hero-subtitle">Track, analyze, and reduce your environmental impact.</p>
        </div>

        {/* Top Overview Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginBottom: "30px",
        }}>
          {/* Main Total Card */}
          <div className="glass-panel" style={{ padding: "30px", display: "flex", flexDirection: "column", justifyContent: "space-between", margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "16px", color: "var(--text-color)", opacity: 0.8, fontWeight: 500 }}>Total Footprint (Latest)</h3>
                <div style={{ fontSize: "3rem", fontWeight: 700, color: "#10b981", lineHeight: 1.2, marginTop: "10px" }}>
                  {Number(data.recentTotal).toFixed(1)} <span style={{ fontSize: "1.2rem", color: "var(--text-color)", opacity: 0.7 }}>kg CO₂</span>
                </div>
              </div>
              <div style={{ background: "rgba(16, 185, 129, 0.1)", padding: "15px", borderRadius: "50%" }}>
                <Activity size={32} color="#10b981" />
              </div>
            </div>

            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{
                display: "flex", alignItems: "center", gap: "4px",
                color: improvement >= 0 ? "#10b981" : "#ef4444",
                fontWeight: 600, background: improvement >= 0 ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                padding: "6px 12px", borderRadius: "20px", fontSize: "14px"
              }}>
                {improvement >= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                {Math.abs(improvement).toFixed(1)}%
              </span>
              <span style={{ fontSize: "14px", opacity: 0.7 }}>vs previous calculation</span>
            </div>
          </div>

          {/* Progress Card */}
          <div className="glass-panel" style={{ padding: "30px", margin: 0 }}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "16px", opacity: 0.8, fontWeight: 500 }}>Sustainability Target</h3>

            <div style={{ marginBottom: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "2rem", fontWeight: 700 }}>Goal</span>
                <span style={{ fontSize: "14px", opacity: 0.7 }}>Track your progress</span>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isEditingTarget ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <input
                      type="number"
                      value={tempTarget}
                      onChange={(e) => setTempTarget(Number(e.target.value))}
                      style={{ width: "80px", padding: "6px 10px", margin: 0, border: "1px solid var(--input-border)", borderRadius: "6px" }}
                      autoFocus
                    />
                    <button
                      onClick={saveTarget}
                      style={{ background: "#10b981", border: "none", color: "white", padding: "8px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                ) : (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: 600 }}>{target} kg CO₂</span>
                    <button
                      onClick={() => setIsEditingTarget(true)}
                      style={{ background: "transparent", border: "none", color: "var(--text-color)", opacity: 0.6, padding: "4px", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Premium Progress Bar */}
            <div style={{ width: "100%", height: "12px", background: "rgba(0,0,0,0.05)", borderRadius: "10px", overflow: "hidden", marginBottom: "10px", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{
                width: `${progressPercent}%`,
                height: "100%",
                background: isOverGoal ? "linear-gradient(90deg, #ef4444, #f87171)" : "linear-gradient(90deg, #10b981, #34d399)",
                borderRadius: "10px",
                transition: "width 1s ease-out, background 0.5s ease"
              }} />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                {percentUsed.toFixed(1)}% of Goal
              </span>
              <span style={{ fontSize: "13px", opacity: 0.8, color: isOverGoal ? "#ef4444" : "#10b981", fontWeight: 500 }}>
                {isOverGoal ? `+${percentFromGoal}% over target` : `-${percentFromGoal}% under target`}
              </span>
            </div>

            <div style={{ display: "flex", gap: "15px", marginTop: "25px" }}>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.5)", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                <Car size={20} color="#3b82f6" style={{ margin: "0 auto 5px auto" }} />
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Transport</div>
                <strong style={{ fontSize: "14px" }}>{Number(data.recentTransport).toFixed(1)} kg</strong>
              </div>
              <div style={{ flex: 1, background: "rgba(255,255,255,0.5)", padding: "12px", borderRadius: "12px", textAlign: "center" }}>
                <Home size={20} color="#f59e0b" style={{ margin: "0 auto 5px auto" }} />
                <div style={{ fontSize: "12px", opacity: 0.8 }}>Home</div>
                <strong style={{ fontSize: "14px" }}>{Number(data.recentHome).toFixed(1)} kg</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "24px",
        }}>
          {/* Trend Chart */}
          <div className="glass-panel" style={{ padding: "30px", margin: 0, gridColumn: "1 / -1", }}>
            <h3 style={{ margin: "0 0 25px 0", fontSize: "18px", fontWeight: 600 }}>Emission Trends (Recent History)</h3>
            <div style={{ width: "100%", height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={displayHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-color)', opacity: 0.6 }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: 'var(--text-color)', opacity: 0.6 }}
                    width={65}
                    tickFormatter={(value) => {
                      if (value >= 1e9) return (value / 1e9).toFixed(1) + 'B';
                      if (value >= 1e6) return (value / 1e6).toFixed(1) + 'M';
                      if (value >= 1e3) return (value / 1e3).toFixed(1) + 'k';
                      return value;
                    }}
                  />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    itemStyle={{ color: '#10b981', fontWeight: 600 }}
                  />
                  <Area type="monotone" dataKey="total" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown Chart */}
          <div className="glass-panel" style={{ padding: "30px", margin: 0, gridColumn: "1 / -1", display: "flex", flexDirection: "column" }}>
            <h3 style={{ margin: "0 0 25px 0", fontSize: "18px", fontWeight: 600 }}>Emissions Breakdown</h3>
            <div style={{ width: "100%", height: "250px", flex: 1 }}>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(value) => `${Number(value).toFixed(1)} kg`}
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '13px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                  Not enough category data
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* AI Chatbot Widget */}
      <Chatbot contextData={data} />
    </section>
  );
}