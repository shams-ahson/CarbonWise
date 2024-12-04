import React from 'react';
import './FormInput.css';

const TextInput = ({ label, name, value, onChange }) => (
    <div>
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    </div>
  );
  
export default TextInput;