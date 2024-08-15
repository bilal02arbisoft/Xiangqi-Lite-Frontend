import React from 'react';

function InputField({ label, placeholder, type = 'text', name }) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 mb-2">{label}</label>
      <input 
        type={type} 
        name={name} 
        placeholder={placeholder} 
        className="w-full p-2 border rounded bg-gray-200 placeholder-gray-500"
      />
    </div>
  );
}

export default InputField;
