import React from 'react';

const Card = ({ title, description, icon: Icon, onClick, buttonText, bgColor, buttonColor }) => (
  <div 
    className="p-6 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border border-gray-70 flex flex-col justify-between h-full"
    style={{ backgroundColor: bgColor }}
  >
    <div>
      <div className="flex items-center mb-4">
        <div className="p-2 rounded-full mr-4 bg-gradient-to-r from-blue-500 to-indigo-600">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-black">{title}</h2>
      </div>
      <p className="text-gray-800">{description}</p>
    </div>
    <div className="mt-4">
      <button 
        onClick={onClick}
        className="w-full py-2 px-4 rounded-lg transition-transform duration-300 text-white transform hover:scale-105 text-black font-medium bg-gradient-to-r from-blue-500 to-indigo-600"
        >
        {buttonText}
      </button>
    </div>
  </div>
);

export default Card;