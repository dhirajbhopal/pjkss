// SearchSerialNoAll.js

import React, { useState, useEffect } from "react";
import axios from "axios";

const SearchSerialNoAll = () => {
  // USER STATE
  const [user, setUser] = useState(null);

  // SERIAL DATA
  const [serialData, setSerialData] = useState([]);

  // MESSAGE
  const [message, setMessage] = useState("");

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
      setMessage("Unable to read user information");
    }
  }, []);

  // FETCH SERIAL DATA
  useEffect(() => {
    const fetchSerialData = async () => {
      try {
        const response = await axios.get(
          "https://pjkss.pythonanywhere.com/serial_list_api/",
          {
            withCredentials: true,
          }
        );

        if (response.data.success) {
          setSerialData(response.data.data || []);
          setMessage("");
        } else {
          setSerialData([]);
          setMessage("No Data Found");
        }
      } catch (error) {
        setMessage("Something went wrong");
      }
    };

    fetchSerialData();
  }, []);

  // NOT LOGGED IN
  if (!user) {
    return <h1>You are not logged in</h1>;
  }

  // NO PERMISSION
  if (user.role !== "Admin") {
    return (
      <h1>
        You Do Not Have permission to access this page
      </h1>
    );
  }

  return (
    <div className="container-fluid p-2 p-md-3">

      {/* GO BACK BUTTON */}
      <div className="text-center mb-3">
        <button
          className="btn btn-outline-danger"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="alert alert-danger text-center">
          {message}
        </div>
      )}

      {/* TABLE RESPONSIVE WRAPPER */}
      <div
        className="table-responsive"
        style={{
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          border: "3px solid green",
        }}
      >
        <table
          className="table table-bordered mb-0"
          style={{
            width: "100%",
            minWidth: "1000px",
            tableLayout: "fixed",
            borderCollapse: "collapse",
            margin: 0,
          }}
        >
          {/* COLUMN WIDTHS */}
          <colgroup>
            <col style={{ width: "140px" }} />
            <col style={{ width: "220px" }} />
            <col style={{ width: "180px" }} />
            <col style={{ width: "250px" }} />
            <col style={{ width: "120px" }} />
            <col style={{ width: "100px" }} />
          </colgroup>

          {/* TABLE HEADER */}
          <thead
            style={{
              backgroundColor: "black",
              color: "white",
              textAlign: "center",
            }}
          >
            <tr>
              {[
                "Serial No",
                "Letter Head Person Name",
                "Issue To",
                "Subject",
                "Date",
                "Update",
              ].map((heading) => (
                <th
                  key={heading}
                  scope="col"
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    border: "1px solid red",
                    padding: "12px 8px",
                    verticalAlign: "middle",
                    textAlign: "center",
                    whiteSpace: "normal",
                    overflowWrap: "anywhere",
                  }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {serialData.length > 0 ? (
              serialData.map((i, index) => (
                <tr key={i.code || index}>
                  <td
                    style={cellStyle}
                  >
                    {i.code || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuername || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuedto || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.subject || "-"}
                  </td>

                  <td style={cellStyle}>
                    {i.issuedate || "-"}
                  </td>

                  <td style={cellStyle}>
                    <button
                      type="button"
                      className="btn btn-success btn-outline-warning"
                      onClick={() => {
                        window.location.href =
                          `/editserialno?serialno=${encodeURIComponent(
                            i.code
                          )}`;
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    textAlign: "center",
                    padding: "20px",
                    border: "1px solid red",
                  }}
                >
                  {message || "No serial numbers available"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

// COMMON CELL STYLE
const cellStyle = {
  border: "1px solid red",
  padding: "10px 8px",
  textAlign: "center",
  verticalAlign: "middle",
  whiteSpace: "normal",
  overflowWrap: "anywhere",
  wordBreak: "normal",
};

export default SearchSerialNoAll;