import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from '../components/jobs/JobForm';
import { jobsApi } from '../services/jobsApi';
import { companiesApi } from '../services/companiesApi';

const AddJob = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoadingCompanies(true);
      const response = await companiesApi.getCompanies();
      if (response.success) {
        setCompanies(response.companies || []);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please refresh the page.');
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSubmit = async (values, setSubmitting) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    setSubmitting(true);

    try {
      // Prepare job data
      const jobData = {
        jobTitle: values.jobTitle.trim(),
        jobDescription: values.jobDescription.trim(),
        jobRequirements: values.jobRequirements.trim(),
        jobSalary: parseInt(values.jobSalary, 10),
        jobLocation: values.jobLocation.trim(),
        jobType: values.jobType,
        jobExperience: parseInt(values.jobExperience, 10),
        noofPositions: parseInt(values.noofPositions, 10),
        jobCompany: values.jobCompany,
        jobExpiry: new Date(values.jobExpiry).toISOString(),
      };

      // Call the API
      const response = await jobsApi.addJob(jobData);

      if (response.success) {
        setSuccess(response.message || 'Job added successfully!');
        // Navigate to jobs list after 2 seconds
        setTimeout(() => {
          navigate('/jobs');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add job. Please try again.');
        setSubmitting(false);
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to add job. Please try again.';
      setError(errorMessage);
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  // Filter verified companies
  const verifiedCompanies = companies.filter(company => company.verified === true);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
            Add Job
          </h2>
          <p className="text-center text-yellow-500 font-medium mb-6">
            Post a new job opening and find the perfect candidate
          </p>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded text-center">
              {success}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          {/* Loading Companies */}
          {loadingCompanies ? (
            <div className="text-center py-8">
              <p className="text-blue-800">Loading companies...</p>
            </div>
          ) : verifiedCompanies.length === 0 ? (
            <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
              <p className="font-semibold mb-2">No Verified Companies</p>
              <p className="text-sm">
                You need at least one verified company to post a job.{' '}
                <a
                  href="/companies/add"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Add a company
                </a>{' '}
                and wait for verification before posting jobs.
              </p>
            </div>
          ) : null}

          {/* Job Form */}
          <JobForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Add Job"
            companies={companies}
          />
        </div>
      </div>
    </div>
  );
};

export default AddJob;
