import React, { useState, useEffect } from "react";
import axios from "axios";

const ChangePassword = () => {

  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // CHECK LOGIN
  useEffect(() => {

    const isAuthenticated =
      localStorage.getItem("isAuthenticated");

    if (!isAuthenticated) {

      window.location.href = "/login";

    }

  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  // PASSWORD VALIDATION
  const validatePassword = (password) => {

    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    return regex.test(password);
  };

  // SUBMIT
  const handleSubmit = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");

    // MATCH CHECK
    if (
      formData.new_password !==
      formData.confirm_password
    ) {

      setError("Passwords do not match");
      return;
    }

    // VALIDATION
    if (
      !validatePassword(formData.new_password)
    ) {

      setError(
        "Password must contain uppercase, lowercase, number, special character and minimum 8 characters"
      );

      return;
    }

    try {

      const user =
        JSON.parse(localStorage.getItem("user"));

      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/api/change-password/",
        {
          email: user.email,
          old_password:
            formData.old_password,
          new_password:
            formData.new_password,
        }
      );

      if (response.data.success) {

        setMessage(
          "Password changed successfully"
        );

        setFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });

      } else {

        setError(
          response.data.message
        );

      }

    } catch (error) {

      setError("Server Error");

    }

  };

  return (
    
    <>
    <div
        className="container w-75 p-1 d-flex justify-content-center align-items-center">

        <div
          className="card border-0 shadow-lg rounded-4 overflow-hidden"
          style={{
           // width: "100%",
          }}
        >

          {/* HEADER */}
          <div
            className="text-center text-white p-3"
            style={{
              background:
                "linear-gradient(135deg,#ff1493,#ff69b4)",
            }}
          >

            <h2 className="fw-bold mb-1">
              Change Password
            </h2>
          </div>

           
      <form onSubmit={handleSubmit}>

        {/* OLD PASSWORD */}
        <div className="form-group mb-1 p-2">

          <label>
            Old Password
          </label>

          <input
            type="password"
            name="old_password"
            className="form-control"
            value={formData.old_password}
            onChange={handleChange}
            required
          />

        </div>

        {/* NEW PASSWORD */}
        <div className="form-group mb-1 p-2 ">

          <label>
            New Password
          </label>

          <input
            type="password"
            name="new_password"
            className="form-control"
            value={formData.new_password}
            onChange={handleChange}
            required
          />

        </div>

        {/* CONFIRM PASSWORD */}
        <div className="form-group mb-1 p-2">

          <label>
            Confirm Password
          </label>

          <input
            type="password"
            name="confirm_password"
            className="form-control"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />

        </div>

        {/* BUTTONS */}
        <a
          href="/"
          className="btn btn-primary m-2 py-1">
          Back
        </a>

        <button
          type="submit"
          className="btn btn-success py-1">
          Submit
        </button>

      </form>

      {/* SUCCESS */}
      {message && (

        <p className="text-success mt-3">
          {message}
        </p>

      )}

      {/* ERROR */}
      {error && (

        <p className="text-danger mt-3">
          {error}
        </p>

      )}


          </div>
          </div>
</>
  );

};

export default ChangePassword;