import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const CompanyForm = ({ initialValues, onSubmit, isSubmitting, submitButtonText = "Submit", showProofDocument = true }) => {
  // Validation schema
  const validationSchema = Yup.object({
    companyName: Yup.string()
      .required('Company name is required')
      .min(2, 'Company name must be at least 2 characters')
      .max(100, 'Company name must be less than 100 characters'),
    website: Yup.string()
      .required('Website is required')
      .url('Please enter a valid website URL (e.g., https://www.example.com)'),
    location: Yup.string()
      .required('Location is required')
      .min(2, 'Location must be at least 2 characters')
      .max(200, 'Location must be less than 200 characters'),
    logo: Yup.mixed()
      .nullable()
      .test('fileSize', 'Logo file size must be less than 5MB', (value) => {
        if (!value) return true; // Optional field
        return value.size <= 5 * 1024 * 1024;
      })
      .test('fileType', 'Logo must be an image file (jpg, jpeg, png, gif)', (value) => {
        if (!value) return true; // Optional field
        return ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type);
      }),
    proofDocument: Yup.mixed()
      .nullable()
      .test('fileSize', 'Proof document file size must be less than 10MB', (value) => {
        if (!value) return true; // Optional field
        return value.size <= 10 * 1024 * 1024;
      })
      .test('fileType', 'Proof document must be a PDF, JPG, or PNG file', (value) => {
        if (!value) return true; // Optional field
        return ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
      }),
  });

  // Default initial values
  const defaultValues = {
    companyName: '',
    website: '',
    location: '',
    logo: null,
    proofDocument: null,
    ...initialValues,
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values, setSubmitting);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form className="space-y-6">
          {/* Company Name */}
          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Company Name <span className="text-yellow-500">*</span>
            </label>
            <Field
              id="companyName"
              name="companyName"
              type="text"
              placeholder="Enter company name"
              className={`mt-1 w-full rounded-md border ${
                errors.companyName && touched.companyName
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <ErrorMessage
              name="companyName"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Website */}
          <div>
            <label
              htmlFor="website"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Website <span className="text-yellow-500">*</span>
            </label>
            <Field
              id="website"
              name="website"
              type="url"
              placeholder="https://www.example.com"
              className={`mt-1 w-full rounded-md border ${
                errors.website && touched.website
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <ErrorMessage
              name="website"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Location <span className="text-yellow-500">*</span>
            </label>
            <Field
              id="location"
              name="location"
              type="text"
              placeholder="Enter company location (e.g., City, State, Country)"
              className={`mt-1 w-full rounded-md border ${
                errors.location && touched.location
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <ErrorMessage
              name="location"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Logo Upload */}
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Company Logo
              <span className="text-gray-500 text-xs font-normal ml-2">
                (Optional - JPG, PNG, GIF, max 5MB)
              </span>
            </label>
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif"
              onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue('logo', file);
              }}
              className={`mt-1 w-full rounded-md border ${
                errors.logo && touched.logo
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
            />
            {values.logo && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {values.logo.name}
              </p>
            )}
            <ErrorMessage
              name="logo"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Proof Document Upload */}
          {showProofDocument && (
            <div>
              <label
                htmlFor="proofDocument"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Proof Document
                <span className="text-gray-500 text-xs font-normal ml-2">
                  (Optional - PDF, JPG, PNG, max 10MB)
                </span>
              </label>
              <input
                id="proofDocument"
                name="proofDocument"
                type="file"
                accept="application/pdf,image/jpeg,image/jpg,image/png"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  setFieldValue('proofDocument', file);
                }}
                className={`mt-1 w-full rounded-md border ${
                  errors.proofDocument && touched.proofDocument
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100`}
              />
              {values.proofDocument && (
                <p className="mt-1 text-sm text-gray-600">
                  Selected: {values.proofDocument.name}
                </p>
              )}
              <ErrorMessage
                name="proofDocument"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CompanyForm;

