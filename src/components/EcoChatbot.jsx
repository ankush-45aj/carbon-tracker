import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { PredictionEngine } from '../utils/PredictionEngine';

export default function EcoChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Hello! 🌱 I am your Eco AI Assistant.\n\nYou can ask me:\n• "Next month emission kitna hoga?"\n• "How can I reduce it?"\n\nOr use quick commands:\n/prediction\n/eco tips\n/monthly report' }
    ]);
    const [input, setInput] = useState('');
    const [records, setRecords] = useState([]);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Fetch user records for the engine
        const fetchRecords = async () => {
            try {
                const userId = localStorage.getItem("userId");
                const url = userId ? `https://carbon-tracker-d2d8.onrender.com/api/carbon/${userId}` : "https://carbon-tracker-d2d8.onrender.com/api/carbon";
                const res = await fetch(url);
                if (res.ok) {
                    const data = await res.json();
                    setRecords(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching records for chatbot:", err);
            }
        };
        fetchRecords();

        // Listen for global data updates
        window.addEventListener('carbonUpdated', fetchRecords);
        return () => window.removeEventListener('carbonUpdated', fetchRecords);
    }, []);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

        // Bot thinking simulation
        setTimeout(() => {
            generateResponse(userMsg);
        }, 600);
    };

    const generateResponse = (msg) => {
        const lowerMsg = msg.toLowerCase();
        let botReply = "I'm still learning! Try commands like /prediction, /eco tips, or /monthly report.";

        const stats = PredictionEngine.analyzeData(records);

        // 1️⃣ Carbon Prediction
        if (
            lowerMsg.includes('/prediction') ||
            lowerMsg.includes('next month') ||
            lowerMsg.includes('prediction') ||
            lowerMsg.includes('kitna hoga')
        ) {
            if (records.length === 0) {
                botReply = "I need some data first! Please use the Carbon Calculator so I can predict your future footprint.";
            } else {
                const recentMonths = stats.monthlyTrend.join('\n');

                botReply = `Based on your previous data:\n${recentMonths}\n\n**Prediction:**\nNext month → ${stats.nextMonthPrediction} kg CO₂.`;
            }
        }
        // 2️⃣ Carbon Reduction Advice
        else if (
            lowerMsg.includes('/eco tips') ||
            lowerMsg.includes('how can i reduce') ||
            lowerMsg.includes('tips') ||
            lowerMsg.includes('advice')
        ) {
            botReply = "Here are some top ways to reduce your carbon footprint:\n\n• Use public transport or carpool.\n• Switch to LED bulbs.\n• Reduce meat consumption (try a plant-based meal!).\n• Compost your kitchen waste.\n• Unplug idle devices.";
        }
        // 3️⃣ User Data Insights
        else if (
            lowerMsg.includes('/monthly report') ||
            lowerMsg.includes('insight') ||
            lowerMsg.includes('highest') ||
            lowerMsg.includes('report')
        ) {
            if (records.length === 0) {
                botReply = "No data available yet! Try saving a calculation first.";
            } else {
                botReply = `Your highest emission source is **${stats.highestEmissionSource}** (${stats.highestEmissionPercent}% of your total footprint).\n\nIf you focus on reducing this, you'll see a massive improvement!`;
            }
        }

        setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
    };

    return (
        <>
            {/* Floating Chat Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "60px",
                    height: "60px",
                    borderRadius: "30px",
                    background: "#10b981",
                    color: "white",
                    border: "none",
                    boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 9999,
                    transition: "transform 0.2s"
                }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "100px",
                    right: "30px",
                    width: "350px",
                    height: "480px",
                    background: "var(--card-bg, #fff)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 9999,
                    border: "1px solid var(--input-border, #e5e7eb)",
                    overflow: "hidden"
                }}>
                    {/* Header */}
                    <div style={{ background: "#10b981", padding: "18px", color: "white", display: "flex", alignItems: "center", gap: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", zIndex: 10 }}>
                        <MessageCircle size={22} />
                        <h3 style={{ margin: 0, fontSize: "16px", letterSpacing: "0.5px" }}>Eco AI Assistant</h3>
                    </div>

                    {/* Messages Area */}
                    <div style={{ flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", background: "var(--bg-color, #f9fafb)" }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} style={{
                                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                background: msg.sender === 'user' ? '#10b981' : 'var(--card-bg, #fff)',
                                color: msg.sender === 'user' ? 'white' : 'var(--text-color, #1f2937)',
                                padding: "12px 16px",
                                borderRadius: "14px",
                                borderBottomRightRadius: msg.sender === 'user' ? "4px" : "14px",
                                borderBottomLeftRadius: msg.sender === 'bot' ? "4px" : "14px",
                                maxWidth: "80%",
                                fontSize: "14px",
                                lineHeight: "1.5",
                                whiteSpace: "pre-line",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                                border: msg.sender === 'bot' ? '1px solid var(--input-border, #e5e7eb)' : 'none'
                            }}>
                                {/* Parse basic markdown like **bold** */}
                                {msg.text.split('**').map((part, i) =>
                                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: "14px", background: "var(--card-bg, #fff)", borderTop: "1px solid var(--input-border, #e5e7eb)", display: "flex", gap: "10px" }}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything..."
                            style={{
                                flex: 1,
                                padding: "12px 16px",
                                border: "1px solid var(--input-border, #e5e7eb)",
                                borderRadius: "24px",
                                outline: "none",
                                fontSize: "14px",
                                background: "var(--input-bg, #f3f4f6)",
                                color: "var(--text-color, #1f2937)",
                                transition: "border 0.3s"
                            }}
                        />
                        <button
                            onClick={handleSend}
                            style={{
                                width: "44px",
                                height: "44px",
                                borderRadius: "22px",
                                background: "#3b82f6",
                                color: "white",
                                border: "none",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                                boxShadow: "0 2px 6px rgba(59, 130, 246, 0.4)",
                                transition: "background 0.2s"
                            }}
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}