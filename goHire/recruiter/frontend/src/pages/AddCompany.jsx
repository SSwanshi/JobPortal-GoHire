import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CompanyForm from '../components/companies/CompanyForm';
import { companiesApi } from '../services/companiesApi';

const AddCompany = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (values, setSubmitting) => {
    setError('');
    setSuccess('');
    setIsSubmitting(true);
    setSubmitting(true);

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('companyName', values.companyName.trim());
      formData.append('website', values.website.trim());
      formData.append('location', values.location.trim());

      // Append files if they exist
      if (values.logo) {
        formData.append('logo', values.logo);
      }
      if (values.proofDocument) {
        formData.append('proofDocument', values.proofDocument);
      }

      // Call the API
      const response = await companiesApi.addCompany(formData);

      if (response.success) {
        setSuccess(response.message || 'Company added successfully, awaiting verification!');
        // Navigate to companies list after 2 seconds
        setTimeout(() => {
          navigate('/companies');
        }, 2000);
      } else {
        setError(response.message || 'Failed to add company. Please try again.');
        setSubmitting(false);
        setIsSubmitting(false);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to add company. Please try again.';
      setError(errorMessage);
      setSubmitting(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
            Add Company
          </h2>
          <p className="text-center text-yellow-500 font-medium mb-6">
            Register your company to start posting jobs
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

          {/* Company Form */}
          <CompanyForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitButtonText="Add Company"
          />
        </div>
      </div>
    </div>
  );
};

export default AddCompany;
