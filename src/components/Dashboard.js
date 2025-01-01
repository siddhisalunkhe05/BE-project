import React, { useState, useEffect } from 'react';
import { Search, Moon, Settings, User, Mail, Phone, Linkedin, MapPin, Briefcase,Code } from 'lucide-react';

const Dashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [experienceSearchQuery, setExperienceSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [skillSearchQuery, setSkillSearchQuery] = useState('');

  useEffect(() => {
    // Automatically import all JSON files from the data directory
    const importAllCandidates = async () => {
      // This uses webpack's require.context to get all JSON files in the data directory
      const context = require.context('../data', false, /\.json$/);
      
      try {
        // Get all the file names (keys) that match our pattern
        const files = context.keys();
        
        // Load all candidate data files and process them
        const candidateDataPromises = files.map(async (filename) => {
          const candidateData = await context(filename);
          return processCandidateData(candidateData);
        });

        // Wait for all files to load
        const allCandidates = await Promise.all(candidateDataPromises);
        
        // Sort candidates by matching score
        const sortedCandidates = allCandidates.sort((a, b) => b.match - a.match);
        
        setCandidates(sortedCandidates);
        setSelectedCandidate(sortedCandidates[0]);
      } catch (error) {
        console.error('Error loading candidate data:', error);
        setCandidates([]);
      }
    };

    importAllCandidates();
  }, []);

  // Process raw candidate data into consistent format
  const processCandidateData = (data) => ({
    id: data.id || Math.random().toString(36).substr(2, 9),
    name: data.candidate_name,
    match: data.matching_score,
    skillMatch: data.skill_match,
    skills: data.skills || [],
    experienceMatch: data.experience_match,
    location: data.location,
    totalExperience: data.total_experience,
    cultureFit: data.culture_fit,
    currentRole: data.current_role,
    summary: data.summary,
    employedStatus: data.employed_status === "True",
    recentRoles: data.recent_roles,
    contactInfo: data.contact_info || {},
    resumeInsights: data.resume_insights || {}
  });

  // Filter candidates based on experience and location
  const filteredCandidates = candidates.filter(candidate => {
    const meetsExperienceRequirement = experienceSearchQuery === '' || 
      (parseFloat(candidate.totalExperience) >= parseFloat(experienceSearchQuery));
    const meetsLocationRequirement = candidate.location.toLowerCase().includes(locationSearchQuery.toLowerCase());
    const meetsSkillRequirement = skillSearchQuery === '' ||
      candidate.skills.some(skill => skill.toLowerCase().includes(skillSearchQuery.toLowerCase()));
    return meetsExperienceRequirement && meetsLocationRequirement && meetsSkillRequirement;
  });

  const EmploymentStatus = ({ status }) => (
    <div className="flex flex-col items-end">
      <div className="text-xs text-gray-600 mb-1">Employment Status</div>
      <div className="flex items-center">
        <div className={`w-2 h-2 rounded-full mr-1.5 ${status ? 'bg-green-500' : 'bg-red-500'}`} />
        <span className={`text-sm ${status ? 'text-green-700' : 'text-red-700'}`}>
          {status ? 'Employed' : 'Not Employed'}
        </span>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-100 h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-white px-3 py-1 shadow-sm">
  <h1 className="text-base font-bold text-gray-800">Dashboard</h1>
  <div className="flex items-center justify-center w-full space-x-2"> {/* Center alignment */}
    <div className="relative">
      <Briefcase className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="number"
        placeholder="Min. years of experience"
        className="bg-white rounded-full py-1 pl-8 pr-2 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300 text-sm"
        value={experienceSearchQuery}
        onChange={(e) => setExperienceSearchQuery(e.target.value)}
        min="0"
        step="0.1"
      />
    </div>
    <div className="relative">
      <MapPin className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search by location..."
        className="bg-white rounded-full py-1 pl-8 pr-2 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300 text-sm"
        value={locationSearchQuery}
        onChange={(e) => setLocationSearchQuery(e.target.value)}
      />
    </div>
    <div className="relative">
      <Code className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <input
        type="text"
        placeholder="Search by skill..."
        className="bg-white rounded-full py-1 pl-8 pr-2 w-48 focus:outline-none focus:ring-1 focus:ring-blue-500 border border-gray-300 text-sm"
        value={skillSearchQuery}
        onChange={(e) => setSkillSearchQuery(e.target.value)}
      />
    </div>
  </div>
  <div className="flex items-center space-x-2">
    <button className="h-7 w-7 flex items-center justify-center rounded-full hover:bg-gray-200">
      <User className="h-4 w-4" />
    </button>
  </div>
</header>


      <div className="flex-grow grid grid-cols-12 gap-2 p-2">
        {/* Top Candidates */}
        <div className="col-span-3 bg-white rounded-lg shadow p-3">
          <h2 className="text-sm font-semibold mb-2">Top Candidates</h2>
          <div className="space-y-1 max-h-[calc(100vh-130px)] overflow-y-auto">
            {filteredCandidates.map(candidate => (
              <div 
                key={candidate.id}
                className={`rounded transition-colors duration-150 ${
                  selectedCandidate?.id === candidate.id ? 'bg-blue-100' : 'hover:bg-gray-50'
                }`}
              >
                <button
                  className="w-full text-left py-2 px-3 text-sm rounded-md flex justify-between items-center"
                  onClick={() => setSelectedCandidate(candidate)}
                >
                  <span>{candidate.name}</span>
                  <span className={`px-2 rounded ${
                    selectedCandidate?.id === candidate.id ? 'bg-blue-200 text-blue-800' : 'bg-gray-200 text-gray-800'
                  }`}>
                    {candidate.match.toFixed(1)}%
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-9 grid grid-cols-2 gap-2">
          {/* Candidate Profile */}
          <div className="bg-white rounded-lg shadow p-3">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-sm font-semibold">Candidate Profile</h2>
              {selectedCandidate && <EmploymentStatus status={selectedCandidate.employedStatus} />}
            </div>
            {selectedCandidate && (
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xl text-gray-600 font-semibold">
                      {selectedCandidate.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{selectedCandidate.name}</h3>
                    <span className="text-sm text-gray-600">{selectedCandidate.currentRole}</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedCandidate.summary}</p>
                </div>
              </div>
            )}
          </div>

          {/* Candidate Overview */}
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="text-sm font-semibold mb-2">Candidate Overview</h2>
            {selectedCandidate && (
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="text-sm font-medium text-gray-600">Overall Match</h3>
                  <span className="text-xl font-bold text-blue-600">{selectedCandidate.match.toFixed(1)}%</span>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="text-sm font-medium text-gray-600">Skill Match</h3>
                  <span className="text-xl font-bold text-green-600">{selectedCandidate.skillMatch}%</span>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="text-sm font-medium text-gray-600">Experience Match</h3>
                  <span className="text-xl font-bold text-blue-600">{selectedCandidate.experienceMatch}%</span>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="text-sm font-medium text-gray-600">Culture Fit</h3>
                  <span className="text-xl font-bold text-purple-600">{selectedCandidate.cultureFit}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Experience */}
          <div className="col-span-2 bg-white rounded-lg shadow p-3">
            <h2 className="text-sm font-semibold mb-2">Experience</h2>
            <div className="grid grid-cols-3 gap-2">
              {selectedCandidate?.recentRoles.map((role, index) => (
                <div key={index} className="bg-gray-50 rounded p-2">
                  <h3 className="font-medium text-sm">{role.title}</h3>
                  <p className="text-xs text-gray-600">{role.company} - {role.duration}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="text-sm font-semibold mb-2">Contact Info</h2>
            {selectedCandidate?.contactInfo && (
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-2">
                  <p className="flex items-center text-sm">
                    <Mail className="mr-2 text-gray-500" size={16} /> {selectedCandidate.contactInfo.email}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="flex items-center text-sm">
                    <Phone className="mr-2 text-gray-500" size={16} /> {selectedCandidate.contactInfo.phone}
                  </p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <p className="flex items-center text-sm">
                    <Linkedin className="mr-2 text-gray-500" size={16} /> {selectedCandidate.contactInfo.linkedin}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Resume Insights */}
          <div className="bg-white rounded-lg shadow p-3">
            <h2 className="text-sm font-semibold mb-2">Quick Resume Insights</h2>
            {selectedCandidate?.resumeInsights && (
              <div className="space-y-2">
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="font-medium text-sm">Resume Length</h3>
                  <p className="text-sm text-gray-600">{selectedCandidate.resumeInsights.resume_length || 'N/A'}</p>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <h3 className="font-medium text-sm">Key Skills</h3>
                  <p className="text-sm text-gray-600">{selectedCandidate.skills?.join(', ') || 'N/A'}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;