import React from 'react';

function SelectField({ label, name, options }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <select 
        name={name} 
        className="w-full p-2 border rounded bg-gray-200"
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

export default SelectField;
