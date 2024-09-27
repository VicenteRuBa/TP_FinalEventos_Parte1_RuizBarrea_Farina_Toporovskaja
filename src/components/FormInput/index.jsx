import React from 'react';

function FormInput({ label, type, name, value, onChange, placeholder }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control"
        required
      />
    </div>
  );
}

export default FormInput;
