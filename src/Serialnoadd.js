
// Serialnoadd.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL =
  "https://pjkss.pythonanywhere.com/generate_unique_code_api/";

const AddSerialNo = () => {
  // USER STATE
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  // MESSAGE
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  // GENERATED CODE
  const [generatedCode, setGeneratedCode] = useState("");

  // LOADING STATE
  const [loading, setLoading] = useState(false);

  // MANUAL DATA ENTRY FIELDS
  const [formData, setFormData] = useState({
    issuername: "",
    issuedto: "",
    subject: "",
    issuedate: new Date().toISOString().slice(0, 10),
  });

  // LOAD USER
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("User loading error:", error);
      setUser(null);
    } finally {
      setUserLoaded(true);
    }
  }, []);

  // HANDLE FORM INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // GENERATE SERIAL NUMBER AND SAVE DATA
  const handleGenerateCode = async (e) => {
    e.preventDefault();

    setMessage("");
    setGeneratedCode("");

    // VALIDATE ISSUER NAME
    if (!formData.issuername.trim()) {
      setMessageType("warning");
      setMessage("Please enter Issuer Name.");
      return;
    }

    // CONFIRM GENERATION
    const proceed = window.confirm(
      "Do you want to generate and save this serial number?"
    );

    if (!proceed) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          issuername: formData.issuername.trim(),
          issuedto: formData.issuedto.trim(),
          subject: formData.subject.trim(),
          issuedate: formData.issuedate || null,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Generate API response:", response.data);

      const data = response.data;

      // HANDLE SUCCESSFUL RESPONSE
      if (data && (data.success === true || data.code)) {
        if (data.code) {
          setGeneratedCode(data.code);
        }

        setMessageType("success");
        setMessage(
          data.message || "Serial number generated successfully."
        );

        // RESET FORM AFTER SUCCESS
        setFormData({
          issuername: "",
          issuedto: "",
          subject: "",
          issuedate: new Date().toISOString().slice(0, 10),
        });
      } else {
        setMessageType("warning");
        setMessage(
          data?.message ||
            "The server did not confirm that the serial number was saved."
        );
      }
    } catch (error) {
      console.error("Generate API error:", error);
      console.error("HTTP status:", error.response?.status);
      console.error("Backend response:", error.response?.data);

      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      setMessageType("danger");

      if (!error.response) {
        setMessage(
          "No response from the server. Check your internet connection and backend availability."
        );
      } else if (status === 400) {
        setMessage(
          backendMessage ||
            "Invalid data. Check the required fields and issue date."
        );
      } else if (status === 401 || status === 403) {
        setMessage(
          backendMessage ||
            "Access denied. Check authentication and permissions."
        );
      } else if (status === 404) {
        setMessage("API endpoint not found. Check the Django URL.");
      } else if (status === 405) {
        setMessage(
          "The backend does not allow POST requests for this API."
        );
      } else if (status >= 500) {
        setMessage(
          backendMessage ||
            "Django server error. Check the PythonAnywhere error log."
        );
      } else {
        setMessage(
          backendMessage ||
            `Request failed (HTTP ${status}). Check the browser console.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // USER LOADING
  if (!userLoaded) {
    return (
      <div className="container mt-4">
        Loading user...
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  // NO PERMISSION
  if (user.role !== "Admin") {
    return (
      <h1>You Do Not Have permission to access this page</h1>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Add Serial Number</h3>

      {/* NAVIGATION BUTTONS */}
      <div className="mb-4">
        <button
          type="button"
          className="btn btn-info btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          onClick={() => {
            window.location.href = "/searchserialno";
          }}
        >
          Search
        </button>

        <button
          type="button"
          className="btn btn-outline-danger m-3"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          onClick={() => {
            window.location.href = "/searchserialnoall";
          }}
        >
          View All
        </button>
      </div>

      {/* MANUAL DATA ENTRY FORM */}
      <form onSubmit={handleGenerateCode}>
        {/* ISSUER NAME */}
        <div className="mb-3">
          <label
            htmlFor="issuername"
            className="form-label"
          >
            Issuer Name *
          </label>

          <input
            id="issuername"
            type="text"
            name="issuername"
            className="form-control"
            value={formData.issuername}
            onChange={handleChange}
            maxLength={50}
            placeholder="Enter issuer name"
            required
          />
        </div>

        {/* ISSUED TO */}
        <div className="mb-3">
          <label
            htmlFor="issuedto"
            className="form-label"
          >
            Issued To
          </label>

          <input
            id="issuedto"
            type="text"
            name="issuedto"
            className="form-control"
            value={formData.issuedto}
            onChange={handleChange}
            maxLength={80}
            placeholder="Enter recipient name"
          />
        </div>

        {/* SUBJECT */}
        <div className="mb-3">
          <label
            htmlFor="subject"
            className="form-label"
          >
            Subject
          </label>

          <input
            id="subject"
            type="text"
            name="subject"
            className="form-control"
            value={formData.subject}
            onChange={handleChange}
            maxLength={100}
            placeholder="Enter subject"
          />
        </div>

        {/* ISSUE DATE */}
        <div className="mb-3">
          <label
            htmlFor="issuedate"
            className="form-label"
          >
            Issue Date
          </label>

          <input
            id="issuedate"
            type="date"
            name="issuedate"
            className="form-control"
            value={formData.issuedate}
            onChange={handleChange}
          />
        </div>

        {/* GENERATE BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
        >
          {loading
            ? "Saving..."
            : "Generate Serial Number"}
        </button>
      </form>

      <br />

      {/* GENERATED CODE */}
      {generatedCode && (
        <div className="alert alert-success">
          <strong>Generated Code: </strong>
          <span>{generatedCode}</span>

          <button
            type="button"
            className="btn btn-sm btn-outline-success ms-3"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  generatedCode
                );

                setMessageType("success");
                setMessage(
                  "Serial number copied to clipboard."
                );
              } catch (error) {
                console.error("Clipboard error:", error);

                setMessageType("warning");
                setMessage(
                  "Unable to copy. Please copy the code manually."
                );
              }
            }}
          >
            Copy Code
          </button>
        </div>
      )}

      {/* STATUS MESSAGE */}
      {message && (
        <div
          className={`alert alert-${messageType}`}
          role="alert"
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default AddSerialNo;