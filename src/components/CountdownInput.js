import React from "react";

function CountdownInput({ value, onChange }) {
  return (
    <div>
      <input
        type="number"
        min="1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default CountdownInput;
