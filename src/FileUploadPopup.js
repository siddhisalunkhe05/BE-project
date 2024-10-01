import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import UploadPopup from './UploadPopup';

const FileUploadPopup = ({ category, onClose, uploadFiles }) => {
  const [files, setFiles] = useState([]);
  const [showUploadPopup, setShowUploadPopup] = useState(false);

  const handleFileUpload = (event) => {
    const newFiles = Array.from(event.target.files);
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };

  const handleUpload = async () => {
    setShowUploadPopup(true);
    await uploadFiles(category, files);
    setFiles([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Upload {category} Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* File upload input and selected files list */}
        {/* ... (rest of the component code) ... */}
        <div className="flex items-center justify-center w-full mb-4">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-300">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-blue-500 mb-2" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              multiple
              accept=".pdf"
            />
          </label>
        </div>
        {files.length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2 text-gray-700">Selected files:</h3>
            <ul className="list-disc pl-5 text-gray-600">
              {files.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
        )}
        <button 
        
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 font-semibold"
          onClick={handleUpload}
        >
          Upload Files
        </button>
      </div>
      {showUploadPopup && (
        <UploadPopup 
          onClose={() => {
            setShowUploadPopup(false);
            onClose();
          }} 
          category={category}
          files={files}
        />
      )}
    </div>
  );
};

export default FileUploadPopup;