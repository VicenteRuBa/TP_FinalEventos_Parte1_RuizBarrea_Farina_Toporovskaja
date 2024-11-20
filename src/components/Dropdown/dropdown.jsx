import React from 'react';
import { styles } from './style';

const Dropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Seleccione una opción',
  required = false,
  label,
  error,
  valueKey = 'id',
  labelKey = 'name',
  ...props
}) => {
  const getSelectStyles = () => {
    return {
      ...styles.select,
      ...(error ? styles.error : {})
    };
  };

  return (
    <div style={styles.selectContainer}>
      
      
      <select
        value={value}
        onChange={onChange}
        required={required}
        style={getSelectStyles()}
        {...props}
      >
        <option value="" disabled style={styles.option}>
          {placeholder}
        </option>
        
        {options.map((option) => (
          <option 
            key={option[valueKey]} 
            value={option[valueKey]}
            style={styles.option}
          >
            {option[labelKey]}
          </option>
        ))}
      </select>
      
      <div style={styles.arrow} />
      
      {error && (
        <div style={styles.errorMessage}>{error}</div>
      )}
    </div>
  );
};

export default Dropdown;