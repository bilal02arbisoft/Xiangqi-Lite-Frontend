import React from 'react';

const Button = (props) => {
  const {children, onClick, className} = props;
  return (
    <button 
      onClick={onClick} 
      className={`bg-red-600 text-white py-2 px-4 rounded ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
