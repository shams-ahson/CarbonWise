import React from 'react';
import './FormInput.css';

const Counter = ({ label, name, value, onChange }) => (
  <div className="counter">
    <label>{label}</label>
    <div className="counter-input-wrapper">
      <input
        type="number"
        className="counter-input"
        name={name}
        value={value}
        onChange={(e) => onChange({ target: { name, value: Math.max(0, +e.target.value) } })}
      />
    </div>
  </div>
);

export default Counter;
