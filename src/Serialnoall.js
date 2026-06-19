// SearchSerialNoAll.js

import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

const SearchSerialNoAll = () => {

  // USER STATE
  const [user, setUser] =
    useState(null);

  // SERIAL DATA
  const [serialData, setSerialData] =
    useState([]);

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

    fetchSerialData();

  }, []);

  // FETCH DATA
  const fetchSerialData =
    async () => {

    try {

      const response =
        await axios.get(
          "https://pjkss.pythonanywhere.com/serial_list_api/",
          {
            withCredentials: true,
          }
        );

      if (response.data.success) {

        setSerialData(
          response.data.data
        );

      } else {

        setMessage(
          "No Data Found"
        );
      }

    } catch (error) {


      setMessage(
        "Something went wrong"
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

    <div className="container-fluid">

      {/* GO BACK BUTTON */}
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

        <div className="alert alert-danger">

          {message}

        </div>
      )}

      {/* TABLE */}
      <table
        className="table table-bordered"
        style={{
          border:
            "3px solid green",
          borderCollapse:
            "collapse",
          width: "100%",
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

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Serial No
            </th>

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Letter Head Person Name
            </th>

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Issue To
            </th>

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Subject
            </th>

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Date
            </th>

            <th
              style={{
                border:
                  "1px solid red",
              }}
            >
              Update
            </th>

          </tr>

        </thead>

        <tbody>

          {serialData.map(
            (i, index) => (

            <tr
              key={index}
              align="center"

            >

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >
                {i.code}
              </td>

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >
                {i.issuername}
              </td>

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >
                {i.issuedto}
              </td>

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >
                {i.subject}
              </td>

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >
                {i.issuedate}
              </td>

              <td
                style={{
                  border:
                    "1px solid red",
                }}
              >

                <button
                  className="btn btn-success btn-outline-warning"
                  onClick={() =>
                    window.location.href =
                    `/editserialno?serialno=${i.code}`
                  }
                >
                  Edit
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
};

export default SearchSerialNoAll;