import { useState } from "react";
import Stopwatch from "./components/Stopwatch";
import Timer from "./components/Timer";

const s = {
  page: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e4e4e4",
    borderRadius: "20px",
    padding: "2rem 2rem 1.75rem",
    width: "380px",
    textAlign: "center",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
  },
  tabRow: {
    display: "flex",
    background: "#f5f5f5",
    borderRadius: "12px",
    padding: "4px",
    marginBottom: "1.75rem",
    gap: "4px",
  },
  tab: {
    flex: 1,
    padding: "10px 0",
    border: "1px solid transparent",
    background: "transparent",
    borderRadius: "9px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#999",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.2s",
  },
  tabActive: {
    background: "#ffffff",
    border: "1px solid #e0e0e0",
    color: "#111",
  },
};

export default function App() {
  const [mode, setMode] = useState("stopwatch");

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.tabRow}>
          <button
            style={mode === "stopwatch" ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setMode("stopwatch")}
          >
            ▶ Stopwatch
          </button>
          <button
            style={mode === "timer" ? { ...s.tab, ...s.tabActive } : s.tab}
            onClick={() => setMode("timer")}
          >
            ⏱ Timer
          </button>
        </div>
        {mode === "stopwatch" ? <Stopwatch /> : <Timer />}
      </div>
    </div>
  );
}