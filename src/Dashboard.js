import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const topInterviewers = [
    { id: 1, name: "Amit Kumar", expertise: "Artificial Intelligence", score: 89 },
    { id: 2, name: "Priya Singh", expertise: "Data Science", score: 92 },
    { id: 3, name: "Rajesh Gupta", expertise: "Machine Learning", score: 97 },
    { id: 4, name: "Sneha Patel", expertise: "Data Science", score: 95 },
    { id: 5, name: "Vikram Mehta", expertise: "Computer Engineering", score: 87 },
  ];

  return (
    <div className="min-h-screen bg-dark text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <button 
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
          >
            Back to Home
          </button>
        </div>
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h2 className="text-xl font-semibold text-white">Top Candidates</h2>
          </div>
          <ul className="divide-y divide-gray-700">
            {topInterviewers.map((interviewer) => (
              <li key={interviewer.id} className="px-6 py-4 hover:bg-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{interviewer.name}</h3>
                    <p className="text-gray-400">{interviewer.expertise}</p>
                  </div>
                  <div className="bg-green-800 text-green-200 py-1 px-3 rounded-full text-sm font-semibold">
                    Score: {interviewer.score}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;