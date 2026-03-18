import { useState, useEffect } from "react";

const allChallenges = [
    { id: 1, title: "No plastic week", description: "Avoid using single-use plastic for a whole week.", points: 10 },
    { id: 2, title: "Public transport challenge", description: "Use public transport or carpool for your daily commute.", points: 15 },
    { id: 3, title: "Plant a tree challenge", description: "Plant a tree or support a tree-planting initiative.", points: 20 },
];

export default function Challenges() {
    const [completedChallenges, setCompletedChallenges] = useState([]);

    useEffect(() => {
        // Load completed challenges from local storage to persist state
        const saved = JSON.parse(localStorage.getItem("completedChallenges") || "[]");
        setCompletedChallenges(saved);
    }, []);

    const toggleChallenge = (id) => {
        let updated;
        if (completedChallenges.includes(id)) {
            updated = completedChallenges.filter(cId => cId !== id);
        } else {
            updated = [...completedChallenges, id];
        }
        setCompletedChallenges(updated);
        localStorage.setItem("completedChallenges", JSON.stringify(updated));
    };

    const getBadge = () => {
        const count = completedChallenges.length;
        if (count >= 3) return { title: "Planet Saver", icon: "🥇", color: "#fbbf24" }; // Gold
        if (count === 2) return { title: "Green Hero", icon: "🥈", color: "#9ca3af" }; // Silver
        return { title: "Eco Beginner", icon: "🥉", color: "#d97706" }; // Bronze
    };

    const badge = getBadge();
    const progressPercentage = (completedChallenges.length / allChallenges.length) * 100;

    return (
        <div style={{ padding: "40px 20px", maxWidth: "800px", margin: "auto", minHeight: "100vh" }}>
            <h2 style={{ textAlign: "center", marginBottom: "10px", fontSize: "36px", color: "var(--text-color, #1f2937)" }}>
                Eco Challenge System
            </h2>
            <p style={{ textAlign: "center", marginBottom: "40px", color: "var(--text-color, #555)", opacity: 0.8, fontSize: "18px" }}>
                Complete challenges, stay motivated, and unlock badges!
            </p>

            {/* Rewards Section */}
            <div style={{
                background: "var(--card-bg, #fff)",
                padding: "30px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                marginBottom: "40px",
                textAlign: "center",
                border: `3px solid ${badge.color}`
            }}>
                <h3 style={{ fontSize: "24px", marginBottom: "15px", color: "var(--text-color, #1f2937)" }}>Your Current Rank</h3>
                <div style={{ fontSize: "60px", marginBottom: "10px" }}>{badge.icon}</div>
                <div style={{ fontSize: "28px", fontWeight: "bold", color: badge.color }}>{badge.title}</div>

                <div style={{ marginTop: "20px", background: "var(--input-border, #e5e7eb)", borderRadius: "10px", height: "12px", overflow: "hidden" }}>
                    <div style={{
                        width: `${progressPercentage}%`,
                        background: "#10b981",
                        height: "100%",
                        transition: "width 0.5s ease-in-out"
                    }}></div>
                </div>
                <p style={{ marginTop: "10px", color: "var(--text-color, #666)", fontSize: "14px", fontWeight: "bold" }}>
                    {completedChallenges.length} of {allChallenges.length} challenges completed
                </p>
            </div>

            {/* Challenges List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {allChallenges.map(challenge => {
                    const isCompleted = completedChallenges.includes(challenge.id);
                    return (
                        <div key={challenge.id} style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "25px",
                            background: isCompleted ? "rgba(16, 185, 129, 0.1)" : "var(--card-bg, #fff)",
                            borderRadius: "12px",
                            border: isCompleted ? "2px solid #10b981" : "2px solid var(--input-border, #e5e7eb)",
                            transition: "all 0.3s ease"
                        }}>
                            <div>
                                <h4 style={{
                                    fontSize: "20px",
                                    margin: "0 0 8px 0",
                                    color: isCompleted ? "#065f46" : "var(--text-color, #1f2937)",
                                    textDecoration: isCompleted ? "line-through" : "none"
                                }}>
                                    {challenge.title}
                                </h4>
                                <p style={{ margin: 0, color: "var(--text-color, #666)", fontSize: "15px", opacity: 0.9 }}>
                                    {challenge.description}
                                </p>
                            </div>
                            <button
                                onClick={() => toggleChallenge(challenge.id)}
                                style={{
                                    padding: "10px 20px",
                                    background: isCompleted ? "#10b981" : "#3b82f6",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontSize: "16px",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                    minWidth: "130px",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    transition: "background 0.2s"
                                }}
                            >
                                {isCompleted ? "Completed ✓" : "Accept"}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}