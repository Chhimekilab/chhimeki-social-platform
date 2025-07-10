import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Users, 
  Star, 
  MapPin, 
  Calendar, 
  DollarSign,
  Building,
  Award,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  ExternalLink,
  Clock,
  Bookmark,
  Send,
  CheckCircle,
  TrendingUp,
  Target,
  Coffee
} from 'lucide-react';

import professionalService from '../../services/professionalService';
import { useAuth } from '../../contexts/AuthContext';

const ProfessionalDashboard = () => {
  const { user: currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [professionalProfile, setProfessionalProfile] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);
  const [userApplications, setUserApplications] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [jobFilters, setJobFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProfessionalData();
  }, [currentUser]);

  const loadProfessionalData = async () => {
    try {
      setLoading(true);
      
      if (currentUser) {
        const [profile, skills, experience, jobs, applications, companyList, connectionList] = await Promise.all([
          professionalService.getProfessionalProfile(currentUser.id),
          professionalService.getUserSkills(currentUser.id),
          professionalService.getWorkExperience(currentUser.id),
          professionalService.getJobPostings(),
          professionalService.getUserApplications(currentUser.id),
          professionalService.getCompanies(),
          professionalService.getProfessionalConnections(currentUser.id)
        ]);
        
        setProfessionalProfile(profile);
        setUserSkills(skills);
        setWorkExperience(experience);
        setJobPostings(jobs);
        setUserApplications(applications);
        setCompanies(companyList);
        setConnections(connectionList);
      }
    } catch (error) {
      console.error('Failed to load professional data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillEndorse = async (skillId) => {
    try {
      await professionalService.endorseSkill(skillId, currentUser.id);
      loadProfessionalData(); // Refresh data
    } catch (error) {
      console.error('Failed to endorse skill:', error);
    }
  };

  const handleJobApplication = async (jobId) => {
    try {
      await professionalService.applyForJob(jobId, {
        applicantId: currentUser.id,
        coverLetter: "I'm interested in this position and believe my skills would be a great fit.",
        expectedSalary: null,
        availabilityDate: new Date().toISOString().split('T')[0]
      });
      
      loadProfessionalData(); // Refresh data
    } catch (error) {
      console.error('Failed to apply for job:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading professional data...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'jobs', name: 'Jobs', icon: Briefcase },
    { id: 'profile', name: 'My Profile', icon: Users },
    { id: 'companies', name: 'Companies', icon: Building },
    { id: 'network', name: 'My Network', icon: Coffee },
    { id: 'applications', name: 'Applications', icon: Target }
  ];

  const profileCompletion = professionalProfile ? 
    professionalService.calculateProfileCompletion(professionalProfile) : 0;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl font-bold">
              {currentUser?.full_name?.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Professional Dashboard</h1>
              {professionalProfile ? (
                <p className="text-gray-600">{professionalProfile.headline}</p>
              ) : (
                <p className="text-gray-600">Complete your professional profile</p>
              )}
            </div>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Edit className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Profile Completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-900">{profileCompletion}%</span>
              <div className="flex-1 bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-900">Applications</span>
            </div>
            <span className="text-2xl font-bold text-green-900">{userApplications.length}</span>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-900">Connections</span>
            </div>
            <span className="text-2xl font-bold text-purple-900">{connections.length}</span>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Award className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-orange-900">Skills</span>
            </div>
            <span className="text-2xl font-bold text-orange-900">{userSkills.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Profile Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Completion */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Complete Your Profile</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Professional headline</span>
                      <CheckCircle className={`w-4 h-4 ${professionalProfile?.headline ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Work experience</span>
                      <CheckCircle className={`w-4 h-4 ${workExperience.length > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Skills</span>
                      <CheckCircle className={`w-4 h-4 ${userSkills.length > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                    </div>
                  </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Recent Applications</h3>
                  <div className="space-y-3">
                    {userApplications.slice(0, 3).map((application) => (
                      <div key={application.id} className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          application.status === 'reviewing' ? 'bg-yellow-500' :
                          application.status === 'interviewing' ? 'bg-blue-500' :
                          application.status === 'rejected' ? 'bg-red-500' : 'bg-green-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{application.jobTitle}</p>
                          <p className="text-xs text-gray-600">{application.companyName}</p>
                          <p className="text-xs text-gray-500">{application.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill Endorsements */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Top Skills</h3>
                  <div className="space-y-2">
                    {userSkills.slice(0, 4).map((skill) => (
                      <div key={skill.id} className="flex items-center justify-between">
                        <span className="text-sm text-gray-900">{skill.skillName}</span>
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">{skill.endorsements}</span>
                          <button
                            onClick={() => handleSkillEndorse(skill.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Job Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Jobs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {jobPostings.slice(0, 4).map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{job.title}</h4>
                          <p className="text-sm text-gray-600">{job.companyName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {job.location} {job.isRemote && "• Remote"}
                          </p>
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Bookmark className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-lg font-bold text-green-600">
                          {professionalService.formatSalaryRange(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {professionalService.getExperienceLevelDisplay(job.experienceLevel)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                        </div>
                        <button
                          onClick={() => handleJobApplication(job.id)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Jobs Tab */}
          {activeTab === 'jobs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Job Opportunities</h3>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search jobs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                </div>
              </div>

              {/* Job Filters */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={jobFilters.experienceLevel || ''}
                  onChange={(e) => setJobFilters({...jobFilters, experienceLevel: e.target.value || undefined})}
                >
                  <option value="">All Experience Levels</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
                <select 
                  className="border border-gray-300 rounded px-3 py-2 text-sm"
                  value={jobFilters.jobType || ''}
                  onChange={(e) => setJobFilters({...jobFilters, jobType: e.target.value || undefined})}
                >
                  <option value="">All Job Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
                <label className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    checked={jobFilters.isRemote || false}
                    onChange={(e) => setJobFilters({...jobFilters, isRemote: e.target.checked || undefined})}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Remote only</span>
                </label>
              </div>

              {/* Jobs List */}
              <div className="space-y-4">
                {jobPostings.map((job) => (
                  <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Building className="w-6 h-6 text-gray-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                            <p className="text-gray-600">{job.companyName}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {job.location}
                              </span>
                              {job.isRemote && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  Remote
                                </span>
                              )}
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {professionalService.getJobTypeDisplay(job.jobType)}
                              </span>
                              <span className="flex items-center">
                                <DollarSign className="w-4 h-4 mr-1" />
                                {professionalService.formatSalaryRange(job.salaryMin, job.salaryMax)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                        
                        <div className="flex items-center space-x-4 mt-4">
                          <div className="flex flex-wrap gap-2">
                            {job.requiredSkills.slice(0, 4).map((skill, index) => (
                              <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {skill}
                              </span>
                            ))}
                            {job.requiredSkills.length > 4 && (
                              <span className="text-gray-500 text-xs">+{job.requiredSkills.length - 4} more</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {job.viewsCount} views
                            </span>
                            <span className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {job.applicationsCount} applicants
                            </span>
                            <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                              <Bookmark className="w-4 h-4" />
                              <span>Save</span>
                            </button>
                            <button
                              onClick={() => handleJobApplication(job.id)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                            >
                              <Send className="w-4 h-4" />
                              <span>Apply</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Professional Profile</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              </div>

              {/* Professional Info */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-medium text-gray-900 mb-4">Professional Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headline</label>
                    <p className="text-gray-900">{professionalProfile?.headline || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <p className="text-gray-900">{professionalProfile?.industry || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Company</label>
                    <p className="text-gray-900">{professionalProfile?.currentCompany || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                    <p className="text-gray-900">{professionalProfile?.experienceYears || 0} years</p>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Work Experience</h4>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Experience</span>
                  </button>
                </div>
                <div className="space-y-4">
                  {workExperience.map((exp) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900">{exp.position}</h5>
                          <p className="text-gray-600">{exp.companyName}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(exp.startDate).toLocaleDateString()} - {
                              exp.isCurrent ? 'Present' : new Date(exp.endDate).toLocaleDateString()
                            }
                          </p>
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                          {exp.achievements && exp.achievements.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Key Achievements:</p>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {exp.achievements.map((achievement, index) => (
                                  <li key={index}>{achievement}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Skills</h4>
                  <button className="text-blue-600 hover:text-blue-800 flex items-center space-x-1">
                    <Plus className="w-4 h-4" />
                    <span>Add Skill</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userSkills.map((skill) => (
                    <div key={skill.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{skill.skillName}</h5>
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < skill.proficiencyLevel ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>{skill.yearsExperience} years experience</span>
                        <div className="flex items-center space-x-2">
                          <span>{skill.endorsements} endorsements</span>
                          <button
                            onClick={() => handleSkillEndorse(skill.id)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Companies</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Add Company</span>
                </button>
              </div>

              {/* Companies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {companies.map((company) => (
                  <div key={company.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building className="w-8 h-8 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{company.companyName}</h4>
                        <p className="text-sm text-gray-600 mb-2">{company.industry}</p>
                        <p className="text-sm text-gray-700 mb-3">{company.description}</p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                          <span>{company.employeeCount} employees</span>
                          <span>•</span>
                          <span>{company.headquarters}</span>
                          <span>•</span>
                          <span>Founded {company.foundedYear}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{company.followersCount} followers</span>
                            {company.isHiring && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Hiring
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              Follow
                            </button>
                            <button className="text-gray-400 hover:text-gray-600">
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Network Tab */}
          {activeTab === 'network' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Professional Network</h3>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Invite Connections</span>
                </button>
              </div>

              {/* Connections List */}
              <div className="space-y-4">
                {connections.map((connection) => (
                  <div key={connection.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-white font-medium">
                        {connection.avatar}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{connection.fullName}</h4>
                        <p className="text-sm text-gray-600">{connection.headline}</p>
                        <p className="text-xs text-gray-500">{connection.company} • {connection.mutualConnections} mutual connections</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">
                          Message
                        </button>
                        <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                          View Profile
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">My Applications</h3>
                <div className="text-sm text-gray-600">
                  {userApplications.length} total applications
                </div>
              </div>

              {/* Applications List */}
              <div className="space-y-4">
                {userApplications.map((application) => (
                  <div key={application.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                        <p className="text-gray-600">{application.companyName}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Applied {new Date(application.appliedAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>Last updated {new Date(application.statusUpdatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        application.status === 'reviewing' ? 'bg-blue-100 text-blue-800' :
                        application.status === 'interviewing' ? 'bg-purple-100 text-purple-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDashboard;