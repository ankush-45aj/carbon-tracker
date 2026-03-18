import { useEffect, useState } from "react";

export default function Records() {
  const [records, setRecords] = useState([]);

  const BASE_URL = "https://carbon-tracker-d2d8.onrender.com";

  const fetchRecords = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const url = userId
        ? `${BASE_URL}/api/carbon/${userId}`
        : `${BASE_URL}/api/carbon`;

      const res = await fetch(url);

      if (res.ok) {
        const data = await res.json();
        setRecords(data.reverse());
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchRecords();

    window.addEventListener("carbonUpdated", fetchRecords);
    return () =>
      window.removeEventListener("carbonUpdated", fetchRecords);
  }, []);

  const deleteRecord = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/api/carbon/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setRecords(records.filter((r) => r._id !== id));
        window.dispatchEvent(new Event("carbonUpdated"));
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div
      style={{
        padding: "40px 20px",
        maxWidth: "800px",
        margin: "auto",
        minHeight: "100vh",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "30px",
          fontSize: "32px",
          color: "var(--text-color, #1f2937)",
        }}
      >
        Your Saved Footprints
      </h2>

      {records.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px",
            background: "var(--card-bg, #f9fafb)",
            borderRadius: "10px",
          }}
        >
          <p
            style={{
              color: "var(--text-color, #666)",
              fontSize: "18px",
            }}
          >
            No footprint records found.
          </p>

          <a
            href="/calculator"
            style={{
              color: "#10b981",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Head to the calculator to create one!
          </a>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          {records.map((r, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "20px",
                background: "var(--card-bg, #fff)",
                borderRadius: "10px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
                border: "1px solid var(--input-border, #e5e7eb)",
              }}
            >
              <div>
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontWeight: "bold",
                    fontSize: "16px",
                    color: "var(--text-color, #374151)",
                  }}
                >
                  {r.date}
                </p>

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    fontSize: "13px",
                    color: "var(--text-color, #4b5563)",
                    opacity: 0.9,
                  }}
                >
                  <span style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                    🚗 {r.transportCO2?.toFixed(1) || 0} kg
                  </span>
                  <span style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                    🏠 {r.homeEnergyCO2?.toFixed(1) || 0} kg
                  </span>
                  <span style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                    ✈️ {r.flightsCO2?.toFixed(1) || 0} kg
                  </span>
                  <span style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                    ♻️ {r.wasteCO2?.toFixed(1) || 0} kg
                  </span>
                  <span style={{ background: "#f3f4f6", padding: "4px 8px", borderRadius: "4px" }}>
                    🥩 {r.meatCO2?.toFixed(1) || 0} kg
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <strong
                  style={{
                    fontSize: "20px",
                    color: "#10b981",
                    whiteSpace: "nowrap",
                  }}
                >
                  {r.totalCO2?.toFixed(2) || "0"} kg CO₂
                </strong>

                <button
                  onClick={() => deleteRecord(r._id)}
                  style={{
                    padding: "8px 16px",
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}