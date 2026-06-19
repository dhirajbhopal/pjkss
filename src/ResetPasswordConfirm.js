import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ResetPasswordConfirm = () => {
   
    // CHECK USER LOGIN STATUS useEffect
  useEffect(() => {

    const isAuthenticated =
      localStorage.getItem("isAuthenticated");

    // IF USER ALREADY LOGGED IN
    if (isAuthenticated === "true") {

      window.location.href = "/";

    }

  }, []);



  const { uid, token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return regex.test(password);
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    // PASSWORD MATCH CHECK
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // PASSWORD VALIDATION
    if (!validatePassword(password)) {
      setError(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
      );
      return;
    }

    try {

      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/api/reset-password/",
        {
          uid,
          token,
          password,
        }
      );

      setMessage(response.data.message);

      setPassword("");
      setConfirmPassword("");

    } catch (error) {

      setError("Invalid or expired link");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.heading}>
          Enter New Password
        </h2>

        <form onSubmit={handleSubmit}>

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
            style={styles.input}
          />

          <button
            type="submit"
            style={styles.button}
          >
            Change Password
          </button>

        </form>

        {message && (
          <p style={styles.success}>
            {message}
          </p>
        )}

        {error && (
          <p style={styles.error}>
            {error}
          </p>
        )}

      </div>
    </div>
  );
};

const styles = {

  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f4f4f4",
  },

  card: {
    width: "400px",
    padding: "10px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },

  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "red"
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
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

export default ResetPasswordConfirm;