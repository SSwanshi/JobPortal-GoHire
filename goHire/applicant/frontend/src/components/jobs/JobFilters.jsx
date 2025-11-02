import { Formik, Form, Field } from "formik";
import { applicantApi } from "../services/applicantApi";
import JobCard from "./JobCard";
const JobFilters = () => {
  const handleSubmit = async (values) => {
    const params = new URLSearchParams();
    console.log("clicked");
    Object.entries(values).forEach(([key, value]) => {
      if (value) params.append(key, "true");
    });

    const queryString = params.toString();
    const jobs = 
    console.log(endpoint);
    try {
      const res = await fetch(endpoint, {
        method: "GET", // use "POST" if your backend expects POST
      });
      const data = await res.json();
      console.log("Filtered jobs:", data);
    } catch (error) {
      console.error("Error fetching filtered jobs:", error);
    }
  };

  return (
    <div className="filter-sidebar w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
      <div className="filter-header flex justify-between items-center mb-4">
        <h3 className="font-medium">Filter</h3>
        <button
          type="button"
          className="text-blue-500 text-sm"
          onClick={() => window.location.reload()}
        >
          Clear All
        </button>
      </div>

      <Formik
        initialValues={{
          salary1: false,
          salary2: false,
          salary3: false,
          salary4: false,
          exp1: false,
          exp2: false,
          exp3: false,
          exp4: false,
          exp5: false,
          exp6: false,
        }}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
            {/* Salary Range */}
            <div className="mb-6 border-b border-gray-100 pb-4">
              <details className="group" open>
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h4 className="font-medium">Salary Range</h4>
                  <svg
                    className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </summary>
                <div className="mt-3 space-y-2">
                  {[
                    { id: "salary1", label: "Less than 10LPA" },
                    { id: "salary2", label: "10LPA - 20LPA" },
                    { id: "salary3", label: "20LPA - 30LPA" },
                    { id: "salary4", label: "More than 30LPA" },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center">
                      <Field
                        type="checkbox"
                        name={id}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>

            {/* Experience */}
            <div className="mb-4">
              <details className="group" open>
                <summary className="flex justify-between items-center cursor-pointer list-none">
                  <h4 className="font-medium">Experience</h4>
                  <svg
                    className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </summary>
                <div className="mt-3 space-y-2">
                  {[
                    { id: "exp1", label: "Fresher" },
                    { id: "exp2", label: "Less than a year" },
                    { id: "exp3", label: "1–3 years" },
                    { id: "exp4", label: "3–5 years" },
                    { id: "exp5", label: "5–10 years" },
                    { id: "exp6", label: "More than 10 years" },
                  ].map(({ id, label }) => (
                    <label key={id} className="flex items-center">
                      <Field
                        type="checkbox"
                        name={id}
                        className="mr-2 cursor-pointer"
                      />
                      <span className="text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
              </details>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Apply
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default JobFilters;
