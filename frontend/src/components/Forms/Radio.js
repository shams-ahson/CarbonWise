import React from 'react';
import './FormInput.css';

const Radio = ({ label, name, value, options, onChange }) => (
    <div>
      <label>{label}</label>
      {options.map((option) => (
        <div key={option}>
          <input
            type="radio"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={value === option}
            onChange={onChange}
            class="radio-input"
          />
          <label class="radio-label" htmlFor={`${name}-${option}`}>{option}</label>
        </div>
      ))}
    </div>
  );
  
export default Radio;