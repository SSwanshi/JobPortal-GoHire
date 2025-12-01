import { Link } from 'react-router-dom';
import { applicantApi } from '../../services/applicantApi';
import { formatTimeAgo } from '../../utils/formatTimeAgo';

const InternshipCard = ({ internship }) => {
  const companyName = internship.intCompany?.companyName || 'Company Not Available';
   const logoUrl = internship.intCompany?.logoId ? applicantApi.getLogo(internship.intCompany.logoId) : null;

  return (
    <div className="job-card bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="bg-gray-100 p-1.5 rounded-lg">
            <img
              src={logoUrl}
              alt={`${companyName || "Company"} Logo`}
              className="h-12 w-12 object-contain rounded-md"
            />
          </div>

          {/* Internship Title + Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{internship.intTitle}</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mt-1">
              <span className="font-semibold">{companyName || "N/A"}</span>
              <span>•</span>
              <span className="inline-block px-3 py-1 font-medium text-orange-500 bg-orange-100 rounded-full">
                {internship.intDuration} months
              </span>
              <span className="inline-block px-3 py-1 font-medium text-purple-500 bg-purple-100 rounded-full">
                Experience: {internship.intExperience} years
              </span>
              <span className="inline-block px-3 py-1 font-medium text-green-500 bg-green-100 rounded-full">
                Positions: {internship.intPositions}
              </span>
              <span className="inline-block px-3 py-1 font-medium text-red-500 bg-red-100 rounded-full">
                Expiry:{" "}
                {new Date(internship.intExpiry).toLocaleDateString("en-GB")}
              </span>
            </div>
          </div>
        </div>

        {/* Location + Posted Time */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="text-lg font-semibold text-gray-900">
              {internship.intLocation}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            Posted {formatTimeAgo(internship.createdAt)}
          </span>
        </div>
      </div>

      {/* Internship Requirements */}
      {internship.intRequirements && (
        <ul className="text-sm text-gray-600 list-disc list-inside mb-4 space-y-1.5 pl-1">
          {internship.intRequirements.split("\n").map(
            (point, i) =>
              point.trim() && <li key={i}>{point.trim()}</li>
          )}
        </ul>
      )}

      {/* Internship Description */}
      {internship.intDescription && (
        <ul className="text-sm text-gray-600 list-disc list-inside mb-4 space-y-1.5 pl-1">
          {internship.intDescription.split("\n").map(
            (point, i) =>
              point.trim() && <li key={i}>{point.trim()}</li>
          )}
        </ul>
      )}

      {/* Footer Section */}
      <div className="flex items-center justify-between border-t pt-4">
        {internship.intStipned && (
          <div className="text-sm font-medium text-gray-800">
            {internship.intStipned} LPA
          </div>
        )}
        <Link
          to={`/internships/${internship._id}/apply`}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
};
export default InternshipCard;

