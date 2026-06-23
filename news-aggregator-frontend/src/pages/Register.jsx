import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, sendOtp } from "../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: ""
  });

  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async () => {
    // Basic email format regex validation
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(form.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setOtpLoading(true);
    try {
      await sendOtp(form.email);
      setOtpSent(true);
      alert("A 6-digit verification code has been sent to your email.");
    } catch (err) {
      const errMsg = typeof err.response?.data === "string" ? err.response.data : (err.response?.data?.message || "Failed to send verification code. User might already exist.");
      alert(errMsg);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!otpSent) {
      alert("Please request and enter the email verification OTP first.");
      return;
    }

    if (!form.otp || form.otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      const errMsg = typeof err.response?.data === "string" ? err.response.data : (err.response?.data?.message || "Registration failed. Please check your credentials or OTP.");
      alert(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      <form onSubmit={handleRegister} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-800">
        <h2 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
          Create Account
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              onChange={handleChange}
              value={form.username}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="flex gap-2">
              <input
                type="email"
                name="email"
                placeholder="Enter email"
                className="flex-1 p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition disabled:opacity-50"
                onChange={handleChange}
                value={form.email}
                disabled={otpSent}
                required
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpLoading || otpSent || !form.email}
                className="px-4 bg-purple-600 rounded hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-500 border border-transparent disabled:border-gray-700 font-semibold text-sm transition duration-200 whitespace-nowrap min-w-[90px]"
              >
                {otpSent ? "Sent ✓" : otpLoading ? "Sending..." : "Send OTP"}
              </button>
            </div>
            {otpSent && (
              <div className="text-right mt-1.5">
                <button
                  type="button"
                  onClick={() => setOtpSent(false)}
                  className="text-purple-400 hover:text-purple-300 text-xs font-medium transition hover:underline"
                >
                  Change Email
                </button>
              </div>
            )}
          </div>

          {otpSent && (
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verification OTP</label>
              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP code"
                maxLength={6}
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 tracking-[0.2em] font-mono text-center transition"
                onChange={handleChange}
                value={form.otp}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Password</label>
            <input
              type="password"
              name="password"
              placeholder="Create password"
              className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 p-3 rounded-lg font-bold text-white hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-purple-400 hover:text-purple-300 hover:underline font-semibold"
          >
            Login here
          </button>
        </p>
      </form>
    </div>
  );
}
