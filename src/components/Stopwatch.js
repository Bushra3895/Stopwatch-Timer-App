import { useState, useEffect, useRef } from "react";

const s = {
  label: {
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "0.4rem",
    fontWeight: 500,
  },
  timeDisplay: {
    fontSize: "72px",
    fontWeight: 400,
    color: "#111111",
    letterSpacing: "-3px",
    lineHeight: 1,
    fontVariantNumeric: "tabular-nums",
    marginBottom: "4px",
  },
  timeMsSpan: {
    fontSize: "30px",
    color: "#bbb",
    fontWeight: 400,
    letterSpacing: "-1px",
  },
  divider: {
    height: "1px",
    background: "#ebebeb",
    margin: "1.5rem 0",
  },
  btnRow: {
    display: "flex",
    gap: "10px",
  },
  btn: {
    flex: 1,
    padding: "13px 0",
    border: "1px solid #e0e0e0",
    background: "#fff",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: 500,
    color: "#444",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    transition: "all 0.15s",
  },
  btnStart: {
    background: "#fff",
    border: "1px solid #d0d0d0",
    color: "#111",
    fontWeight: 600,
  },
  lapsBox: {
    marginTop: "1.25rem",
    maxHeight: "160px",
    overflowY: "auto",
    borderTop: "1px solid #ebebeb",
    paddingTop: "10px",
  },
  lapRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 2px",
    fontSize: "13px",
    borderBottom: "1px solid #f5f5f5",
  },
  lapNum: { color: "#bbb" },
  lapTime: { color: "#333", fontVariantNumeric: "tabular-nums" },
};

function pad2(n) {
  return String(Math.floor(n)).padStart(2, "0");
}

function fmt(ms) {
  const t = Math.max(0, ms);
  const cs = Math.floor((t % 1000) / 10);
  const sec = Math.floor(t / 1000) % 60;
  const min = Math.floor(t / 60000) % 60;
  const hr = Math.floor(t / 3600000);
  const main = hr > 0
    ? `${pad2(hr)}:${pad2(min)}:${pad2(sec)}`
    : `${pad2(min)}:${pad2(sec)}`;
  return { main, cs: pad2(cs) };
}

export default function Stopwatch() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const startRef = useRef(0);
  const lastLapRef = useRef(0);
  const tickRef = useRef(null);

  useEffect(() => () => clearInterval(tickRef.current), []);

  const toggle = () => {
    if (!running) {
      startRef.current = Date.now() - elapsed;
      tickRef.current = setInterval(
        () => setElapsed(Date.now() - startRef.current),
        33
      );
      setRunning(true);
    } else {
      clearInterval(tickRef.current);
      setRunning(false);
    }
  };

  const lap = () => {
    if (!running && elapsed === 0) return;
    setLaps((prev) => [elapsed - lastLapRef.current, ...prev]);
    lastLapRef.current = elapsed;
  };

  const reset = () => {
    clearInterval(tickRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
    lastLapRef.current = 0;
  };

  const { main, cs } = fmt(elapsed);

  return (
    <div>
      <p style={s.label}>Elapsed Time</p>
      <div style={s.timeDisplay}>
        {main}<span style={s.timeMsSpan}>.{cs}</span>
      </div>
      <div style={s.divider} />
      <div style={s.btnRow}>
        <button
          style={{ ...s.btn, ...s.btnStart }}
          onClick={toggle}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          {running ? "⏸" : "▶"} {running ? "Pause" : elapsed > 0 ? "Resume" : "Start"}
        </button>
        <button
          style={s.btn}
          onClick={lap}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          🏁 Lap
        </button>
        <button
          style={s.btn}
          onClick={reset}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          ↺ Reset
        </button>
      </div>
      {laps.length > 0 && (
        <div style={s.lapsBox}>
          {laps.map((lapMs, i) => {
            const { main: lm, cs: lcs } = fmt(lapMs);
            return (
              <div key={i} style={s.lapRow}>
                <span style={s.lapNum}>Lap {laps.length - i}</span>
                <span style={s.lapTime}>{lm}.{lcs}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}