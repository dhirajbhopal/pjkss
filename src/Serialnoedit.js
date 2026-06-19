// EditSerialNo.js

import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  useSearchParams,
} from "react-router-dom";

const EditSerialNo = () => {

  // URL PARAM
  const [searchParams] =
    useSearchParams();

  const serialno =
    searchParams.get(
      "serialno"
    );

  // USER STATE
  const [user, setUser] =
    useState(null);

  // FORM DATA
  const [formData, setFormData] =
    useState({
      serialno: "",
      issuername: "",
      issuedto: "",
      subject: "",
      issuedate: "",
    });

  // MESSAGE
  const [message, setMessage] =
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

  // LOAD SERIAL DATA
  useEffect(() => {

    if (serialno) {

      fetchSerialData();

    }

  }, [serialno]);

  // FETCH SERIAL DATA
  const fetchSerialData =
    async () => {

    try {

      const response =
        await axios.get(
          `https://pjkss.pythonanywhere.com/search_serial_api?serialno=${serialno}`
        );

      if (
        response.data.success &&
        response.data.data.length > 0
      ) {

        const data =
          response.data.data[0];

        setFormData({
          serialno: data.code,
          issuername:
            data.issuername || "",
          issuedto:
            data.issuedto || "",
          subject:
            data.subject || "",
          issuedate:
            data.issuedate || "",
        });

      }

    } catch (error) {


      setMessage(
        "Unable to load data"
      );
    }
  };

  // HANDLE CHANGE
  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // UPDATE SERIAL
  const handleSubmit =
    async (e) => {

    e.preventDefault();

    try {

      const response =
        await axios.put(
          "https://pjkss.pythonanywhere.com/update_serial_api",
          formData,
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {

        setMessage(
          "Serial updated successfully"
        );

      } else {

        setMessage(
          response.data.message
        );
      }

    } catch (error) {


      setMessage(
        "Update failed"
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
  if ( user.role !== "Admin" && user.role !== "Coremember" &&  user.role !== "Member") {

    return (
      <h1>
        You Do Not Have permission
        to access this page
      </h1>
    );
  }

  return (

    <div className="container-fluid">

      {/* GO BACK */}
      <button
        className="btn btn-outline-danger m-3"
        onClick={() =>
          window.history.back()
        }
      >
        Go Back
      </button>

      {/* MESSAGE */}
      {message && (

        <div className="alert alert-info">

          {message}

        </div>
      )}

      <div
        style={{
          overflowX: "auto",
        }}
      >

        <form
          onSubmit={handleSubmit}
        >

          <table
            className="table table-bordered"
            style={{
              border:
                "3px solid green",
              width: "100%",
              borderCollapse:
                "collapse",
            }}
          >

            <thead
              style={{
                backgroundColor:
                  "black",
                color: "white",
                textAlign:
                  "center",
              }}
            >

              <tr>

                <th>
                  Serial No
                </th>

                <th>
                  Letter Head Person Name
                </th>

                <th>
                  Issue To
                </th>

                <th>
                  Subject
                </th>

                <th>
                  Date
                </th>
              </tr>

            </thead>

            <tbody>

              <tr
                align="center"
              >

                {/* SERIAL NO */}
                <td>

                  <input
                    type="text"
                    name="serialno"
                    value={
                      formData.serialno
                    }
                    disabled
                    style={{
                      textAlign:
                        "center",
                      border: "none",
                      backgroundColor:
                        "transparent",
                    }}
                  />

                </td>

                {/* ISSUER NAME */}
                <td>

                  <input
                    type="text"
                    name="issuername"
                    value={
                      formData.issuername
                    }
                    onChange={
                      handleChange
                    }
                    style={{
                      textAlign:
                        "center",
                      backgroundColor:
                        "green",
                    }}
                  />

                </td>

                {/* ISSUED TO */}
                <td>

                  <input
                    type="text"
                    name="issuedto"
                    value={
                      formData.issuedto
                    }
                    onChange={
                      handleChange
                    }
                    style={{
                      textAlign:
                        "center",
                      backgroundColor:
                        "green",
                    }}
                  />

                </td>

                {/* SUBJECT */}
                <td>

                  <input
                    type="text"
                    name="subject"
                    value={
                      formData.subject
                    }
                    onChange={
                      handleChange
                    }
                    style={{
                      textAlign:
                        "center",
                      backgroundColor:
                        "green",
                    }}
                  />

                </td>

                {/* DATE */}
                <td>

                  <input
                    type="date"
                    name="issuedate"
                    value={
                      formData.issuedate
                    }
                    onChange={
                      handleChange
                    }
                    style={{
                      textAlign:
                        "center",
                         backgroundColor:
                        "green",
                    }}
                  />

                </td>

                {/* BUTTON */}
                <td>

                  <button
                    className="btn btn-success btn-outline-warning"
                  >
                    Update
                  </button>

                </td>

              </tr>

            </tbody>

          </table>

        </form>

      </div>

    </div>
  );
};

export default EditSerialNo;