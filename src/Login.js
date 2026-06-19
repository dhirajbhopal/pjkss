import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";

const Login = () => {
  // USER STATE
  const [ setUser] = useState(null);

  // FORM DATA
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // MESSAGE
  const [message, setMessage] = useState("");

  // LOADING
  const [loading, setLoading] = useState(false);

  // CHECK LOGIN STATUS
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (loggedInUser && isAuthenticated === "true") {
      setUser(loggedInUser);
      window.location.href = "/";
    }
  },  [setUser]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // MAIN LOGIN API
      // Your Django signal '@receiver(user_logged_in)' automatically fires 
      // inside this backend request when authentication succeeds!
      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/api/login/",
        {
          email: formData.email,
          password: formData.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );


      if (response.data.success) {
        // 1. Save user object to LocalStorage
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");

        setMessage("Login Successful! Redirecting...");

        // 2. Safe to redirect immediately because Django already saved the location tracking history!
        window.location.href = "/";
      } else {
        setMessage(response.data.message || "Login Failed");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container d-flex justify-content-center py-1">
        <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
          {/* HEADER */}
          <div
            className="text-center text-white p-1"
            style={{
              background: "linear-gradient(135deg,#198754,#20c997)",
            }}
          >
            <h2 className="fw-bold mb-1">Welcome Back</h2>
          </div>

          {/* BODY */}
          <div className="card-body p-3">
            {/* TOP BUTTONS */}
            <div className="d-flex justify-content-between mb-1">
              <button
                onClick={() => window.history.back()}
                className="btn btn-light rounded-pill px-3"
              >
                <img
                  src="/img/animated-icon-backward_2.gif"
                  height="20px"
                  alt="back"
                />{" "}
                Back
              </button>
              <a
                href="/"
                className="text-decoration-none"
                style={{ fontSize: "32px" }}
              >
                🏠
              </a>
            </div>

            {/* FORM */}
            <form onSubmit={handleSubmit}>
              {/* EMAIL */}
              <div className="mb-1">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "green" }}
                >
                  Email
                </label>
                <label style={{ color: "red" }}> *</label>
                <input
                  type="email"
                  name="email"
                  className="form-control rounded-3 py-1"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-1">
                <label
                  className="form-label fw-semibold"
                  style={{ color: "green" }}
                >
                  Password
                </label>
                <label style={{ color: "red" }}> *</label>
                <input
                  type="password"
                  name="password"
                  className="form-control rounded-3 py-1"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* REMEMBER + FORGOT */}
              <div className="row mb-1">
                <div className="col d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="remember"
                      defaultChecked
                    />
                    <label className="form-check-label" htmlFor="remember">
                      Remember me
                    </label>
                  </div>
                </div>
                <div className="col text-end">
                  <a
                    href="/PasswordReset"
                    className="text-decoration-none"
                    style={{ color: "blue" }}
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* BUTTON */}
              <div className="mb-1">
                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-3 py-1 fw-bold"
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg,#0d6efd,#0dcaf0)",
                    border: "none",
                  }}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            {/* MESSAGE */}
            {message && (
              <div className="alert alert-success text-center rounded-3">
                {message}
              </div>
            )}

            {/* SIGNUP */}
            <div className="text-center mt-1">
              Not a member?{" "}
              <a
                href="/signup"
                className="text-decoration-none fw-bold"
                style={{ color: "red" }}
              >
                Register / Signup
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;