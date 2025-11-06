import { useState } from "react";
import Slider from "@mui/material/Slider";

export default function InternshipFilters({ onFiltersChange }) {
  const [stipend, setStipend] = useState([0, 200]);
  const [duration, setDuration] = useState([0, 12]);

  const handleSubmit = async () => {
    const filterParams = {
      stipendMin: stipend[0],
      stipendMax: stipend[1],
      durationMin: duration[0],
      durationMax: duration[1],
    };

    onFiltersChange(filterParams);
  };

  const handleClear = () => {
    setStipend([0, 200]);
    setDuration([0, 12]);
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
          <h4 className="font-medium mb-2">Stipend Range (K)</h4>
          <Slider
            value={stipend}
            onChange={(_, newValue) => setStipend(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={200}
          />
          <p>Range: {stipend[0]} – {stipend[1]} </p>
        </div>

        {/* Experience */}
        <div className="mb-4">
          <h4 className="font-medium mb-2">Duration (Months)</h4>
          <Slider
            value={duration}
            onChange={(_, newValue) => setDuration(newValue)}
            valueLabelDisplay="auto"
            min={0}
            max={12}
          />
          <p>Range: {duration[0]} – {duration[1]} months</p>
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