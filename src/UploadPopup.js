import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const UploadPopup = ({ onClose, category, files }) => {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    let uploadedSize = 0;

    const simulateUpload = () => {
      if (uploadedSize < totalSize) {
        uploadedSize += totalSize / 10;
        const progress = Math.min((uploadedSize / totalSize) * 100, 100);
        setUploadProgress(progress);
        setTimeout(simulateUpload, 500);
      } else {
        setUploadComplete(true);
      }
    };

    simulateUpload();
  }, [files]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Uploading Files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Progress bar and upload status */}
        {/* ... (rest of the component code) ... */}
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-gray-600">
            {uploadComplete ? (
              <span className="flex items-center justify-center">
                Upload Complete <Check className="w-5 h-5 text-green-500 ml-2" />
              </span>
            ) : (
              `Uploading... ${uploadProgress.toFixed(1)}%`
            )}
          </p>
        </div>
        {uploadComplete && (
          <button 
            className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold"
            onClick={onClose}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadPopup;