import React from 'react';

const Card = ({ title, description, icon: Icon, onClick, buttonText, bgColor, buttonColor }) => (
  <div 
    className="p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-700 flex flex-col justify-between h-full"
    style={{ backgroundColor: bgColor }}
  >
    <div>
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full mr-4 bg-gray-700">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
      </div>
      <p className="text-gray-300">{description}</p>
    </div>
    <div className="mt-4">
      <button 
        onClick={onClick}
        className="w-full py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105 text-black font-medium"
        style={{ backgroundColor: buttonColor }}
      >
        {buttonText}
      </button>
    </div>
  </div>
);

export default Card;