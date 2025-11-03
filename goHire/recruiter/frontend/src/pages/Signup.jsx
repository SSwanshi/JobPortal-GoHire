import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import signupImg from "../../src/assets/images/bgimage.png";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await signup(formData);
      if (response.success) {
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center font-poppins overflow-hidden"
      style={{
        backgroundImage: `url(${signupImg})`,
        height: "100vh",
      }}
    >
      {/* Overlay to maintain readability */}
      <div className="absolute inset-0 bg-blue-900/60"></div>

      <div className="relative w-11/12 max-w-4xl bg-white/90 rounded-xl shadow-lg p-8 md:p-10">
        <h2 className="text-3xl font-bold text-center text-blue-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-center text-yellow-500 font-medium mb-6">
          Join GoHire and start your journey today!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded text-center">
              {error}
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-blue-800"
              >
                First Name <span className="text-yellow-500">*</span>
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="mt-1 w-full rounded-md border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-blue-800"
              >
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="mt-1 w-full rounded-md border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-blue-800"
            >
              Email <span className="text-yellow-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="mt-1 w-full rounded-md border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-blue-800"
            >
              Phone <span className="text-yellow-500">*</span>
            </label>
            <div className="flex border border-blue-300 rounded-md overflow-hidden">
              <span className="bg-blue-100 px-3 flex items-center text-blue-800 font-medium">
                +91
              </span>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="flex-1 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold text-blue-800 mb-1">
              Gender <span className="text-yellow-500">*</span>
            </label>
            <div className="flex justify-around text-blue-700">
              {["male", "female", "other"].map((g) => (
                <label
                  key={g}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={formData.gender === g}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="capitalize">{g}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Passwords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-blue-800"
              >
                Password <span className="text-yellow-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="mt-1 w-full rounded-md border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-blue-800"
              >
                Confirm Password <span className="text-yellow-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="mt-1 w-full rounded-md border border-blue-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-start text-sm text-blue-800">
            <input
              id="termsAgree"
              name="termsAgree"
              type="checkbox"
              required
              className="mt-1 mr-2 h-4 w-4 text-blue-600 border-blue-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="termsAgree">
              By signing up, you agree to our{" "}
              <Link
                to="/privacy-policy"
                className="text-yellow-600 hover:underline"
              >
                Privacy Policy
              </Link>{" "}
              and{" "}
              <Link to="/terms" className="text-yellow-600 hover:underline">
                Terms of Use
              </Link>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="text-center text-sm text-blue-800">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-yellow-600 hover:text-yellow-500"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
