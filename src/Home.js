import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X, BarChart, Users, BookOpen, Calculator, Check, ChevronDown, User } from 'lucide-react';
import Card from './Card';
import FileUploadPopup from './FileUploadPopup';
import StructuredJDPopup from './StructuredJDPopup';
import CalculationPopup from './CalculationPopup';

const Home = () => {
  const [activePopup, setActivePopup] = useState(null);
  const navigate = useNavigate();
  const cardsRef = useRef(null);

  const handleStructuredJDSubmit = async (data) => {
    // ... (implementation)
    try {
        const response = await fetch('http://localhost:5000/submit-structured-jd', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
  
        if (response.ok) {
          console.log("Structured JD data saved successfully");
          // You can add a success message or update the UI here
        } else {
          console.error("Failed to save Structured JD data");
          // You can add an error message or update the UI here
        }
      } catch (error) {
        console.error("Error submitting Structured JD data:", error);
        // You can add an error message or update the UI here
      }
  
      setActivePopup(null);
    
  
  };

  const uploadFiles = async (category, files) => {
    // ... (implementation)
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    try {
      const response = await fetch(`http://localhost:5000/upload/${category}`, {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        console.log(`Files uploaded successfully for ${category}`);
        setActivePopup(null); // Close the popup after successful upload
      } else {
        console.error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const startCalculation = () => {
    setActivePopup('calculation');
  };

  const scrollToCards = () => {
    cardsRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="bg-dark text-white min-h-screen">
      {/* First screen: Centered text and bottom button */}
      <div className="h-screen flex flex-col relative">
        {/* Project name */}
        <div className="absolute top-4 left-4 text-xl font-bold text-white">
          skillFusion Extractor
        </div>

        {/* Profile icon */}
        <div className="absolute top-4 right-4">
          <button className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-300">
            <User size={20} />
          </button>
        </div>

        {/* Centered content */}
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          <h1 className="text-5xl font-bold text-center mb-4 text-white">
            Make the Process Easy!
          </h1>
        </div>

        {/* Get Started button */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <button 
            onClick={scrollToCards}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-full hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold flex items-center"
          >
            Get Started
            <ChevronDown className="ml-2 w-5 h-5" />
          </button>
        </div>
      </div>

       
       

      {/* Cards section */}
      <div ref={cardsRef} className="min-h-screen flex items-center justify-center bg-dark px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl w-full">
          <div className="grid grid-cols-3 gap-6">
            {/* First row */}
            <div className="col-span-3 grid grid-cols-3 gap-6">
              <Card
                title="Candidate Profiles"
                description="Upload files containing candidates profiles"
                icon={Users}
                onClick={() => setActivePopup('interviewers')}
                buttonText="Upload"
                bgColor="#000000" // Light color
                buttonColor="#ffffff" // Slightly darker color
              />
              <Card
                title="Job Description"
                description="Upload files containing Job Description"
                icon={Users}
                onClick={() => setActivePopup('candidates')}
                buttonText="Upload"
                bgColor="#000000" // Light color
                buttonColor="#ffffff" // Slightly darker color
              />
              <Card
                title="Structured JD"
                description="Click to add criteria, parameters, and weightage"
                icon={BookOpen}
                onClick={() => setActivePopup('structuredJD')}
                buttonText="Open Form"
                bgColor="#000000"
                buttonColor="#ffffff"
              />
            </div>
            {/* Second row */}
            <div className="col-span-3 grid grid-cols-2 gap-6">
              <Card
                title="Calculate Scores"
                description="Calculate matching scores"
                icon={Calculator}
                onClick={startCalculation}
                buttonText="Calculate"
                bgColor="#000000" // Light color
                buttonColor="#ffffff" // Slightly darker color
              />
              <Card
                title="Dashboard"
                description="View the best interview panels"
                icon={BarChart}
                onClick={() => navigate('/dashboard')}
                buttonText="View"
                bgColor="#000000" // Light color
                buttonColor="#ffffff" // Slightly darker color
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      {activePopup && ['interviewers', 'candidates'].includes(activePopup) && (
        <FileUploadPopup 
          category={activePopup} 
          onClose={() => setActivePopup(null)} 
          uploadFiles={uploadFiles}
        />
      )}
      {activePopup === 'structuredJD' && (
        <StructuredJDPopup
          onClose={() => setActivePopup(null)}
          onSubmit={handleStructuredJDSubmit}
        />
      )}
      {activePopup === 'calculation' && (
        <CalculationPopup 
          onClose={() => setActivePopup(null)} 
        />
      )}  
    </div>
  );
};




export default Home;