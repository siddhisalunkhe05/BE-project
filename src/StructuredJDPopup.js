import React, { useState } from 'react';
import { X } from 'lucide-react';

const StructuredJDPopup = ({ onClose, onSubmit }) => {
  const [rows, setRows] = useState([
    { criteria: '', parameter: '', weightage: '' },
    { criteria: '', parameter: '', weightage: '' },
    { criteria: '', parameter: '', weightage: '' },
    { criteria: '', parameter: '', weightage: '' },
  ]);

  const handleInputChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { criteria: '', parameter: '', weightage: '' }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(rows);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Structured JD</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Form inputs and table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-black">Criteria</th>
                  <th className="px-4 py-2 text-left text-black">Parameter</th>
                  <th className="px-4 py-2 text-left text-black">Weightage</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.criteria}
                        onChange={(e) => handleInputChange(index, 'criteria', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-black"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="text"
                        value={row.parameter}
                        onChange={(e) => handleInputChange(index, 'parameter', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-black"
                        required
                      />
                    </td>
                    <td className="px-4 py-2">
                      <input
                        type="number"
                        value={row.weightage}
                        onChange={(e) => handleInputChange(index, 'weightage', e.target.value)}
                        className="w-full border rounded px-2 py-1 text-black"
                        required
                        min="0"
                        max="100"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex justify-between">
            <button
              type="button"
              onClick={addRow}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Row
            </button>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StructuredJDPopup;