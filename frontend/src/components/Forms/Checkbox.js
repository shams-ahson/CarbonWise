import React from 'react';
import './FormInput.css';

const Checkbox = ({ label, name, values, options, onChange }) => (
    <div>
      <label>{label}</label>
      {options.map((option) => (
        <div key={option}>
          <input
            type="checkbox"
            id={`${name}-${option}`}
            name={name}
            value={option}
            checked={values.includes(option)}
            onChange={(e) => {
              const updatedValues = e.target.checked
                ? [...values, option]
                : values.filter((val) => val !== option);
              onChange({ target: { name, value: updatedValues } });
            }}
            class="checkbox-input"
          />
          <label class="checkbox-label" htmlFor={`${name}-${option}`}>{option}</label>
        </div>
      ))}
    </div>
  );
  
export default Checkbox;