import React, { useState, useEffect } from "react";
import axios from "axios";

const PasswordReset = () => {

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");

    if (isAuthenticated === "true") {
      window.location.href = "/";
    }
  }, []);

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // ✅ ADDED

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");
    setLoading(true); // ✅ start loading

    try {
      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/api/password-reset/",
        {
          email: email,
        }
      );

      setMessage(response.data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false); // ✅ always stop loading
    }
  };

  return (
    <div className="container-fluid w-75" align="center">
      <div className="container py-1 d-flex justify-content-center">
        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{ background: "#ffffff" }}
        >
          {/* Header */}
          <div
            className="text-white text-center p-2"
            style={{
              background: "linear-gradient(135deg,#0d6efd,#0dcaf0)",
            }}
          >
            <h2 className="fw-bold mb-2">Reset Password</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />

            {/* ✅ UPDATED BUTTON */}
            <button
              type="submit"
              className="btn btn-danger w-50 rounded-3 mb-1 py-1"
              disabled={loading}
            >
              {loading ? "Sending Reset Link..." : "Send Reset Link"}
            </button>
          </form>

          {message && <p style={styles.success}>{message}</p>}
          {error && <p style={styles.error}>{error}</p>}

          <a href="/login" style={{ color: "red" }}>
            Already i have credentials
          </a>
        </div>
      </div>
    </div>
  );
};

const styles = {
  input: {
    width: "90%",
    padding: "10px",
    margin: "5px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  success: {
    color: "green",
    marginTop: "15px",
    textAlign: "center",
  },

  error: {
    color: "red",
    marginTop: "15px",
    textAlign: "center",
  },
};

export default PasswordReset;