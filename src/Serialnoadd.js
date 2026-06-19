// AddSerialNo.js

import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

const AddSerialNo = () => {

  // USER STATE
  const [user, setUser] =
    useState(null);

  // SERIAL DATA
  const [serialData, setSerialData] =
    useState([]);

  // SEARCH INPUT
  const [serialno, setSerialno] =
    useState("");

  // MESSAGE
  const [message, setMessage] =
    useState("");

  // GENERATED CODE
  const [generatedCode, setGeneratedCode] =
    useState("");

  // LOAD USER
  useEffect(() => {

    const loggedInUser =
      JSON.parse(
        localStorage.getItem("user")
      );

    if (loggedInUser) {
      setUser(loggedInUser);
    }

  }, []);

  // SEARCH SERIAL NO
  const handleSearch = async (e) => {

    e.preventDefault();



    try {

      const response =
        await axios.post(
          "https://pjkss.pythonanywhere.com/searchserialno",
          {
            serialno: serialno,
          },
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {

        setSerialData(
          response.data.serialdata
        );

      } else {

        setMessage(
          response.data.message
        );
      }

    } catch (error) {

      setMessage(
        "Something went wrong"
      );
    }
  };

  // GENERATE SERIAL NUMBER
  const handleGenerateCode =
    async () => {

    const proceed =
      window.confirm(
        "Do you want to Generate Serial No"
      );

    if (!proceed) {
      return;
    }

    try {

      const response =
        await axios.get(
          "https://pjkss.pythonanywhere.com/generate_unique_code_api/",
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {

        setGeneratedCode(
          response.data.code
        );

        alert(
          "Generated Code : " +
          response.data.code
        );

      }

    } catch (error) {

     

      alert(
        "Error generating serial number"
      );
    }
  };

  // NOT LOGGED IN
  if (!user) {

    return (
      <h1>
        You are not logged in
      </h1>
    );
  }

  // NO PERMISSION
  if (user.role !== "Admin") {
    
    return (
      <h1>
        You Do Not Have permission
        to access this page
      </h1>
    );
  }

  return (

    <div className="container mt-4">

      {/* SEARCH FORM */}
      <form
        onSubmit={handleSearch}
      >
        <button
          className="btn btn-info btn-outline-danger"
          style={{
            color: "black",
            fontSize: "15px",
          }}
          onClick={() =>
            window.location.href =
            "/searchserialno"
          }
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
          onClick={() =>
            window.location.href =
            "/searchserialnoall"
          }
        >
          View All
        </button>

      </form>

      {/* GENERATE BUTTON */}
      <button
        onClick={
          handleGenerateCode
        }
        className="btn btn-outline-danger"
        style={{
          color: "black",
          fontSize: "15px",
        }}
      >
        Generate Serial Number
      </button>

      <br />
      <br />

      {/* GENERATED CODE */}
      {generatedCode && (

        <div className="alert alert-success">

          <strong>
            Generated Code :
          </strong>

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