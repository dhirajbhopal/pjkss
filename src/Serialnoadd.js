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

  // FORM DATA
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

  // HANDLE INPUTS
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // GENERATE SERIAL NUMBER
  const handleGenerateCode = async (e) => {
    e.preventDefault();

    setMessage("");
    setGeneratedCode("");

    if (!formData.issuername.trim()) {
      setMessageType("warning");
      setMessage("Please enter Issuer Name.");
      return;
    }

    const proceed = window.confirm(
      "Do you want to generate and save this serial number?"
    );

    if (!proceed) return;

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

      const data = response.data;

      console.log("Generate API response:", data);

      if (data && (data.success === true || data.code)) {
        if (data.code) {
          setGeneratedCode(data.code);
        }

        setMessageType("success");
        setMessage(
          data.message || "Serial number generated successfully."
        );

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

  // LOADING
  if (!userLoaded) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status" />
        <p className="mt-2">Loading user...</p>
      </div>
    );
  }

  // NOT LOGGED IN
  if (!user) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning">
          You are not logged in.
        </div>
      </div>
    );
  }

  // PERMISSION
  if (user.role !== "Admin") {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4 serial-page">

      {/* PAGE HEADER */}
      <div className="serial-page-header mb-4">
        <div>
          <div className="serial-eyebrow">
            PATEL JAN KALYAN SEVA SAMITI
          </div>

          <h2 className="serial-page-title">
            Serial Number Management
          </h2>

          <p className="text-muted mb-0">
            Generate and manage official letter serial numbers.
          </p>
        </div>

        <div className="serial-header-icon" aria-hidden="true">
          <span>SN</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <div className="serial-navigation mb-4">
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={() => {
            window.location.href = "/searchserialno";
          }}
        >
          <span className="me-2">⌕</span>
          Search Serial No
        </button>

        <button
          type="button"
          className="btn btn-outline-success"
          onClick={() => {
            window.location.href = "/searchserialnoall";
          }}
        >
          <span className="me-2">☷</span>
          View All Records
        </button>
      </div>

      {/* MAIN FORM CARD */}
      <div className="serial-form-card">

        <div className="serial-card-heading">
          <div>
            <h4 className="mb-1">Add New Serial Number</h4>
            <p className="mb-0">
              Enter the letter details below.
            </p>
          </div>

          <span className="serial-admin-badge">
            Admin
          </span>
        </div>

        <form
          onSubmit={handleGenerateCode}
          className="serial-form"
        >
          <div className="row g-3">

            {/* ISSUER NAME */}
            <div className="col-12 col-md-6">
              <label
                htmlFor="issuername"
                className="form-label"
              >
                Issuer Name <span className="text-danger">*</span>
              </label>

              <input
                id="issuername"
                type="text"
                name="issuername"
                className="form-control serial-input"
                value={formData.issuername}
                onChange={handleChange}
                maxLength={50}
                placeholder="Enter issuer name"
                autoComplete="name"
                required
              />

              <small className="text-muted">
                Maximum 50 characters.
              </small>
            </div>

            {/* ISSUED TO */}
            <div className="col-12 col-md-6">
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
                className="form-control serial-input"
                value={formData.issuedto}
                onChange={handleChange}
                maxLength={80}
                placeholder="Enter recipient name"
              />

              <small className="text-muted">
                Maximum 80 characters.
              </small>
            </div>

            {/* SUBJECT */}
            <div className="col-12 col-md-8">
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
                className="form-control serial-input"
                value={formData.subject}
                onChange={handleChange}
                maxLength={100}
                placeholder="Enter letter subject"
              />

              <small className="text-muted">
                Maximum 100 characters.
              </small>
            </div>

            {/* ISSUE DATE */}
            <div className="col-12 col-md-4">
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
                className="form-control serial-input"
                value={formData.issuedate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* FORM FOOTER */}
          <div className="serial-form-footer mt-4">
            <p className="text-muted small mb-0">
              <span className="text-danger">*</span>
              {" "}Required field
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-success serial-generate-btn"
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <span className="me-2">＋</span>
                  Generate Serial Number
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* GENERATED CODE */}
      {generatedCode && (
        <div className="serial-result-card mt-4">
          <div className="serial-result-heading">
            <span className="serial-success-icon">✓</span>

            <div>
              <h5 className="mb-1">
                Serial Number Generated
              </h5>

              <p className="mb-0 text-muted small">
                Your generated code is shown below.
              </p>
            </div>
          </div>

          <div className="serial-code-display">
            <code>{generatedCode}</code>

            <button
              type="button"
              className="btn btn-outline-success"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    String(generatedCode)
                  );

                  setMessageType("success");
                  setMessage(
                    "Serial number copied to clipboard."
                  );
                } catch (error) {
                  console.error("Clipboard error:", error);

                  setMessageType("warning");
                  setMessage(
                    "Unable to copy automatically. Please select and copy the code manually."
                  );
                }
              }}
            >
              Copy Code
            </button>
          </div>
        </div>
      )}

      {/* STATUS MESSAGE */}
      {message && (
        <div
          className={`alert alert-${messageType} mt-4`}
          role="alert"
          aria-live="polite"
        >
          {message}
        </div>
      )}

      {/* RESPONSIVE STYLES */}
      <style>{`
        .serial-page {
          max-width: 1400px;
          margin-left: auto;
          margin-right: auto;
          color: #243247;
        }

        .serial-page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding: 22px 24px;
          background: #ffffff;
          border: 1px solid #e3e9ef;
          border-left: 5px solid #198754;
          border-radius: 12px;
          box-shadow: 0 3px 14px rgba(25, 50, 75, 0.06);
        }

        .serial-eyebrow {
          color: #198754;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.3px;
          margin-bottom: 7px;
        }

        .serial-page-title {
          font-size: clamp(21px, 3vw, 29px);
          font-weight: 700;
          margin-bottom: 7px;
          overflow-wrap: anywhere;
        }

        .serial-header-icon {
          flex: 0 0 58px;
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: #e8f5ed;
          border: 1px solid #c8e7d3;
          color: #198754;
          font-size: 20px;
          font-weight: 800;
        }

        .serial-navigation {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .serial-navigation .btn {
          min-height: 43px;
          border-radius: 8px;
          font-weight: 600;
          padding: 10px 16px;
        }

        .serial-form-card,
        .serial-result-card {
          background: #ffffff;
          border: 1px solid #e1e7ee;
          border-radius: 12px;
          box-shadow: 0 4px 18px rgba(25, 50, 75, 0.07);
          overflow: hidden;
        }

        .serial-card-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 20px 24px;
          background: #f7faf8;
          border-bottom: 1px solid #e3ebe5;
        }

        .serial-card-heading h4 {
          font-size: 19px;
          font-weight: 700;
          color: #243247;
        }

        .serial-card-heading p {
          color: #687789;
          font-size: 14px;
        }

        .serial-admin-badge {
          background: #e1f3e8;
          color: #146c43;
          border: 1px solid #c6e7d2;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
        }

        .serial-form {
          padding: 24px;
        }

        .serial-form .form-label {
          display: block;
          color: #344256;
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 8px;
        }

        .serial-input {
          min-height: 45px;
          border: 1px solid #ccd6e0;
          border-radius: 7px;
          padding: 10px 12px;
          font-size: 15px;
          width: 100%;
          max-width: 100%;
          background-color: #ffffff;
        }

        .serial-input:focus {
          border-color: #198754;
          box-shadow: 0 0 0 3px rgba(25, 135, 84, 0.12);
          outline: none;
        }

        .serial-form .form-text,
        .serial-form small {
          display: block;
          margin-top: 5px;
          font-size: 12px;
        }

        .serial-form-footer {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          padding-top: 20px;
          border-top: 1px solid #e9edf1;
        }

        .serial-generate-btn {
          min-height: 46px;
          padding: 11px 20px;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 3px 8px rgba(25, 135, 84, 0.13);
        }

        .serial-generate-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
        }

        .serial-result-card {
          padding: 22px 24px;
          border-top: 4px solid #198754;
        }

        .serial-result-heading {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
        }

        .serial-result-heading h5 {
          font-size: 17px;
          font-weight: 700;
          color: #146c43;
        }

        .serial-success-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #d9f1e2;
          color: #146c43;
          border-radius: 50%;
          font-size: 22px;
          font-weight: 700;
        }

        .serial-code-display {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
          padding: 16px;
          background: #f4f8f5;
          border: 1px dashed #9cc9ac;
          border-radius: 8px;
        }

        .serial-code-display code {
          color: #146c43;
          font-size: 18px;
          font-weight: 700;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .serial-code-display .btn {
          flex-shrink: 0;
          font-weight: 600;
        }

        @media (max-width: 576px) {
          .serial-page {
            padding-left: 10px !important;
            padding-right: 10px !important;
            padding-top: 16px !important;
          }

          .serial-page-header {
            padding: 16px;
            align-items: flex-start;
          }

          .serial-header-icon {
            width: 43px;
            height: 43px;
            flex-basis: 43px;
            border-radius: 10px;
            font-size: 16px;
          }

          .serial-eyebrow {
            font-size: 9px;
            letter-spacing: 0.7px;
          }

          .serial-page-title {
            font-size: 21px;
          }

          .serial-navigation {
            display: grid;
            grid-template-columns: 1fr;
            gap: 9px;
          }

          .serial-navigation .btn {
            width: 100%;
          }

          .serial-card-heading {
            padding: 16px;
            align-items: flex-start;
          }

          .serial-card-heading h4 {
            font-size: 17px;
          }

          .serial-admin-badge {
            padding: 5px 9px;
          }

          .serial-form {
            padding: 16px;
          }

          .serial-input {
            font-size: 16px;
          }

          .serial-form-footer {
            align-items: stretch;
            flex-direction: column;
            gap: 12px;
          }

          .serial-generate-btn {
            width: 100%;
          }

          .serial-result-card {
            padding: 16px;
          }

          .serial-code-display {
            align-items: stretch;
            flex-direction: column;
          }

          .serial-code-display code {
            font-size: 16px;
          }

          .serial-code-display .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default AddSerialNo;