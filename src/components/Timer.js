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
  timerInputsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    margin: "0.75rem 0 1.5rem",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "5px",
  },
  inputField: {
    width: "64px",
    textAlign: "center",
    fontSize: "20px",
    fontWeight: 500,
    padding: "10px 4px",
    borderRadius: "10px",
    background: "#f7f7f7",
    border: "1px solid #e4e4e4",
    color: "#111",
    outline: "none",
  },
  inputLbl: {
    fontSize: "11px",
    color: "#aaa",
    letterSpacing: "0.05em",
  },
  colon: {
    fontSize: "30px",
    fontWeight: 300,
    color: "#ccc",
    paddingBottom: "18px",
  },
  progressWrap: {
    height: "3px",
    background: "#f0f0f0",
    borderRadius: "99px",
    overflow: "hidden",
    margin: "1rem 0",
  },
  progressBar: {
    height: "100%",
    background: "#888",
    borderRadius: "99px",
    transition: "width 0.1s linear",
  },
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

export default function Timer() {
  const [hrs, setHrs] = useState(0);
  const [mins, setMins] = useState(5);
  const [secs, setSecs] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [running, setRunning] = useState(false);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const startRef = useRef(0);
  const startRemRef = useRef(0);
  const tickRef = useRef(null);

  useEffect(() => () => clearInterval(tickRef.current), []);

  const toggle = () => {
    if (!running) {
      let rem = remaining;
      let tot = total;
      if (!started || done) {
        tot = (hrs * 3600 + mins * 60 + secs) * 1000;
        if (tot === 0) return;
        rem = tot;
        setTotal(tot);
        setRemaining(tot);
        setDone(false);
      }
      startRef.current = Date.now();
      startRemRef.current = rem;
      tickRef.current = setInterval(() => {
        const newRem = Math.max(
          0,
          startRemRef.current - (Date.now() - startRef.current)
        );
        setRemaining(newRem);
        if (newRem === 0) {
          clearInterval(tickRef.current);
          setRunning(false);
          setDone(true);
        }
      }, 33);
      setRunning(true);
      setStarted(true);
    } else {
      clearInterval(tickRef.current);
      setRunning(false);
    }
  };

  const reset = () => {
    clearInterval(tickRef.current);
    setRunning(false);
    setStarted(false);
    setDone(false);
    setRemaining(0);
    setTotal(0);
  };

  const { main, cs } = fmt(remaining);
  const barW = total > 0 ? (remaining / total) * 100 : 100;
  const barColor = done ? "#e05252" : "#888";

  return (
    <div>
      <p style={s.label}>Set Time</p>
      {!started || done ? (
        <div style={s.timerInputsRow}>
          <div style={s.inputGroup}>
            <input type="number" min="0" max="99" value={hrs}
              onChange={(e) => setHrs(Math.max(0, parseInt(e.target.value) || 0))}
              style={s.inputField}
            />
            <span style={s.inputLbl}>HR</span>
          </div>
          <span style={s.colon}>:</span>
          <div style={s.inputGroup}>
            <input type="number" min="0" max="59" value={mins}
              onChange={(e) => setMins(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              style={s.inputField}
            />
            <span style={s.inputLbl}>MIN</span>
          </div>
          <span style={s.colon}>:</span>
          <div style={s.inputGroup}>
            <input type="number" min="0" max="59" value={secs}
              onChange={(e) => setSecs(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
              style={s.inputField}
            />
            <span style={s.inputLbl}>SEC</span>
          </div>
        </div>
      ) : (
        <>
          <div style={s.timeDisplay}>
            {main}<span style={s.timeMsSpan}>.{cs}</span>
          </div>
          <div style={s.progressWrap}>
            <div style={{ ...s.progressBar, width: `${barW}%`, background: barColor }} />
          </div>
        </>
      )}
      <div style={{ ...s.divider, marginTop: started && !done ? "0" : "1.5rem" }} />
      <div style={s.btnRow}>
        <button
          style={{ ...s.btn, ...s.btnStart }}
          onClick={toggle}
          onMouseOver={(e) => (e.currentTarget.style.background = "#f5f5f5")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#fff")}
        >
          {running ? "⏸ Pause" : started && !done ? "▶ Resume" : "▶ Start"}
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
    </div>
  );
}