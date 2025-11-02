import api from './api';

export const applicantApi = {
  getJobs: async (query) => {
    const response = await api.get(`/applicant/jobs?${query}`);
    return response.data.jobs;
  },

  getInternships: async () => {
    const response = await api.get('/applicant/internships');
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get('/applicant/companies');
    return response.data;
  },

  getJobById: async (jobId) => {
    const response = await api.get(`/applicant/jobs/${jobId}`);
    return response.data;
  },

  getInternshipById: async (internshipId) => {
    const response = await api.get(`/applicant/internships/${internshipId}`);
    return response.data;
  },

  applyForJob: async (jobId) => {
    const response = await api.post(`/applicant/jobs/${jobId}/apply`);
    return response.data;
  },

  checkInternshipApplication: async (internshipId) => {
    const response = await api.get(`/applicant/internships/${internshipId}/apply`);
    return response.data;
  },

  applyForInternship: async (internshipId) => {
    const response = await api.post(`/applicant/internships/${internshipId}/apply`);
    return response.data;
  },

  getAppliedJobs: async () => {
    const response = await api.get('/applicant/applied-jobs');
    return response.data;
  },

  getAppliedInternships: async () => {
    const response = await api.get('/applicant/applied-internships');
    return response.data;
  },

  filterJobs: async (filters) => {
    const response = await api.post('/applicant/jobs/filter', filters);
    return response.data;
  },

  filterInternships: async (filters) => {
    const response = await api.post('/applicant/internships/filter', filters);
    return response.data;
  },

  getLogo: (logoId) => {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3000';
    return `${API_BASE}/api/applicant/logo/${logoId}`;
  },
};

