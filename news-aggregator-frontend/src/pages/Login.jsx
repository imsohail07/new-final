import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, forgotPassword, resetPassword } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password flow state
  const [view, setView] = useState("login"); // "login", "forgot", "reset"
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  // Handle Login submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const token = await loginUser(email, password);
      login(token);
      navigate("/dashboard");
    } catch (err) {
      const errMsg = typeof err.response?.data === "string" ? err.response.data : (err.response?.data?.message || "Login failed. Please check your credentials.");
      alert(errMsg);
      console.error(err);
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle send reset password OTP
  const handleSendResetOtp = async (e) => {
    e.preventDefault();
    const emailRegex = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(resetEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);
    try {
      await forgotPassword(resetEmail);
      alert("A reset OTP has been sent to your email.");
      setView("reset");
    } catch (err) {
      const errMsg = typeof err.response?.data === "string" ? err.response.data : (err.response?.data?.message || "Failed to initiate password reset. Ensure the email is registered.");
      alert(errMsg);
    } finally {
      setForgotLoading(false);
    }
  };

  // Handle actual password reset confirmation
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetOtp || resetOtp.length !== 6) {
      alert("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      alert("Password must be at least 4 characters long.");
      return;
    }

    setResetLoading(true);
    try {
      await resetPassword(resetEmail, resetOtp, newPassword);
      alert("Password updated successfully! Please login with your new password.");
      setView("login");
      // Reset flow states
      setResetEmail("");
      setResetOtp("");
      setNewPassword("");
    } catch (err) {
      const errMsg = typeof err.response?.data === "string" ? err.response.data : (err.response?.data?.message || "Failed to reset password. Please check your OTP.");
      alert(errMsg);
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
      {view === "login" && (
        <form onSubmit={handleLogin} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Welcome Back
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    setResetEmail(email);
                    setView("forgot");
                  }}
                  className="text-xs text-purple-400 hover:text-purple-300 hover:underline font-medium"
                >
                  Forgot Password?
                </button>
              </div>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className="w-full bg-purple-600 p-3 rounded-lg font-bold text-white hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50"
          >
            {loginLoading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-purple-400 hover:text-purple-300 hover:underline font-semibold"
            >
              Register here
            </button>
          </p>
        </form>
      )}

      {view === "forgot" && (
        <form onSubmit={handleSendResetOtp} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Reset Password
          </h2>
          <p className="text-sm text-gray-400 text-center">
            Enter your registered email. We will send you a 6-digit OTP code to verify your identity.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your registered email"
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={forgotLoading}
            className="w-full bg-purple-600 p-3 rounded-lg font-bold text-white hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50"
          >
            {forgotLoading ? "Requesting OTP..." : "Send Reset OTP"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setView("login")}
              className="text-purple-400 hover:text-purple-300 hover:underline font-semibold text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}

      {view === "reset" && (
        <form onSubmit={handleResetPassword} className="bg-gray-900 p-8 rounded-2xl w-full max-w-md space-y-6 shadow-2xl border border-gray-800">
          <h2 className="text-3xl font-extrabold text-center tracking-tight bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
            Choose New Password
          </h2>
          <p className="text-sm text-gray-400 text-center">
            Please enter the 6-digit code sent to <strong className="text-purple-400 font-mono">{resetEmail}</strong> and your new password.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Verification OTP</label>
              <input
                type="text"
                placeholder="6-Digit OTP"
                maxLength={6}
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 tracking-[0.2em] font-mono text-center transition"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full p-2.5 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={resetLoading}
            className="w-full bg-purple-600 p-3 rounded-lg font-bold text-white hover:bg-purple-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 shadow-lg disabled:opacity-50"
          >
            {resetLoading ? "Updating Password..." : "Reset Password"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setView("login")}
              className="text-purple-400 hover:text-purple-300 hover:underline font-semibold text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
