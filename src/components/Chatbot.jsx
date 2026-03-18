import { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Mic, MicOff, Bot, User } from "lucide-react";

export default function Chatbot({ contextData }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: "ai", text: "Hi there! I'm your Carbon Footprint Assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        // Scroll to bottom on new message
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isOpen]);

    useEffect(() => {
        // Initialize Speech Recognition
        if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript);
                setIsListening(false);
                // We could auto-send here, but let's just populate the input for the user to confirm
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current?.stop();
            setIsListening(false);
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (e) {
                    console.error(e);
                }
            } else {
                alert("Speech recognition is not supported in this browser.");
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { sender: "user", text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const res = await fetch("https://carbon-tracker-d2d8.onrender.com/api/ai/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMessage.text, contextData })
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { sender: "ai", text: data.response }]);
            } else {
                if (res.status === 404) {
                    setMessages(prev => [...prev, { sender: "ai", text: "Backend API not found. Please restart your backend server." }]);
                } else {
                    setMessages(prev => [...prev, { sender: "ai", text: "Sorry, I encountered an error. Please try again later." }]);
                }
            }
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, { sender: "ai", text: "Network error. Make sure the backend server is running." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    style={{
                        position: "fixed",
                        bottom: "30px",
                        right: "30px",
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        backgroundColor: "#10b981",
                        color: "white",
                        border: "none",
                        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        zIndex: 1000,
                        transition: "transform 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                    onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                    <MessageSquare size={28} />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    position: "fixed",
                    bottom: "30px",
                    right: "30px",
                    width: "350px",
                    height: "500px",
                    backgroundColor: "var(--bg-color, white)",
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    display: "flex",
                    flexDirection: "column",
                    zIndex: 1000,
                    border: "1px solid var(--border-color, #e5e7eb)",
                    overflow: "hidden"
                }}>
                    {/* Header */}
                    <div style={{
                        backgroundColor: "#10b981",
                        color: "white",
                        padding: "15px 20px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <Bot size={24} />
                            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>Carbon Assistant</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: "none", border: "none", color: "white", cursor: "pointer", display: "flex" }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div style={{
                        flex: 1,
                        padding: "15px",
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        backgroundColor: "var(--card-bg, #f9fafb)"
                    }}>
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                                    gap: "10px",
                                    alignItems: "flex-end"
                                }}
                            >
                                <div style={{
                                    width: "28px", height: "28px", borderRadius: "50%",
                                    backgroundColor: msg.sender === "user" ? "#3b82f6" : "#10b981",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "white", flexShrink: 0
                                }}>
                                    {msg.sender === "user" ? <User size={16} /> : <Bot size={16} />}
                                </div>

                                <div style={{
                                    maxWidth: "75%",
                                    padding: "10px 14px",
                                    borderRadius: msg.sender === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                                    backgroundColor: msg.sender === "user" ? "#3b82f6" : "var(--bg-color, white)",
                                    color: msg.sender === "user" ? "white" : "var(--text-color, #111827)",
                                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                    fontSize: "14px",
                                    lineHeight: "1.5",
                                    border: msg.sender === "ai" ? "1px solid var(--border-color, #e5e7eb)" : "none"
                                }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", alignSelf: "flex-start", marginLeft: "38px" }}>
                                <div style={{ padding: "10px", backgroundColor: "var(--bg-color, white)", borderRadius: "16px", border: "1px solid var(--border-color)", fontSize: "12px", color: "var(--text-color)", opacity: 0.6 }}>
                                    Thinking...
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{
                        padding: "15px",
                        borderTop: "1px solid var(--border-color, #e5e7eb)",
                        backgroundColor: "var(--bg-color, white)",
                        display: "flex",
                        gap: "10px",
                        alignItems: "center"
                    }}>
                        <button
                            onClick={toggleListen}
                            style={{
                                background: isListening ? "rgba(239, 68, 68, 0.1)" : "var(--card-bg, #f3f4f6)",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                color: isListening ? "#ef4444" : "var(--text-color)",
                                transition: "background 0.2s"
                            }}
                            title={isListening ? "Stop listening" : "Use Voice"}
                        >
                            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                        </button>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleSend()}
                            placeholder="Type your message..."
                            style={{
                                flex: 1,
                                padding: "10px 14px",
                                borderRadius: "20px",
                                border: "1px solid var(--border-color, #d1d5db)",
                                outline: "none",
                                backgroundColor: "var(--card-bg, #f9fafb)",
                                color: "var(--text-color)"
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            style={{
                                background: "#10b981",
                                border: "none",
                                borderRadius: "50%",
                                width: "40px",
                                height: "40px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: (!input.trim() || isLoading) ? "not-allowed" : "pointer",
                                color: "white",
                                opacity: (!input.trim() || isLoading) ? 0.6 : 1
                            }}
                        >
                            <Send size={18} style={{ marginLeft: "2px" }} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}