import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const InternshipForm = ({ initialValues, onSubmit, isSubmitting, submitButtonText = "Submit", companies = [] }) => {
  // Validation schema
  const validationSchema = Yup.object({
    intTitle: Yup.string()
      .required('Internship title is required')
      .min(3, 'Internship title must be at least 3 characters')
      .max(100, 'Internship title must be less than 100 characters'),
    intDescription: Yup.string()
      .required('Internship description is required')
      .min(10, 'Internship description must be at least 10 characters')
      .max(5000, 'Internship description must be less than 5000 characters'),
    intRequirements: Yup.string()
      .required('Internship requirements are required')
      .min(10, 'Internship requirements must be at least 10 characters')
      .max(2000, 'Internship requirements must be less than 2000 characters'),
    intStipend: Yup.number()
      .required('Stipend is required')
      .positive('Stipend must be a positive number')
      .min(0, 'Stipend must be at least 0'),
    intLocation: Yup.string()
      .required('Internship location is required')
      .min(2, 'Internship location must be at least 2 characters')
      .max(200, 'Internship location must be less than 200 characters'),
    intDuration: Yup.number()
      .required('Duration is required')
      .integer('Duration must be a whole number')
      .min(1, 'Duration must be at least 1 month')
      .max(24, 'Duration must be less than 24 months'),
    intExperience: Yup.number()
      .required('Experience is required')
      .integer('Experience must be a whole number')
      .min(0, 'Experience must be at least 0 years')
      .max(10, 'Experience must be less than 10 years'),
    intPositions: Yup.number()
      .required('Number of positions is required')
      .integer('Number of positions must be a whole number')
      .min(1, 'At least 1 position is required')
      .max(1000, 'Number of positions must be less than 1000'),
    intCompany: Yup.string()
      .required('Company is required')
      .test('verified-company', 'Please select a verified company', (value) => {
        if (!value) return false;
        const company = companies.find(c => c._id === value);
        return company && company.verified === true;
      }),
    intExpiry: Yup.date()
      .required('Internship expiry date is required')
      .min(new Date(), 'Internship expiry date must be in the future'),
  });

  // Calculate default expiry date (30 days from now)
  const getDefaultExpiryDate = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 30);
    return defaultDate.toISOString().split('T')[0];
  };

  // Default initial values
  const defaultValues = {
    intTitle: '',
    intDescription: '',
    intRequirements: '',
    intStipend: '',
    intLocation: '',
    intDuration: '',
    intExperience: '',
    intPositions: '',
    intCompany: '',
    intExpiry: initialValues?.intExpiry || getDefaultExpiryDate(),
    ...initialValues,
  };

  const handleFormSubmit = async (values, { setSubmitting }) => {
    try {
      await onSubmit(values, setSubmitting);
    } catch (error) {
      setSubmitting(false);
    }
  };

  // Filter verified companies for dropdown
  const verifiedCompanies = companies.filter(company => company.verified === true);

  return (
    <Formik
      initialValues={defaultValues}
      validationSchema={validationSchema}
      onSubmit={handleFormSubmit}
      enableReinitialize
    >
      {({ values, errors, touched }) => (
        <Form className="space-y-6">
          {/* Internship Title */}
          <div>
            <label
              htmlFor="intTitle"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Internship Title <span className="text-yellow-500">*</span>
            </label>
            <Field
              id="intTitle"
              name="intTitle"
              type="text"
              placeholder="e.g., Software Development Intern, Marketing Intern"
              className={`mt-1 w-full rounded-md border ${
                errors.intTitle && touched.intTitle
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <ErrorMessage
              name="intTitle"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Company Selection */}
          <div>
            <label
              htmlFor="intCompany"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Company <span className="text-yellow-500">*</span>
            </label>
            <Field
              as="select"
              id="intCompany"
              name="intCompany"
              className={`mt-1 w-full rounded-md border ${
                errors.intCompany && touched.intCompany
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="">Select a company</option>
              {verifiedCompanies.length === 0 ? (
                <option value="" disabled>
                  No verified companies available. Please add and verify a company first.
                </option>
              ) : (
                verifiedCompanies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.companyName}
                  </option>
                ))
              )}
            </Field>
            <ErrorMessage
              name="intCompany"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
            {verifiedCompanies.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">
                You need at least one verified company to post an internship.
              </p>
            )}
          </div>

          {/* Internship Description */}
          <div>
            <label
              htmlFor="intDescription"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Internship Description <span className="text-yellow-500">*</span>
            </label>
            <Field
              as="textarea"
              id="intDescription"
              name="intDescription"
              rows="5"
              placeholder="Describe the internship role, responsibilities, learning opportunities..."
              className={`mt-1 w-full rounded-md border ${
                errors.intDescription && touched.intDescription
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
            />
            <ErrorMessage
              name="intDescription"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Internship Requirements */}
          <div>
            <label
              htmlFor="intRequirements"
              className="block text-sm font-semibold text-blue-800 mb-1"
            >
              Internship Requirements <span className="text-yellow-500">*</span>
            </label>
            <Field
              as="textarea"
              id="intRequirements"
              name="intRequirements"
              rows="4"
              placeholder="List the required skills, qualifications, and experience..."
              className={`mt-1 w-full rounded-md border ${
                errors.intRequirements && touched.intRequirements
                  ? 'border-red-300'
                  : 'border-blue-300'
              } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical`}
            />
            <ErrorMessage
              name="intRequirements"
              component="div"
              className="mt-1 text-sm text-red-600"
            />
          </div>

          {/* Stipend and Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Stipend */}
            <div>
              <label
                htmlFor="intStipend"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Stipend (₹) <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intStipend"
                name="intStipend"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g., 15000"
                className={`mt-1 w-full rounded-md border ${
                  errors.intStipend && touched.intStipend
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intStipend"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="intLocation"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Internship Location <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intLocation"
                name="intLocation"
                type="text"
                placeholder="e.g., Mumbai, Remote, Hybrid"
                className={`mt-1 w-full rounded-md border ${
                  errors.intLocation && touched.intLocation
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intLocation"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          </div>

          {/* Duration and Experience Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Duration */}
            <div>
              <label
                htmlFor="intDuration"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Duration (Months) <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intDuration"
                name="intDuration"
                type="number"
                min="1"
                max="24"
                placeholder="e.g., 3"
                className={`mt-1 w-full rounded-md border ${
                  errors.intDuration && touched.intDuration
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intDuration"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Experience */}
            <div>
              <label
                htmlFor="intExperience"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Experience (Years) <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intExperience"
                name="intExperience"
                type="number"
                min="0"
                max="10"
                placeholder="e.g., 0"
                className={`mt-1 w-full rounded-md border ${
                  errors.intExperience && touched.intExperience
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intExperience"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          </div>

          {/* Number of Positions and Expiry Date Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Number of Positions */}
            <div>
              <label
                htmlFor="intPositions"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Number of Positions <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intPositions"
                name="intPositions"
                type="number"
                min="1"
                max="1000"
                placeholder="e.g., 5"
                className={`mt-1 w-full rounded-md border ${
                  errors.intPositions && touched.intPositions
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intPositions"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>

            {/* Internship Expiry Date */}
            <div>
              <label
                htmlFor="intExpiry"
                className="block text-sm font-semibold text-blue-800 mb-1"
              >
                Internship Expiry Date <span className="text-yellow-500">*</span>
              </label>
              <Field
                id="intExpiry"
                name="intExpiry"
                type="date"
                className={`mt-1 w-full rounded-md border ${
                  errors.intExpiry && touched.intExpiry
                    ? 'border-red-300'
                    : 'border-blue-300'
                } p-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <ErrorMessage
                name="intExpiry"
                component="div"
                className="mt-1 text-sm text-red-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || verifiedCompanies.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : submitButtonText}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default InternshipForm;

