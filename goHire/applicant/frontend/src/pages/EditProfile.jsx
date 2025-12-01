import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import profileService from "../services/profileService";
import { useToast } from "../contexts/ToastContext";

const EditProfile = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ strength: 0, text: '', color: '' });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await profileService.getProfile();
      setFormData({
        firstName: data.user.firstName || '',
        lastName: data.user.lastName || '',
        email: data.user.email || '',
        phone: data.user.phone || '',
        gender: data.user.gender || 'male',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      showToast('Failed to load profile data', 'error');
      navigate('/profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }

    // Real-time validation (only validate if field has content)
    if (name === 'firstName' || name === 'lastName') {
      if (value.trim().length > 0) {
        validateName(name, value);
      }
    } else if (name === 'email') {
      if (value.trim().length > 0) {
        validateEmail(value);
      }
    } else if (name === 'phone') {
      if (value.trim().length > 0) {
        validatePhone(value);  
      }
    } else if (name === 'newPassword') {
      checkPasswordStrength(value);
    }
  };

  const validateName = (fieldName, name) => {
    // Allow letters, spaces, hyphens, and apostrophes
    if (!name || name.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: `${fieldName === 'firstName' ? 'First' : 'Last'} name is required`,
      }));
      return false;
    }
    const isValid = /^[A-Za-z\s'-]+$/.test(name) && name.trim().length >= 2;
    setErrors((prev) => ({
      ...prev,
      [fieldName]: !isValid ? `${fieldName === 'firstName' ? 'First' : 'Last'} name should contain at least 2 characters and only letters, spaces, hyphens, or apostrophes` : '',
    }));
    return isValid;
  };

  const validDomains = ['gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'aol', 'protonmail', 'zoho', 'example', 'company', 'iiits', 'google', 'apple', 'sbi', 'flipkart', 'amazon', 'hdfc'];
  const validTLDs = ['com', 'org', 'net', 'edu', 'gov', 'mil', 'co', 'io', 'me', 'app', 'dev', 'info', 'biz', 'xyz', 'online', 'site', 'us', 'uk', 'ca', 'au', 'in', 'de', 'fr', 'tv', 'fm', 'ai', 'store', 'tech', 'blog', 'news', 'media', 'cloud', 'live', 'club', 'shop', 'team', 'space', 'agency'];

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return false;
    }
    // Basic email pattern validation - more flexible
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address.' }));
      return false;
    }

    // Don't block on domain/TLD whitelist - just validate format
    // This allows any valid email format to pass
    setErrors((prev) => ({ ...prev, email: '' }));
    return true;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Phone number is required',
      }));
      return false;
    }
    const isValid = /^[0-9]{10}$/.test(phone);
    setErrors((prev) => ({
      ...prev,
      phone: !isValid ? 'Please enter a valid 10-digit phone number.' : '',
    }));
    return isValid;
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength({ strength: 0, text: '', color: '' });
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/\d/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;

    let text = '';
    let color = '';
    if (strength < 40) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (strength < 70) {
      text = 'Medium';
      color = 'bg-yellow-500';
    } else {
      text = 'Strong';
      color = 'bg-green-500';
    }

    setPasswordStrength({ strength, text, color });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous errors
    setErrors({});

    // Validate all required fields
    const isFirstNameValid = validateName('firstName', formData.firstName);
    const isLastNameValid = validateName('lastName', formData.lastName);
    const isEmailValid = validateEmail(formData.email);
    const isPhoneValid = validatePhone(formData.phone);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid) {
      showToast('Please fix the validation errors before submitting', 'error');
      return;
    }

    // Password validation
    if (formData.currentPassword || formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
        showToast('All password fields are required to change password', 'error');
        return;
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        showToast('New passwords do not match', 'error');
        return;
      }

      if (formData.newPassword.length < 4) {
        showToast('Password must be at least 4 characters long', 'error');
        return;
      }
    }

    try {
      setLoading(true);
      
      // Prepare data to send - only include password fields if they're all filled
      const dataToSend = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        gender: formData.gender,
      };
      
      // Only include password fields if user wants to change password
      if (formData.currentPassword && formData.newPassword && formData.confirmNewPassword) {
        dataToSend.currentPassword = formData.currentPassword;
        dataToSend.newPassword = formData.newPassword;
        dataToSend.confirmNewPassword = formData.confirmNewPassword;
      }
      
      const response = await profileService.updateProfile(dataToSend);
      const message = dataToSend.currentPassword
        ? 'Profile and password updated successfully'
        : response?.message || 'Profile updated successfully';
      
      showToast(message, 'success');
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          error.message || 
                          'Failed to update profile';
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-blue-600"></i>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <header className="pt-32 pb-24 text-white relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center justify-start">
              <div className="relative">
                <div className="w-40 h-40 flex items-center justify-center rounded-full border-4 border-yellow-400 shadow-md bg-blue-50 text-blue-900 text-6xl font-bold">
                  {formData.firstName?.charAt(0).toUpperCase()}
                </div>
              </div>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold text-blue-900 mb-6 pb-2 border-b-2 border-yellow-400">
                Edit Profile Information
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.firstName && (
                      <p className="text-xs mt-1 text-red-500">{errors.firstName}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.lastName && (
                      <p className="text-xs mt-1 text-red-500">{errors.lastName}</p>
                    )}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.email && <p className="text-xs mt-1 text-red-500">{errors.email}</p>}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                    {errors.phone && <p className="text-xs mt-1 text-red-500">{errors.phone}</p>}
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-700">Member Since</label>
                    <p className="text-lg text-blue-900 font-semibold">25 March 2025</p>
                  </div>

                  <div className="md:col-span-2 border-t-2 border-yellow-400 pt-4 mt-4">
                    <h3 className="text-xl font-bold text-blue-900 mb-4">Change Password</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-blue-700">
                          Current Password
                        </label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-blue-700">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.newPassword && (
                          <>
                            <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                                style={{ width: `${passwordStrength.strength}%` }}
                              ></div>
                            </div>
                            <p className={`text-xs mt-1 ${passwordStrength.color.replace('bg-', 'text-')}`}>
                              {passwordStrength.text}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <label className="block text-sm font-medium text-blue-700">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className="mt-1 block text-black w-full border border-blue-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                        {formData.confirmNewPassword && (
                          <p
                            className={`text-xs mt-1 ${
                              formData.newPassword === formData.confirmNewPassword
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            {formData.newPassword === formData.confirmNewPassword
                              ? 'Passwords match'
                              : 'Passwords do not match'}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Note: Leave password fields blank if you don't want to change your password.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => navigate('/profile')}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </header>
  );
};

export default EditProfile;
