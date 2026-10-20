// AddSerialNo.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const AddSerialNo = () => {

  // USER STATE
  const [user, setUser] = useState(null);

  // SERIAL DATA
  const [serialData, setSerialData] = useState([]);

  // SEARCH INPUT
  const [serialno, setSerialno] = useState("");

  // MESSAGE
  const [message, setMessage] = useState("");

  // GENERATED CODE
  const [generatedCode, setGeneratedCode] = useState("");

  // FORM DATA
  const [formData, setFormData] = useState({
    issuername: "",
    issuedto: "",
    subject: "",
    issuedate: new Date().toLocaleDateString("en-CA"),
  });

  // LOADING STATE
  const [loading, setLoading] = useState(false);

  // LOAD USER
  useEffect(() => {
    try {
      const loggedInUser = JSON.parse(
        localStorage.getItem("user")
      );

      if (loggedInUser) {
        setUser(loggedInUser);
      }
    } catch (error) {
      console.error("Unable to load user", error);
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

  // SEARCH SERIAL NO
  const handleSearch = async (e) => {
    e.preventDefault();

    setMessage("");

    try {
      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/searchserialno",
        {
          serialno: serialno,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSerialData(response.data.serialdata);
        setMessage("");
      } else {
        setMessage(
          response.data.message || "Serial number not found"
        );
      }
    } catch (error) {
      setMessage("Something went wrong while searching");
    }
  };

  // GENERATE SERIAL NUMBER
  const handleGenerateCode = async (e) => {
    e.preventDefault();

    setMessage("");

    // VALIDATE ISSUER NAME
    if (!formData.issuername.trim()) {
      setMessage("Please enter Issuer Name");
      return;
    }

    // CONFIRM GENERATION
    const proceed = window.confirm(
      "Do you want to generate a Serial Number?"
    );

    if (!proceed) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://pjkss.pythonanywhere.com/generate_unique_code_api/",
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

      if (response.data.success) {
        setGeneratedCode(response.data.code);

        alert(
          "Generated Code: " + response.data.code
        );

        // CLEAR FORM AFTER SUCCESSFUL GENERATION
        setFormData({
          issuername: "",
          issuedto: "",
          subject: "",
          issuedate: new Date().toLocaleDateString("en-CA"),
        });
      } else {
        setMessage(
          response.data.message || "Unable to generate serial number"
        );
      }
    } catch (error) {
      console.error("Generation error:", error);

      setMessage(
        error.response?.data?.message ||
        "Error generating serial number. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // NOT LOGGED IN
  if (!user) {
    return (
      <h1>You are not logged in</h1>
    );
  }

  // NO PERMISSION
  if (user.role !== "Admin") {
    return (
      <h1>You Do Not Have permission to access this page</h1>
    );
  }

  return (
    <div className="container mt-4">

      <h3 className="mb-4">
        Generate Serial Number
      </h3>

      {/* SEARCH AND VIEW ALL BUTTONS */}
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

      {/* GENERATE SERIAL NUMBER FORM */}
      <form
        onSubmit={handleGenerateCode}
        className="card p-4 shadow-sm"
      >

        {/* ISSUER NAME */}
        <div className="mb-3">
          <label
            htmlFor="issuername"
            className="form-label"
          >
            Issuer Name *
          </label>

          <input
            type="text"
            id="issuername"
            name="issuername"
            className="form-control"
            placeholder="Enter issuer name"
            maxLength={50}
            value={formData.issuername}
            onChange={handleChange}
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
            type="text"
            id="issuedto"
            name="issuedto"
            className="form-control"
            placeholder="Enter recipient name"
            maxLength={80}
            value={formData.issuedto}
            onChange={handleChange}
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
            type="text"
            id="subject"
            name="subject"
            className="form-control"
            placeholder="Enter subject or purpose"
            maxLength={100}
            value={formData.subject}
            onChange={handleChange}
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
            type="date"
            id="issuedate"
            name="issuedate"
            className="form-control"
            value={formData.issuedate}
            onChange={handleChange}
          />
        </div>

        {/* GENERATE BUTTON */}
        <button
          type="submit"
          className="btn btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          disabled={loading}
        >
          {loading
            ? "Generating..."
            : "Generate Serial Number"}
        </button>

      </form>

      <br />

      {/* GENERATED CODE */}
      {generatedCode && (
        <div className="alert alert-success">
          <strong>Generated Code: </strong>
          {generatedCode}
        </div>
      )}

      {/* MESSAGE */}
      {message && (
        <div className="alert alert-danger">
          {message}
        </div>
      )}

    </div>
  );
};

export default AddSerialNo;