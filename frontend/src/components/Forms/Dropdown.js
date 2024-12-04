import React from 'react';
import './FormInput.css';

const Dropdown = ({ label, name, value, options, onChange }) => (
    <div>
      <label>{label}</label>
      <select name={name} value={value} onChange={onChange} >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
  
export default Dropdown;