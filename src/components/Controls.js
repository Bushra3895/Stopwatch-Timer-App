import React from "react";

function Controls({ isRunning, onStart, onPause, onReset, onModeChange, isTimer }) {
  return (
    <div className="buttons">
      {!isRunning && <button onClick={onStart}>Start</button>}
      {isRunning && <button onClick={onPause}>Pause</button>}
      <button onClick={onReset}>Reset</button>
      <button onClick={onModeChange}>
        Switch to {isTimer ? "Stopwatch" : "Timer"}
      </button>
    </div>
  );
}

export default Controls;
