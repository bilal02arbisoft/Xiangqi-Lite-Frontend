import React from 'react';
import PropTypes from 'prop-types';

function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <select 
        name={name} 
        value={value}
        onChange={onChange}
        className={`w-full p-2 border rounded bg-gray-200 ${error ? 'border-red-500' : 'border-gray-300'}`}
      >
        <option value="" disabled>Select an option</option>
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default SelectField;
