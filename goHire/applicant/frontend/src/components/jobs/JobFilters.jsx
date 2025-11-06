import { useState } from "react";
import Slider from "@mui/material/Slider";

export default function JobFilters({ onFiltersChange }) {
  const [salary, setSalary] = useState([0, 100]);
  const [experience, setExperience] = useState([0, 10]);

  const handleSubmit = async () => {
    const filterParams = {
      salaryMin: salary[0],
      salaryMax: salary[1],
      expMin: experience[0],
      expMax: experience[1],
    };

    onFiltersChange(filterParams);
  };

  const handleClear = () => {
    setSalary([0, 100]);
    setExperience([0, 10]);
    onFiltersChange({}); // Clear all filters
  };

  return (
    <div className="filter-sidebar w-full md:w-64 bg-white rounded-lg shadow-sm border border-gray-200 p-4 h-fit">
      <div className="filter-header flex justify-between items-center mb-4">
        <h3 className="font-medium">Filter</h3>
        <button
          type="button"
          className="text-blue-500 text-sm"
          onClick={handleClear}
        >
          Clear All
        </button>
      </div>

      <div className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Salary */}
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h4 className="font-medium mb-2">Salary Range (LPA)</h4>
          <Slider
            value={salary}
            onChange={(_, newValue) => setSalary(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={100}
          />
          <p>Range: {salary[0]} – {salary[1]} LPA</p>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Experience (Years)</h4>
          <Slider
            value={experience}
            onChange={(_, newValue) => setExperience(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={10}
          />
          <p>Range: {experience[0]} – {experience[1]} Years</p>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        >
          Apply
        </button>
      </div>
    </div>
  );
}